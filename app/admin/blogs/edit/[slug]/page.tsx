"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CloudUpload, Loader2, Save, FileText, Globe, Tag as TagIcon, Layout } from "lucide-react";
import { useBlogPost, useUpdateBlogPost } from "@/hooks/blog/useBlog";

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

import { use } from "react";

export default function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const slug = decodeURIComponent(resolvedParams.slug);
    const { data: post, isLoading: isFetching } = useBlogPost(slug, undefined);
    const updateMutation = useUpdateBlogPost();

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<BlogFormData>();

    // Populate form when data is loaded
    useEffect(() => {
        if (post) {
            reset({
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                category: post.category,
                tags: post.tags?.join(', ') || '',
                featured_image: post.featured_image,
                is_featured: post.is_featured,
                seo_title: post.seo_title || post.title,
                seo_description: post.seo_description || post.excerpt,
                reading_time: post.reading_time || "5 min read",
            });
        }
    }, [post, reset]);

    const onSubmit = (data: BlogFormData) => {
        if (!post) return;

        updateMutation.mutate({
            id: post.id,
            updates: {
                title: data.title,
                excerpt: data.excerpt,
                content: data.content,
                category: data.category,
                tags: data.tags.split(',').map(tag => tag.trim()),
                featured_image: data.featured_image,
                is_featured: data.is_featured,
                seo_title: data.seo_title,
                seo_description: data.seo_description,
                reading_time: data.reading_time,
                // Don't update slug to prevent broken links or complex redirects for now, 
                // unless you specifically want to support slug changes.
            }
        }, {
            onSuccess: () => {
                router.push('/admin/blogs');
                router.refresh();
            }
        });

    };

    if (isFetching) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>;
    }

    if (!post) {
        return <div className="text-center py-20">Article not found</div>;
    }

    return (
        <div className="container max-w-5xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Article</h1>
                    <p className="text-slate-500 mt-1">Update your content.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                </div>
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
                            <Input id="title" {...register("title", { required: "Title is required" })} />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">/blog/</span>
                                <Input id="slug" disabled className="rounded-l-none bg-slate-50 text-slate-500" {...register("slug")} title="Slug editing disabled to prevent broken links" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt / Summary <span className="text-red-500">*</span></Label>
                            <Textarea id="excerpt" className="h-24 resize-none" {...register("excerpt", { required: "Excerpt is required" })} />
                            {errors.excerpt && <p className="text-red-500 text-sm">{errors.excerpt.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Full Content (HTML/Markdown) <span className="text-red-500">*</span></Label>
                            <Textarea id="content" className="min-h-[400px] font-mono text-sm leading-relaxed" {...register("content", { required: "Content is required" })} />
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
                                <Input id="seo_title" {...register("seo_title")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reading_time">Reading Time</Label>
                                <Input id="reading_time" {...register("reading_time")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seo_description">Meta Description</Label>
                            <Textarea id="seo_description" className="h-20" {...register("seo_description")} />
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
                            {/* Select component from shadcn is tricky with react-hook-form direct ref, using controller pattern or effect */}
                            <Select
                                onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
                                value={watch("category")}
                            >
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
                                <Input id="tags" className="pl-9" {...register("tags")} />
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
                            <Input id="featured_image" {...register("featured_image")} />
                        </div>

                        {/* Preview */}
                        {watch("featured_image") && (
                            <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 aspect-video relative bg-slate-50">
                                <img src={watch("featured_image")} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={updateMutation.isPending} className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/10">
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-5 w-5" /> Update Article
                            </>
                        )}
                    </Button>

                </div>
            </form>
        </div>
    );
}
