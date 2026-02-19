
import { getBlogPostBySlug, getRelatedPosts, BlogPost } from "@/lib/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/BlogCard";
import { Calendar, Clock, User, ArrowLeft, Facebook, Twitter, Linkedin, Share2, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: "Article Not Found",
        };
    }

    return {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        openGraph: {
            title: post.seo_title || post.title,
            description: post.seo_description || post.excerpt,
            images: post.featured_image ? [{ url: post.featured_image }] : [],
            type: "article",
            publishedTime: post.created_at,
            authors: [post.author],
        },
        alternates: {
            canonical: `/blog/${post.slug}`,
        }
    };
}

import { ClientBlogDetail } from "@/components/blog/client/ClientBlogDetail";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const resolvedSlug = decodeURIComponent(slug);

    // Fetch data on the server for SEO and hydration
    const post = await getBlogPostBySlug(resolvedSlug);

    if (!post) {
        notFound();
    }

    return <ClientBlogDetail slug={resolvedSlug} initialPost={post} />;
}
