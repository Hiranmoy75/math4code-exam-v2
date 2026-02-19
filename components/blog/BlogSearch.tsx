"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function BlogSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (query) {
            params.set("q", query);
        } else {
            params.delete("q");
        }

        // Reset page to 1 if pagination exists, but here we just have filters
        router.push(`/blog?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 max-w-2xl mx-auto flex flex-col md:flex-row gap-2 shadow-xl shadow-green-900/20">
            <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-200" />
                <Input
                    type="search"
                    placeholder="Search for topics..."
                    className="pl-12 bg-transparent border-none text-white placeholder:text-green-200/70 h-12 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <Button type="submit" className="bg-white text-green-700 hover:bg-green-50 font-bold h-12 px-8 rounded-xl shadow-lg transition-transform hover:scale-105">
                Search
            </Button>
        </form>
    );
}
