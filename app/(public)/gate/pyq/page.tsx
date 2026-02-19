import { ExamHero } from "@/components/exam/ExamHero";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export const metadata = {
    title: "GATE Mathematics Previous Year Question Papers (PDF)",
    description: "Download GATE Mathematics (MA) previous year question papers with detailed solutions.",
};

const PYQ_YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

export default function GATEPYQPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="GATE Mathematics PYQs"
                subtitle="Practice with last 10 years' question papers to understand exam trends."
                ctaText="Download All PDFs"
                ctaHref="#"
                secondaryCtaText="View Solutions"
                secondaryCtaHref="/gate/course"
                background="bg-slate-50"
                features={["10+ Years Papers", "Category-wise Weights", "Video Solutions"]}
            />

            <section className="py-20">
                <div className="container max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Download Question Papers</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {PYQ_YEARS.map((year) => (
                            <div key={year} className="bg-white border p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">GATE MA {year}</h3>
                                        <p className="text-sm text-slate-500">Includes Gen. Aptitude</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                                    <Download className="w-4 h-4 mr-2" /> PDF
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ExamCTA
                title="Need Detailed Solutions?"
                subtitle="Get step-by-step video solutions for every question in our online course."
                ctaText="Check Course"
                ctaLink="/gate/course"
            />
        </div>
    );
}
