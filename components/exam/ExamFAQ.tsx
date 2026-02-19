import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FAQItem {
    question: string;
    answer: string;
}

interface ExamFAQProps {
    faqs: FAQItem[];
    title?: string;
}

export function ExamFAQ({ faqs, title = "Frequently Asked Questions" }: ExamFAQProps) {
    return (
        <section className="py-20 md:py-24 bg-white border-t border-slate-50">
            <div className="container max-w-4xl mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16 relative">
                    {title}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-green-500 rounded-full" />
                </h2>

                <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <AccordionItem
                            key={idx}
                            value={`item-${idx}`}
                            className="border border-slate-100 rounded-xl px-2 md:px-4 bg-slate-50/50 data-[state=open]:bg-white data-[state=open]:border-green-100 data-[state=open]:shadow-sm transition-all duration-300"
                        >
                            <AccordionTrigger className="text-base md:text-lg font-semibold text-slate-800 hover:text-green-700 py-5 transition-colors [&[data-state=open]]:text-green-700">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed text-sm md:text-base pb-5">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
