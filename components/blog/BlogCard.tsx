import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { BlogPost } from "@/lib/blog"; // Define BlogPost type
// import { formatDate } from "@/lib/utils"; // Assuming utils has formatDate

export function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                    <Image
                        src={post.featured_image || "/placeholder-blog.jpg"} // Fallback image
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-white/90 text-slate-900 border-none font-bold shadow-sm backdrop-blur-sm hover:bg-white">{post.category}</Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-3">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.reading_time || "5 min read"}</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors">
                        {post.title}
                    </h3>

                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{post.author}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
