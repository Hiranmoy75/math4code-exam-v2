import { createClient } from "@/lib/supabase/server";
import { getTenantId } from "@/lib/tenant";
import { notFound } from "next/navigation";

export interface BlogPost {
    id: string;
    tenant_id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    category: string;
    tags: string[];
    author: string;
    reading_time: string;
    is_featured: boolean;
    seo_title: string;
    seo_description: string;
    created_at: string;
    updated_at: string;
}

const TABLE_NAME = "blogs";

export async function getBlogPosts() {
    const supabase = await createClient();
    const tenantId = getTenantId();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching blog posts:", error);
        return [];
    }

    return data as BlogPost[];
}

export async function getFeaturedBlogPost() {
    const supabase = await createClient();
    const tenantId = getTenantId();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("is_featured", true)
        .single();

    if (error) {
        // It's okay if no featured post is found, we can just return null
        if (error.code !== 'PGRST116') {
            console.error("Error fetching featured blog post:", error);
        }
        return null;
    }

    return data as BlogPost;
}

export async function getBlogPostBySlug(slug: string) {
    const supabase = await createClient();
    const tenantId = getTenantId();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("slug", slug)
        .single();

    if (error) {
        // Only log if it's not a "not found" error, or for debugging purposes
        if (error.code !== 'PGRST116') {
            console.error("Error fetching blog post by slug:", error);
        } else {
            // Debug log to help user see what's failing
        }
        return null;
    }

    return data as BlogPost;
}

export async function getRelatedPosts(category: string, currentSlug: string) {
    const supabase = await createClient();
    const tenantId = getTenantId();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("category", category)
        .neq("slug", currentSlug)
        .limit(3);

    if (error) {
        console.error("Error fetching related posts:", error);
        return [];
    }

    return data as BlogPost[];
}
