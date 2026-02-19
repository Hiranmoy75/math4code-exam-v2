import { ExamHero } from "@/components/exam/ExamHero";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export const metadata = {
    title: "IIT JAM Mathematics Previous Year Question Papers (PDF)",
    description: "Download IIT JAM Mathematics (MA) previous year question papers with detailed solutions and answer keys.",
};

const PYQ_YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

export default function IITJAMPYQPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="IIT JAM Mathematics PYQs"
                subtitle="Practice will make you perfect. Download last 10 years' question papers."
                ctaText="Download All PDFs"
                ctaHref="#"
                secondaryCtaText="View Solutions"
                secondaryCtaHref="/iit-jam/course"
                background="bg-slate-50"
                features={["10+ Years Papers", "Topic-wise Analysis", "Video Solutions"]}
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
                                        <h3 className="font-bold text-lg text-slate-800">IIT JAM MA {year}</h3>
                                        <p className="text-sm text-slate-500">Includes Answer Key</p>
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
                title="Looking for Solutions?"
                subtitle="Our online course includes detailed video solutions for all PYQs."
                ctaText="Check Course"
                ctaLink="/iit-jam/course"
            />
        </div>
    );
}
