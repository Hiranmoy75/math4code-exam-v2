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
import { CloudUpload, Loader2, Save, FileText, Globe, Tag as TagIcon, Layout, Settings, Eye } from "lucide-react";
import { useBlogPost, useUpdateBlogPost } from "@/hooks/blog/useBlog";
import { BlockEditor } from "@/components/blog-builder/BlockEditor";
import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

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

export default function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const slug = decodeURIComponent(resolvedParams.slug);
    const { data: post, isLoading: isFetching } = useBlogPost(slug, undefined);
    const updateMutation = useUpdateBlogPost();

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<BlogFormData>();

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
            }
        }, {
            onSuccess: () => {
                router.push('/admin/blogs');
                router.refresh();
            }
        });

    };

    if (isFetching) {
        return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="h-10 w-10 animate-spin text-green-600" /></div>;
    }

    if (!post) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-white gap-4">
                <p className="text-xl font-medium text-slate-500">Article not found</p>
                <Button variant="outline" onClick={() => router.push('/admin/blogs')}>Back to List</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>Cancel</Button>
                        <div className="h-4 w-px bg-slate-200" />
                        <h1 className="font-semibold text-slate-800 line-clamp-1 max-w-[200px] md:max-w-none">Editing: {post.title}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="hidden md:flex">
                                <Eye className="w-4 h-4 mr-2" /> View Live
                            </Button>
                        </Link>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            disabled={updateMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-900/10 px-6"
                        >
                            {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Update Article
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container max-w-6xl mx-auto py-10 px-4">
                <Tabs defaultValue="editor" className="space-y-6">
                    <div className="flex justify-center">
                        <TabsList className="bg-white border shadow-sm p-1">
                            <TabsTrigger value="editor" className="flex items-center gap-2 px-6"><FileText className="w-4 h-4" /> Writing Paper</TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2 px-6"><Settings className="w-4 h-4" /> Config</TabsTrigger>
                            <TabsTrigger value="seo" className="flex items-center gap-2 px-6"><Globe className="w-4 h-4" /> Search Meta</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="editor" className="space-y-6">
                        <div className="max-w-[850px] mx-auto space-y-8 mt-4">
                            {/* Title Section */}
                            <div className="space-y-4">
                                <Input
                                    placeholder="Enter your professional title..."
                                    className="text-4xl md:text-5xl font-extrabold border-none bg-transparent shadow-none px-0 focus-visible:ring-0 placeholder:text-slate-200 h-auto py-4"
                                    {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                                <Textarea
                                    placeholder="Brief introductory excerpt..."
                                    className="text-xl text-slate-500 border-none bg-transparent shadow-none px-0 focus-visible:ring-0 resize-none h-auto min-h-[40px] italic"
                                    {...register("excerpt", { required: "Excerpt is required" })}
                                />
                            </div>

                            {/* Main Writing Area */}
                            <BlockEditor
                                value={watch("content") || "[]"}
                                onChange={(val) => setValue("content", val, { shouldValidate: true })}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                            <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-4">
                                    <Layout className="w-5 h-5 text-purple-600" />
                                    Categorization
                                </h2>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Article Category</Label>
                                        <Select
                                            onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
                                            value={watch("category")}
                                        >
                                            <SelectTrigger className="h-12">
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
                                        <Label>Target Tags</Label>
                                        <div className="relative">
                                            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input placeholder="math, algebra, exam tips..." className="pl-10 h-12" {...register("tags")} />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 pt-4">
                                        <Checkbox
                                            id="is_featured"
                                            checked={watch("is_featured")}
                                            onCheckedChange={(checked) => setValue("is_featured", checked as boolean)}
                                        />
                                        <Label htmlFor="is_featured" className="font-semibold text-slate-700">Mark as Featured Key Post</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-4">
                                    <CloudUpload className="w-5 h-5 text-orange-600" />
                                    Visuals
                                </h2>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Featured Image URL</Label>
                                        <Input placeholder="https://unsplash.com/..." className="h-12" {...register("featured_image")} />
                                    </div>

                                    {watch("featured_image") && (
                                        <div className="mt-4 rounded-xl overflow-hidden aspect-video border bg-slate-50 relative group">
                                            <img src={watch("featured_image")} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border shadow-sm max-w-3xl mx-auto space-y-8 mt-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-4">
                                <Globe className="w-5 h-5 text-blue-600" />
                                SEO & Metadata
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>SEO Title</Label>
                                        <Input placeholder="Meta title for Google" className="h-12" {...register("seo_title")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reading Intensity</Label>
                                        <Input placeholder="e.g. 5 min read" className="h-12" {...register("reading_time")} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>URL Path (Immutable for consistency)</Label>
                                    <div className="flex rounded-lg overflow-hidden border bg-slate-50">
                                        <span className="px-4 flex items-center text-slate-400 text-sm border-r">/blog/</span>
                                        <Input className="border-none rounded-none focus-visible:ring-0 h-12 bg-transparent text-slate-500 cursor-not-allowed" disabled {...register("slug")} />
                                    </div>
                                    <p className="text-xs text-slate-400 px-1 italic">Slug editing is disabled to preserve inbound links and SEO authority.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Meta Description</Label>
                                    <Textarea className="min-h-[120px] resize-none" placeholder="Provide a compelling description for search results..." {...register("seo_description")} />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
