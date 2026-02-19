"use client";

import { useBlogPosts } from "@/hooks/blog/useBlog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Hash, ArrowRight, User, Calendar, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";

export function ClientBlogList() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category")?.toLowerCase() || "";

    // Fetch all posts using React Query (which filters by tenant internally)
    // We can optimize this to pass filters to the hook if the hook supported server-side filtering params,
    // but the current hook fetches all and we filter client side for "smoothness" on small datasets,
    // or we can update hook to accept params.
    // The hook `useBlogPosts(category, searchTerm)` supports args!
    // Let's use them for efficiency if possible, or fetch all if we want client-side instant filtering.
    // The hook signature is `useBlogPosts(category?: string, searchTerm?: string)`
    // Note: The hook maps 'all' to undefined category filter usually.

    // For smooth client-side filtering (if list isn't huge), fetching all is often better UX (no loading states on filter change).
    // But if list is huge, server filtering is better. Let's stick to the hook's capabilities.
    // However, the current hook `useBlogPosts` implementation fetches based on args.
    // If we want "super fast" interactions, usually we might want to fetch all and filter in memory?
    // Let's try passing the params to the hook for now to query the DB directly.

    const { data: allPosts, isLoading } = useBlogPosts(
        category === 'all' ? undefined : category || undefined,
        query || undefined
    );

    // We also need a way to get "Featured" post.
    // We can just find it in the list or have a separate query.
    // For simplicity, let's assume the first "is_featured" post in the returned list is the featured one,
    // OR fetch all posts (without filter) initially to get featured?
    // Actually, distinct queries are better.
    // Let's just render what we get.

    // To replicate exact behavior:
    // 1. Featured Post is shown ONLY when no search/filter is active.
    // 2. Categories list should probably be static or fetched.

    const isFiltering = !!query || !!category;
    const featuredPost = !isFiltering && allPosts ? allPosts.find(p => p.is_featured) : null;

    // If we have a featured post and we are NOT filtering, we might want to exclude it from the grid?
    // The original code passed allPosts to grid. Let's see...
    // Original: `const featuredPost = await getFeaturedBlogPost();` (separate query)
    // and `allPosts` (separate query).

    // Let's mimic that:

    const postsToDisplay = allPosts || [];
    // If we want to hide the featured post from grid when it's shown in Hero:
    // const gridPosts = featuredPost ? postsToDisplay.filter(p => p.id !== featuredPost.id) : postsToDisplay;
    // But original code didn't do that explicit exclusion in grid? 
    // "const filteredPosts = allPosts.filter..." -> It just filtered.
    // If featured post is in allPosts, it would show in grid too.
    const gridPosts = postsToDisplay;

    // Categories: We need a list of unique categories. 
    // If we filter, we only get filtered categories. 
    // For the category *chips* to work, we need ALL categories.
    // So we effectively need two queries: 
    // 1. One for metadata/categories (ALL posts or cached tags)
    // 2. One for display (filtered) -> OR just fetch ALL and filter client side.

    // "super fast" usually implies client-side filtering.
    // Let's fetch ALL posts (no args) and filter client-side.
    const { data: rawPosts, isLoading: isLoadingAll } = useBlogPosts();

    const clientFilteredPosts = rawPosts?.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query);
        const matchesCategory = category ? post.category.toLowerCase() === category : true;
        return matchesSearch && matchesCategory;
    }) || [];

    const categories = rawPosts ? Array.from(new Set(rawPosts.map((post) => post.category))) : [];
    const clientFeaturedPost = !isFiltering && rawPosts ? rawPosts.find(p => p.is_featured) : null;


    if (isLoadingAll) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-800 text-white py-24">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

                <div className="container max-w-container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 mb-6 w-fit mx-auto animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                            </span>
                            <span className="text-sm font-medium text-green-50">New Articles Every Week</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                            Mathematics Preparation <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-white">Insights</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-green-50 mb-10 max-w-2xl mx-auto font-light">
                            Expert strategies, solved papers, and deep dive concepts for <span className="font-semibold text-white">CSIR NET, GATE & IIT JAM</span>.
                        </p>

                        {/* Search & Filter */}
                        <div className="mb-8 w-full max-w-2xl mx-auto">
                            <BlogSearch />
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            <Link href="/blog" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!category ? 'bg-white text-green-700 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                All
                            </Link>
                            {categories.map(cat => (
                                <Link key={cat} href={`/blog?category=${cat.toLowerCase()}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat.toLowerCase() ? 'bg-white text-green-700 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Post (Only show if no search/filter active) */}
            {clientFeaturedPost && (
                <section className="-mt-20 relative z-20 pb-10">
                    <div className="container max-w-container mx-auto px-4 md:px-6">
                        <Link href={`/blog/${clientFeaturedPost.slug}`} className="group">
                            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row h-full md:h-[500px] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 transform hover:-translate-y-1">
                                <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden">
                                    <div className="absolute top-6 left-6 z-10">
                                        <Badge className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm font-bold shadow-lg">Featured</Badge>
                                    </div>
                                    <img
                                        src={clientFeaturedPost.featured_image || "/placeholder-blog-featured.jpg"}
                                        alt={clientFeaturedPost.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10 pointer-events-none" />
                                </div>
                                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

                                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mb-6 relative z-10">
                                        <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">{clientFeaturedPost.category}</span>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            <span>{clientFeaturedPost.reading_time}</span>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight group-hover:text-green-600 transition-colors relative z-10">
                                        {clientFeaturedPost.title}
                                    </h2>

                                    <p className="text-lg text-slate-600 mb-8 line-clamp-3 leading-relaxed relative z-10">
                                        {clientFeaturedPost.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{clientFeaturedPost.author}</div>
                                                <div className="text-xs text-slate-500">{new Date(clientFeaturedPost.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <span className="flex items-center text-green-600 font-bold group-hover:translate-x-2 transition-transform">
                                            Read Article <ArrowRight className="w-5 h-5 ml-2" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* Blog Grid */}
            <section className={`py-20 ${clientFeaturedPost ? 'pt-10' : ''}`}>
                <div className="container max-w-container mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Latest Articles</h2>
                            <p className="text-slate-500">Explore our latest thoughts, tutorials, and insights.</p>
                        </div>
                        <div className="hidden md:block text-sm font-medium text-slate-500">
                            Showing {clientFilteredPosts.length} articles
                        </div>
                    </div>

                    {clientFilteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {clientFilteredPosts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <Hash className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-8">
                                We couldn't find any articles matching your search. Try different keywords or clear your filters.
                            </p>
                            <Link href="/blog">
                                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                                    Clear Filters
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

// Fallback skeleton or just simple loading
function BlogPageSkeleton() {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>;
}
