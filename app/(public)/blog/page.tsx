import { ClientBlogList } from "@/components/blog/client/ClientBlogList";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mathematics Preparation Insights | Math4Code Blog",
    description: "Expert insights, preparation strategies, and exam updates for CSIR NET, GATE, and IIT JAM Mathematics.",
};

export default function BlogPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>}>
            <ClientBlogList />
        </Suspense>
    );
}
