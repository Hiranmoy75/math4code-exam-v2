import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    ctaText?: string;
    badge?: string;
}

export function ResourceCard({
    title,
    description,
    icon: Icon,
    href,
    ctaText = "Access Now",
    badge
}: ResourceCardProps) {
    return (
        <div className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
            {badge && (
                <span className="absolute top-4 right-4 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-100 uppercase tracking-wide">
                    {badge}
                </span>
            )}

            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-6 text-green-600 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-600 group-hover:text-white transition-all duration-300">
                <Icon className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-700 transition-colors">
                {title}
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                {description}
            </p>

            <Link href={href} className="w-full mt-auto">
                <Button
                    variant="outline"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 font-semibold group/btn justify-between"
                >
                    {ctaText}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
            </Link>
        </div>
    );
}
