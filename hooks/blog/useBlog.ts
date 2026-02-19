import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useTenantId } from "@/lib/tenant";
import { BlogPost } from "@/lib/blog";
import { useToast } from "@/hooks/use-toast";

const TABLE_NAME = "blogs";

// === Queries ===

export function useBlogPosts(category?: string, searchTerm?: string) {
    const tenantId = useTenantId();
    const supabase = createClient();

    return useQuery({
        queryKey: ["blogs", tenantId, category, searchTerm],
        queryFn: async () => {
            let query = supabase
                .from(TABLE_NAME)
                .select("*")
                .eq("tenant_id", tenantId)
                .order("created_at", { ascending: false });

            if (category && category !== "all") {
                query = query.eq("category", category);
            }

            if (searchTerm) {
                query = query.ilike("title", `%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching blog posts:", error);
                throw error;
            }

            return data as BlogPost[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useBlogPost(slug: string, initialData?: BlogPost | null) {
    const tenantId = useTenantId();
    const supabase = createClient();

    return useQuery({
        queryKey: ["blog", tenantId, slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select("*")
                .eq("tenant_id", tenantId)
                .eq("slug", slug)
                .single();

            if (error) {
                // Ignore "no rows found" error for cleaner console
                if (error.code !== "PGRST116") {
                    console.error("Error fetching blog post:", error);
                    throw error;
                }
                return null;
            }

            return data as BlogPost;
        },
        enabled: !!slug,
        initialData: initialData || undefined, // Use server data if available
    });
}

// === Mutations (Admin Actions) ===

export function useCreateBlogPost() {
    const tenantId = useTenantId();
    const supabase = createClient();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (newPost: Omit<BlogPost, "id" | "tenant_id" | "created_at" | "updated_at">) => {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .insert({
                    ...newPost,
                    tenant_id: tenantId,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs", tenantId] });
            toast({
                title: "Success",
                description: "Blog post created successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create blog post.",
                variant: "destructive",
            });
        },
    });
}

export function useUpdateBlogPost() {
    const tenantId = useTenantId();
    const supabase = createClient();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlogPost> }) => {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .update(updates)
                .eq("id", id)
                .eq("tenant_id", tenantId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (updatedPost) => {
            queryClient.invalidateQueries({ queryKey: ["blogs", tenantId] });
            queryClient.invalidateQueries({ queryKey: ["blog", tenantId, updatedPost.slug] });
            toast({
                title: "Success",
                description: "Blog post updated successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update blog post.",
                variant: "destructive",
            });
        },
    });
}

export function useDeleteBlogPost() {
    const tenantId = useTenantId();
    const supabase = createClient();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq("id", id)
                .eq("tenant_id", tenantId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs", tenantId] });
            toast({
                title: "Success",
                description: "Blog post deleted successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete blog post.",
                variant: "destructive",
            });
        },
    });
}
