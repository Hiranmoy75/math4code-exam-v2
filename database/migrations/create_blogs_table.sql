-- Create the blogs table with tenant support
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT, -- Can store Markdown or HTML
    featured_image TEXT,
    category TEXT DEFAULT 'Uncategorized',
    tags TEXT[] DEFAULT '{}',
    author TEXT DEFAULT 'Math4Code Team',
    reading_time TEXT DEFAULT '5 min read',
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Unique slug per tenant to handle multi-tenancy properly
    CONSTRAINT blogs_tenant_slug_key UNIQUE (tenant_id, slug)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS blogs_tenant_id_idx ON public.blogs(tenant_id);
CREATE INDEX IF NOT EXISTS blogs_created_at_idx ON public.blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS blogs_category_idx ON public.blogs(category);
CREATE INDEX IF NOT EXISTS blogs_is_featured_idx ON public.blogs(is_featured) WHERE is_featured = TRUE;

-- Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read blogs (public access), but filtered by tenant_id in application logic
-- Ideally, RLS should enforce tenant_id check if you have a way to pass current tenant context to DB.
-- For simple public read access (where tenant filtering happens in API query):
CREATE POLICY "Allow public read access"
ON public.blogs
FOR SELECT
USING (true);

-- Policy: Only authenticated users (admins) can insert/update/delete
-- Assuming you have a role based system or check auth.uid()
CREATE POLICY "Allow authenticated insert"
ON public.blogs
FOR INSERT
TO authenticated
WITH CHECK (true); -- You might want to stricter tenant checks here

CREATE POLICY "Allow authenticated update"
ON public.blogs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete"
ON public.blogs
FOR DELETE
TO authenticated
USING (true);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
