"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CloudUpload, Loader2, Save, FileText, Globe, Tag as TagIcon, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useTenantId } from "@/lib/tenant";

interface BlogFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string;
    featured_image: string;
    is_featured: boolean;
    seo_title: string;
    seo_description: string;
    reading_time: string;
}

export default function CreateBlogPage() {
    const router = useRouter();
    const { toast } = useToast();
    const tenantId = useTenantId();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormData>({
        defaultValues: {
            is_featured: false,
            reading_time: "5 min read",
            category: "General"
        }
    });

    const onSubmit = async (data: BlogFormData) => {
        setIsSubmitting(true);
        const supabase = createClient();

        try {
            // Basic slug generation if empty
            const slug = data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const { error } = await supabase
                .from('blogs')
                .insert({
                    tenant_id: tenantId,
                    title: data.title,
                    slug: slug,
                    excerpt: data.excerpt,
                    content: data.content, // Simplistic textarea for now, ideally rich text editor or markdown
                    featured_image: data.featured_image,
                    category: data.category,
                    tags: data.tags.split(',').map(tag => tag.trim()), // Convert comma-separated string to array
                    is_featured: data.is_featured,
                    seo_title: data.seo_title || data.title,
                    seo_description: data.seo_description || data.excerpt,
                    reading_time: data.reading_time,
                    author: "Math4Code Team" // Could fetch current user name
                });

            if (error) throw error;

            toast({
                title: "Success!",
                description: "Blog post created successfully.",
            });

            router.push('/admin/blogs');
            router.refresh();

        } catch (error: any) {
            console.error("Error creating blog:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to create blog post.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container max-w-5xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Article</h1>
                    <p className="text-slate-500 mt-1">Share your knowledge and updates with the community.</p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                            <FileText className="w-5 h-5 text-green-600" />
                            <h2 className="font-semibold text-slate-800">Content Details</h2>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Post Title <span className="text-red-500">*</span></Label>
                            <Input id="title" placeholder="e.g. How to Crack CSIR NET in 6 Months" {...register("title", { required: "Title is required" })} />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">/blog/</span>
                                <Input id="slug" placeholder="how-to-crack-csir-net" className="rounded-l-none" {...register("slug")} />
                            </div>
                            <p className="text-xs text-slate-400">Leave empty to auto-generate from title.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt / Summary <span className="text-red-500">*</span></Label>
                            <Textarea id="excerpt" placeholder="Short summary for listing pages & SEO..." className="h-24 resize-none" {...register("excerpt", { required: "Excerpt is required" })} />
                            {errors.excerpt && <p className="text-red-500 text-sm">{errors.excerpt.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Full Content (HTML/Markdown) <span className="text-red-500">*</span></Label>
                            <Textarea id="content" placeholder="Write your article here..." className="min-h-[400px] font-mono text-sm leading-relaxed" {...register("content", { required: "Content is required" })} />
                            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                            <Globe className="w-5 h-5 text-blue-600" />
                            <h2 className="font-semibold text-slate-800">SEO Optimized Metadata</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="seo_title">SEO Title</Label>
                                <Input id="seo_title" placeholder="Custom meta title" {...register("seo_title")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reading_time">Reading Time</Label>
                                <Input id="reading_time" placeholder="e.g. 8 min read" {...register("reading_time")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seo_description">Meta Description</Label>
                            <Textarea id="seo_description" placeholder="Custom meta description for search engines..." className="h-20" {...register("seo_description")} />
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                            <Layout className="w-5 h-5 text-purple-600" />
                            <h2 className="font-semibold text-slate-800">Publishing</h2>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={(val) => setValue("category", val)} defaultValue="General">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CSIR NET">CSIR NET</SelectItem>
                                    <SelectItem value="GATE">GATE</SelectItem>
                                    <SelectItem value="IIT JAM">IIT JAM</SelectItem>
                                    <SelectItem value="General">General Strategy</SelectItem>
                                    <SelectItem value="News">Exam News</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <div className="relative">
                                <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input id="tags" placeholder="math, algebra, exam tips..." className="pl-9" {...register("tags")} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="is_featured"
                                checked={watch("is_featured")}
                                onCheckedChange={(checked) => setValue("is_featured", checked as boolean)}
                            />
                            <Label htmlFor="is_featured" className="cursor-pointer font-medium text-slate-700">Mark as Featured Key Post</Label>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                            <CloudUpload className="w-5 h-5 text-orange-600" />
                            <h2 className="font-semibold text-slate-800">Featured Image</h2>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="featured_image">Image URL</Label>
                            <Input id="featured_image" placeholder="https://..." {...register("featured_image")} />
                            <p className="text-xs text-slate-400">Enter a direct image link for the header cover.</p>
                        </div>

                        {/* Preview */}
                        {watch("featured_image") && (
                            <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 aspect-video relative bg-slate-50">
                                <img src={watch("featured_image")} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/10">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publishing...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-5 w-5" /> Publish Article
                            </>
                        )}
                    </Button>

                </div>
            </form>
        </div>
    );
}
