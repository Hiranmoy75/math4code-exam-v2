"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, ExternalLink, Calendar, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useBlogPosts, useDeleteBlogPost } from "@/hooks/blog/useBlog";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function AdminBlogsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const { data: posts, isLoading } = useBlogPosts(undefined, searchTerm);
    const deleteMutation = useDeleteBlogPost();

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Article Management</h1>
                    <p className="text-slate-500 mt-1">Create, edit, and manage your blog content.</p>
                </div>
                <Link href="/admin/blogs/create">
                    <Button className="bg-green-600 hover:bg-green-700 shadow-md h-12 px-6 font-bold text-white transition-transform active:scale-95">
                        <Plus className="mr-2 h-5 w-5" /> Write New Article
                    </Button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex items-center gap-4">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Filter articles..."
                        className="pl-10 h-10 bg-slate-50 border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <th className="p-4 w-1/3">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {isLoading ? (
                                // Loading Skeleton
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-4"><div className="h-5 bg-slate-100 rounded w-3/4 animate-pulse"></div></td>
                                        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div></td>
                                        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div></td>
                                        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-16 animate-pulse"></div></td>
                                        <td className="p-4"><div className="h-8 bg-slate-100 rounded w-20 ml-auto animate-pulse"></div></td>
                                    </tr>
                                ))
                            ) : posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 align-top">
                                            <div className="font-bold text-slate-900 line-clamp-1 group-hover:text-green-700 transition-colors">{post.title}</div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.created_at).toLocaleDateString()}
                                                <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                                                <GlobeLink slug={post.slug} />
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-medium">
                                                {post.category}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                                                    {post.author.charAt(0)}
                                                </div>
                                                {post.author}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {post.is_featured && (
                                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 shadow-sm">
                                                    Featured
                                                </Badge>
                                            )}
                                            {!post.is_featured && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    Published
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Edit Button */}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 border-slate-200"
                                                    onClick={() => router.push(`/admin/blogs/edit/${post.slug}`)} // Assuming edit route
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>

                                                {/* Delete Dialog */}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the article
                                                                <span className="font-bold text-slate-900"> "{post.title}"</span>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-red-600 hover:bg-red-700 text-white">
                                                                Delete Article
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-500">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Edit2 className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900">No articles match your filter</h3>
                                        <p className="max-w-xs mx-auto mt-2 mb-6">Try adjusting your search terms or create a new article.</p>
                                        <Link href="/admin/blogs/create">
                                            <Button variant="outline" className="mx-auto border-green-200 text-green-700 hover:bg-green-50">Create New Article</Button>
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function GlobeLink({ slug }: { slug: string }) {
    return (
        <Link href={`/blog/${slug}`} target="_blank" className="hover:text-green-600 flex items-center gap-1">
            View Live <ExternalLink className="w-3 h-3" />
        </Link>
    )
}
