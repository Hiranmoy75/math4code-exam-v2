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
import { CloudUpload, Loader2, Save, FileText, Globe, Tag as TagIcon, Layout, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useTenantId } from "@/lib/tenant";
import { BlockEditor } from "@/components/blog-builder/BlockEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            category: "General",
            content: ""
        }
    });

    const onSubmit = async (data: BlogFormData) => {
        setIsSubmitting(true);
        const supabase = createClient();

        try {
            const slug = data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const { error } = await supabase
                .from('blogs')
                .insert({
                    tenant_id: tenantId,
                    title: data.title,
                    slug: slug,
                    excerpt: data.excerpt,
                    content: data.content,
                    featured_image: data.featured_image,
                    category: data.category,
                    tags: data.tags.split(',').map(tag => tag.trim()),
                    is_featured: data.is_featured,
                    seo_title: data.seo_title || data.title,
                    seo_description: data.seo_description || data.excerpt,
                    reading_time: data.reading_time,
                    author: "Math4Code Team"
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
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>Cancel</Button>
                        <div className="h-4 w-px bg-slate-200" />
                        <h1 className="font-semibold text-slate-800">Draft Content</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-900/10"
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Publish Article
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container max-w-6xl mx-auto py-10 px-4">
                <Tabs defaultValue="editor" className="space-y-6">
                    <div className="flex justify-center">
                        <TabsList className="bg-white border shadow-sm p-1">
                            <TabsTrigger value="editor" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Writing Paper</TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2"><Settings className="w-4 h-4" /> Article Settings</TabsTrigger>
                            <TabsTrigger value="seo" className="flex items-center gap-2"><Globe className="w-4 h-4" /> SEO & Meta</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="editor" className="space-y-6">
                        <div className="max-w-[850px] mx-auto space-y-8">
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

                            {/* Main Content Area */}
                            <BlockEditor
                                value={watch("content") || "[]"}
                                onChange={(val) => setValue("content", val, { shouldValidate: true })}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-4">
                                    <Layout className="w-5 h-5 text-purple-600" />
                                    Categorization
                                </h2>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Article Category</Label>
                                        <Select onValueChange={(val) => setValue("category", val)} defaultValue="General">
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
                        <div className="bg-white p-8 rounded-2xl border shadow-sm max-w-3xl mx-auto space-y-8">
                            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-4">
                                <Globe className="w-5 h-5 text-blue-600" />
                                Search Engine Optimization
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>SEO Title</Label>
                                        <Input placeholder="Meta title for Google" className="h-12" {...register("seo_title")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reading Intensity</Label>
                                        <Input placeholder="e.g. 8 min read" className="h-12" {...register("reading_time")} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>URL Path</Label>
                                    <div className="flex rounded-lg overflow-hidden border">
                                        <span className="bg-slate-50 px-4 flex items-center text-slate-400 text-sm border-r">math4code.com/blog/</span>
                                        <Input className="border-none rounded-none focus-visible:ring-0 h-12" {...register("slug")} />
                                    </div>
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
