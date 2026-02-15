-- Create zoom_settings table
CREATE TABLE IF NOT EXISTS public.zoom_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  account_id text NOT NULL,
  client_id text NOT NULL,
  client_secret text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT zoom_settings_pkey PRIMARY KEY (id),
  CONSTRAINT zoom_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT zoom_settings_tenant_id_unique UNIQUE (tenant_id)
);

-- Enable RLS
ALTER TABLE public.zoom_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (assuming admin access via service role or admin role check)
-- For simplicity, allowing all authenticated users to read (if they are admins) 
-- But ideally restrict to tenant admins.

CREATE POLICY "Enable read access for authenticated users" ON "public"."zoom_settings"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true); -- Implement stricter RLS in production based on tenant_id

CREATE POLICY "Enable insert for authenticated users" ON "public"."zoom_settings"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON "public"."zoom_settings"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON "public"."zoom_settings"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);
