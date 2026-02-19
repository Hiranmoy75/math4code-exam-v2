"use client";

import { useBlogPost, useBlogPosts } from "@/hooks/blog/useBlog"; // Assuming useBlogPosts can filter related
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/BlogCard";
import { Calendar, User, ArrowLeft, Facebook, Twitter, Linkedin, Share2, CheckCircle2, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";

import { BlogPost } from "@/lib/blog";

export function ClientBlogDetail({ slug, initialPost }: { slug: string; initialPost?: BlogPost }) {
    const { data: post, isLoading, error } = useBlogPost(slug, initialPost);

    // We can fetch related posts client side too, or pass them if we wanted.
    // Assuming we need to implement a "useRelatedPosts" or re-use useBlogPosts with filter
    // For now, let's just use useBlogPosts filtering by category if we have the post
    const { data: allPosts } = useBlogPosts(post?.category);
    const relatedPosts = allPosts?.filter(p => p.slug !== slug).slice(0, 3) || [];

    useEffect(() => {
        if (!isLoading && !post && !error) {
            // Handle 404 client side if needed, or just show not found UI
        }
    }, [isLoading, post, error]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                <p className="text-slate-500 mb-8">The article you are looking for does not exist or has been removed.</p>
                <Link href="/blog">
                    <Button className="bg-green-600 hover:bg-green-700">Back to Blog</Button>
                </Link>
            </div>
        );
    }

    // JSON-LD Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.featured_image,
        "datePublished": post.created_at,
        "dateModified": post.updated_at || post.created_at,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "description": post.seo_description || post.excerpt,
    };

    return (
        <article className="min-h-screen bg-white font-sans selection:bg-green-100 selection:text-green-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Header */}
            {post && (
                <header className="relative h-[60vh] min-h-[500px] flex items-end justify-center pb-20 text-white">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={post.featured_image || "/placeholder-blog-hero.jpg"}
                            alt={post.title}
                            fill
                            className="object-cover brightness-[0.4]"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                    </div>

                    <div className="container max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center">
                        <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-up">
                            <Link href={`/blog?category=${post.category}`}>
                                <Badge className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 text-sm font-bold shadow-lg transition-colors border-none">
                                    {post.category}
                                </Badge>
                            </Link>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span className="text-slate-300 font-medium">{post.reading_time || "5 min read"}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight tracking-tight drop-shadow-sm">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-slate-300 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white">{post.author}</span>
                            </div>
                            <span className="hidden md:inline-block text-slate-500">|</span>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </header>
            )}
            <div className="container max-w-4xl mx-auto px-4 md:px-6 py-16 -mt-10 relative z-20 bg-white rounded-t-3xl md:rounded-3xl shadow-xl">
                {/* Breadcrumb / Back */}
                <div className="mb-10 flex items-center justify-between text-sm text-slate-500 border-b border-slate-100 pb-6">
                    <Link href="/blog" className="flex items-center hover:text-green-600 transition-colors font-medium group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Articles
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline">Share:</span>
                        <button className="hover:text-blue-600 transition-colors"><Facebook className="w-5 h-5" /></button>
                        <button className="hover:text-sky-500 transition-colors"><Twitter className="w-5 h-5" /></button>
                        <button className="hover:text-blue-700 transition-colors"><Linkedin className="w-5 h-5" /></button>
                        <button className="hover:text-green-600 transition-colors"><Share2 className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl text-slate-600 prose-img:shadow-lg prose-strong:text-slate-900">
                    {post && <div dangerouslySetInnerHTML={{ __html: post.content }} />}
                </div>

                {/* Mid-Content CTA */}
                <div className="my-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border border-green-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="md:w-2/3">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Targeting {post?.category === "GATE" ? "GATE 2026" : "CSIR NET 2026"}?</h3>
                            <p className="text-slate-600 mb-6">
                                Join our premium batch and get access to 500+ hours of live classes, structured notes, and mock tests.
                            </p>
                            <div className="flex gap-4 font-medium text-sm text-green-800">
                                <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Live Classes</span>
                                <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Test Series</span>
                            </div>
                        </div>
                        <div className="md:w-1/3 text-center">
                            <Link href="/auth/sign-up">
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 rounded-xl shadow-lg shadow-green-900/20 text-lg">
                                    Join 2026 Batch
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                {post?.tags && post.tags.length > 0 && (
                    <div className="mt-12 flex flex-wrap gap-2 border-t border-slate-100 pt-8">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full font-medium hover:bg-slate-200 cursor-pointer transition-colors">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-slate-50 py-20 mt-10 border-t border-slate-200">
                    <div className="container max-w-container mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-bold text-slate-900">Related Articles</h2>
                            <Link href="/blog" className="text-green-600 font-bold hover:underline flex items-center">
                                View All <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map(relatedPost => (
                                <BlogCard key={relatedPost.id} post={relatedPost} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
}
