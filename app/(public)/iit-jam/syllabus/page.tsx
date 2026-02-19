import { ExamHero } from "@/components/exam/ExamHero";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamContent } from "@/components/exam/ExamContent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "IIT JAM Mathematics Syllabus 2026 | Download PDF",
    description: "Detailed syllabus for IIT JAM Mathematics (MA). Master Real Analysis, Linear Algebra, and more.",
};

const SYLLABUS_CONTENT = [
    {
        heading: "Section 1: Real Analysis",
        body: (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Topics</h4>
                <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                    <li>Sequences and Series of Real Numbers</li>
                    <li>Functions of One Real Variable</li>
                    <li>Limits, Continuity, Differentiability</li>
                    <li>Taylor Series</li>
                    <li>Riemann Integration</li>
                </ul>
            </div>
        )
    },
    {
        heading: "Section 2: Multivariable Calculus & Diff. Eq.",
        body: (
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Functions of 2 or 3 Variables</h4>
                    <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                        <li>Partial Derivatives</li>
                        <li>Multiple Integrals (Change of variables)</li>
                        <li>Directional Derivatives</li>
                    </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Differential Equations</h4>
                    <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                        <li>First Order Ordinary Differential Equations</li>
                        <li>Existence & Uniqueness</li>
                        <li>Linear Oridinary Differential Equations</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        heading: "Section 3: Linear Algebra & Algebra",
        body: (
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Linear Algebra</h4>
                    <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                        <li>Matrices, Systems of Linear Equations</li>
                        <li>Vector Spaces, Basis, Dimension</li>
                        <li>Linear Transformations, Rank-Nullity</li>
                        <li>Eigenvalues, Eigenvectors</li>
                    </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Group Theory</h4>
                    <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                        <li>Groups, Subgroups, Cyclic Groups</li>
                        <li>Permutation Groups</li>
                        <li>Homomorphisms, Isomorphisms</li>
                    </ul>
                </div>
            </div>
        )
    }
];

export default function IITJAMSyllabusPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="IIT JAM Mathematics Syllabus"
                subtitle="Detailed breakdown of the IIT JAM MA syllabus. Prioritize your topics well."
                ctaText="Download PDF"
                ctaHref="#"
                secondaryCtaText="View Test Series"
                secondaryCtaHref="/iit-jam/test-series"
                features={["Topic-wise List", "Weightage Analysis", "Exam Pattern"]}
                badge="Updated for 2026"
            />

            <ExamContent content={SYLLABUS_CONTENT} />

            <div className="container max-w-4xl mx-auto px-4 md:px-6 mb-32">
                <h2 className="text-3xl font-bold mb-8 text-slate-900 border-b-2 border-green-500 inline-block pb-2">Exam Pattern</h2>
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-lg bg-white">
                    <Table className="text-slate-900">
                        <TableHeader className="bg-gradient-to-r from-green-600 to-emerald-600">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-white font-bold text-lg py-6">Section</TableHead>
                                <TableHead className="text-white font-bold text-lg py-6">Question Type</TableHead>
                                <TableHead className="text-white font-bold text-lg py-6">No. of Questions</TableHead>
                                <TableHead className="text-white font-bold text-lg py-6">Marks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-green-50/60 transition-colors odd:bg-white even:bg-slate-50/50">
                                <TableCell className="font-bold text-green-700 py-4 text-base">Section A</TableCell>
                                <TableCell className="font-medium text-slate-700 py-4 text-base">MCQ</TableCell>
                                <TableCell className="py-4 text-base">30 (10x1 + 20x2)</TableCell>
                                <TableCell className="font-bold text-slate-900 py-4 text-base">50</TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-green-50/60 transition-colors odd:bg-white even:bg-slate-50/50">
                                <TableCell className="font-bold text-green-700 py-4 text-base">Section B</TableCell>
                                <TableCell className="font-medium text-slate-700 py-4 text-base">MSQ</TableCell>
                                <TableCell className="py-4 text-base">10 (10x2)</TableCell>
                                <TableCell className="font-bold text-slate-900 py-4 text-base">20</TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-green-50/60 transition-colors odd:bg-white even:bg-slate-50/50">
                                <TableCell className="font-bold text-green-700 py-4 text-base">Section C</TableCell>
                                <TableCell className="font-medium text-slate-700 py-4 text-base">NAT</TableCell>
                                <TableCell className="py-4 text-base">20 (10x1 + 10x2)</TableCell>
                                <TableCell className="font-bold text-slate-900 py-4 text-base">30</TableCell>
                            </TableRow>
                            <TableRow className="bg-green-50 font-bold border-t-2 border-green-100">
                                <TableCell className="text-green-800 py-4 text-lg">Total</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">-</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">60</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">100</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ExamCTA
                title="Master JAM Syllabus Efficiently"
                subtitle="Structured video lectures covering every topic in depth."
                ctaText="Enroll Now"
                ctaLink="/iit-jam/course"
            />
        </div>
    );
}
