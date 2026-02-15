'use server';

import { createClient } from "@/lib/supabase/server";
import { getZoomAccessToken, createZoomMeeting } from "@/lib/zoom";
import { getTenantId } from "@/lib/tenant";
import { revalidatePath } from "next/cache";

export async function createZoomMeetingAction(
    meetingTopic: string,
    startTime: string, // ISO string
    durationMinutes: number
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: "Unauthorized" };
        }

        // Get Tenant ID
        const tenantId = getTenantId();

        if (!tenantId) {
            return { error: "Tenant configuration missing" };
        }

        // Fetch Zoom Settings
        const { data: settings } = await supabase
            .from('zoom_settings')
            .select('*')
            .eq('tenant_id', tenantId)
            .single();

        if (!settings || !settings.is_active) {
            return { error: "Zoom integration not configured. Please check Admin Settings." };
        }

        // Get Token
        const token = await getZoomAccessToken(
            settings.account_id,
            settings.client_id,
            settings.client_secret
        );

        // Create Meeting
        // Zoom expects '2024-01-01T10:00:00' format (no Z) for local time if type is scheduled?
        // Actually ISO format works, but time zone matters.
        // We will send startTime as is, assuming it's what user selected.
        const meeting = await createZoomMeeting(
            token,
            meetingTopic,
            startTime,
            durationMinutes
        );

        return {
            success: true,
            meetingUrl: meeting.join_url,
            meetingPassword: meeting.password,
            meetingId: meeting.id,
            start_time: meeting.start_time
        };

    } catch (error: any) {
        console.error("Create Zoom Meeting Error:", error);
        return { error: error.message || "Failed to create Zoom meeting" };
    }
}
