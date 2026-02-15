import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateZoomCredentials } from '@/lib/zoom';
import { getTenantId } from '@/lib/tenant';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const runtime = 'edge';

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// GET - Fetch Zoom settings
export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tenantId = getTenantId();
        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant configuration missing' }, { status: 500 });
        }

        const { data: settings, error } = await supabase
            .from('zoom_settings')
            .select('*')
            .eq('tenant_id', tenantId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (!settings) {
            return NextResponse.json({ hasSettings: false });
        }

        // Mask secrets
        const mask = (s: string) => s ? `${'*'.repeat(s.length - 4)}${s.slice(-4)}` : '';

        return NextResponse.json({
            hasSettings: true,
            account_id: mask(settings.account_id),
            client_id: mask(settings.client_id),
            client_secret: settings.client_secret ? '********' : '', // Never return full secret
            is_active: settings.is_active,
            created_at: settings.created_at
        });
    } catch (error: any) {
        console.error('Get Zoom Settings Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Save Zoom settings
export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tenantId = getTenantId();
        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant configuration missing' }, { status: 500 });
        }

        const body = await req.json();
        const account_id = body.account_id?.trim();
        const client_id = body.client_id?.trim();
        const client_secret = body.client_secret?.trim();

        if (!account_id || !client_id || !client_secret) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate
        const isValid = await validateZoomCredentials(account_id, client_id, client_secret);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid Zoom credentials' }, { status: 400 });
        }

        // Upsert
        const { error } = await supabase
            .from('zoom_settings')
            .upsert({
                tenant_id: tenantId,
                account_id,
                client_id,
                client_secret,
                is_active: true,
                updated_at: new Date().toISOString()
            }, { onConflict: 'tenant_id' });

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Zoom settings saved' });
    } catch (error: any) {
        console.error('Save Zoom Settings Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Remove Zoom settings
export async function DELETE(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tenantId = getTenantId();
        if (!tenantId) return NextResponse.json({ error: 'Tenant configuration missing' }, { status: 500 });

        const { error } = await supabase
            .from('zoom_settings')
            .delete()
            .eq('tenant_id', tenantId);

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Zoom settings deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
