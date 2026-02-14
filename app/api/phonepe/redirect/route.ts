import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js"; // Removed manual init
import { createClient } from "@/lib/supabase/server"; // For fallback
import { createAdminClient } from "@/lib/supabase/admin";
import { checkPaymentStatus } from "@/lib/phonepe";

// export const runtime = 'edge';


// Shared logic for processing redirect (POST or GET)
async function processRedirect(req: Request, transactionId: string) {
  try {
    let supabase;
    try {
      // Try to use Admin Client for RLS bypass
      supabase = createAdminClient();
    } catch (e) {

      supabase = await createClient();
    }
    // Check payment status from PhonePe
    // First, fetch the tenant_id for this payment to get the right credentials
    const { data: initialPayment } = await supabase
      .from("course_payments")
      .select("tenant_id")
      .eq("transaction_id", transactionId)
      .single();

    if (!initialPayment?.tenant_id) {
      throw new Error("Tenant ID not found for transaction");
    }

    // Fetch tenant-specific PhonePe settings
    let { data: gatewaySettings } = await supabase
      .from("payment_gateway_settings")
      .select("*")
      .eq("tenant_id", initialPayment.tenant_id)
      .eq("gateway_type", "phonepe")
      .eq("is_active", true)
      .single();

    if (!gatewaySettings) {
      // Fallback to math4code default if needed
      const { data: mathenticsTenant } = await supabase.from("tenants").select("id").eq("slug", "mathentics").single();
      if (mathenticsTenant) {
        const { data: defaultSettings } = await supabase
          .from("payment_gateway_settings")
          .select("*")
          .eq("tenant_id", mathenticsTenant.id)
          .eq("gateway_type", "phonepe")
          .eq("is_active", true)
          .single();

        if (defaultSettings) {
          gatewaySettings = defaultSettings;
        }
      }
    }

    if (!gatewaySettings) {
      throw new Error("PhonePe settings not found for tenant");
    }

    const phonePeConfig = {
      merchantId: gatewaySettings.phonepe_merchant_id!,
      clientId: gatewaySettings.phonepe_client_id!,
      clientSecret: gatewaySettings.phonepe_client_secret!,
      clientVersion: parseInt(gatewaySettings.phonepe_client_version || "1"),
      environment: gatewaySettings.phonepe_environment as 'preprod' | 'production'
    };

    const statusResponse = await checkPaymentStatus(phonePeConfig, transactionId);
    const state = statusResponse.state;
    let status = "pending";
    if (state === "COMPLETED" || state === "PAYMENT_SUCCESS") status = "success";
    else if (state === "FAILED" || state === "PAYMENT_ERROR" || state === "PAYMENT_DECLINED") status = "failed";

    // Update DB - Use course_payments for all payments (courses and test series)
    const { data: payment } = await supabase
      .from("course_payments")
      .update({ status: status, metadata: statusResponse })
      .eq("transaction_id", transactionId)
      .select()
      .single();

    const userId = payment?.user_id;
    const courseId = payment?.course_id;

    // Activate Enrollment if success
    if (status === "success" && userId && courseId) {
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      if (!existingEnrollment) {
        const { error: enrollError } = await supabase.from("enrollments").insert({
          user_id: userId,
          course_id: courseId,
          status: "active",
          payment_id: payment?.id,
          enrolled_at: new Date().toISOString(),
          progress: 0
        });
      } else {
        const { error: updateError } = await supabase.from("enrollments").update({
          status: "active",
          payment_id: payment?.id
        }).eq("id", existingEnrollment.id);
      }
    }

    // Redirect based on determined status
    const url = new URL(req.url);
    const source = url.searchParams.get("source");

    // 1. Mobile App Redirect (Deep Link)
    if (source === "mobile") {
      const deepLink = `math4code://payment/verify?txnId=${transactionId}&status=${status}`;
      return NextResponse.redirect(deepLink, 303);
    }

    // 2. Website Redirect (Default)
    if (status === "success" || status === "pending") {
      return NextResponse.redirect(new URL(`/student/payment/verify?txnId=${transactionId}`, req.url), 303);
    } else {
      return NextResponse.redirect(new URL(`/student/payment/verify?txnId=${transactionId}&error=failed`, req.url), 303);
    }

  } catch (error: any) {

    return NextResponse.redirect(new URL(`/student/dashboard?error=payment_error`, req.url), 303);
  }
}

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const transactionId = (formData.get("transactionId") || formData.get("merchantOrderId") || formData.get("merchantTransactionId") || formData.get("code")) as string;

    // PhonePe sometimes sends 'code' and 'merchantId' but maybe 'transactionId' is named differently or missing?
    // If we only get code/merchantId, we might need to rely on the session or something else, but usually transactionId is there.

    if (transactionId) {
      return processRedirect(req, transactionId);
    }

    return NextResponse.redirect(new URL(`/student/dashboard?error=invalid_redirect_post_missing_id`, req.url), 303);
  } catch (e) {

    return NextResponse.redirect(new URL(`/student/dashboard?error=invalid_redirect_post_error`, req.url), 303);
  }
}

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);


  const transactionId = searchParams.get("transactionId") || searchParams.get("merchantTransactionId") || searchParams.get("merchantOrderId");

  if (transactionId) {
    return processRedirect(req, transactionId);
  }

  return NextResponse.redirect(new URL(`/student/dashboard?error=invalid_redirect`, req.url), 303);
}
