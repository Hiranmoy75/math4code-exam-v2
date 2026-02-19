import { ExamHero } from "@/components/exam/ExamHero";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamContent } from "@/components/exam/ExamContent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "GATE Mathematics Syllabus 2026 | Download PDF",
    description: "Detailed syllabus for GATE Mathematics (MA) including General Aptitude. Topic-wise breakdown for Linear Algebra, Calculus, and more.",
};

const SYLLABUS_CONTENT = [
    {
        heading: "Section 1: Calculus",
        body: (
            <div className="space-y-4">
                <p>A fundamental section with good weightage.</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Topics</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                            <li>Functions of two or more variables</li>
                            <li>Continuity, partial derivatives</li>
                            <li>Maxima and minima</li>
                            <li>Multiple integrals</li>
                            <li>Vector calculus (Gradient, Divergence, Curl)</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    {
        heading: "Section 2: Linear Algebra",
        body: (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Topics</h4>
                <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                    <li>Vector spaces over R and C</li>
                    <li>Linear transformations</li>
                    <li>Systems of linear equations</li>
                    <li>Eigenvalues and eigenvectors</li>
                    <li>Cayley-Hamilton Theorem</li>
                </ul>
            </div>
        )
    },
    {
        heading: "Section 3: Real Analysis",
        body: (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Topics</h4>
                <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                    <li>Sequences and Series</li>
                    <li>Metric spaces</li>
                    <li>Connectedness, Compactness</li>
                    <li>Completeness</li>
                    <li>Uniform convergence</li>
                </ul>
            </div>
        )
    },
    {
        heading: "Other Important Sections",
        body: (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                    <li><strong>Complex Analysis:</strong> Analytic functions, specialized integrals.</li>
                    <li><strong>Ordinary Differential Equations:</strong> First order & linear equations.</li>
                    <li><strong>Algebra:</strong> Groups, subgroups, normal subgroups.</li>
                    <li><strong>Functional Analysis:</strong> Normed linear spaces, Banach spaces.</li>
                    <li><strong>Numerical Analysis:</strong> Numerical solutions, integration.</li>
                    <li><strong>Partial Differential Equations:</strong> Method of separation of variables.</li>
                    <li><strong>Topology:</strong> Basis, dense sets, subsystem.</li>
                    <li><strong>Linear Programming:</strong> Simplex method, duality.</li>
                </ul>
            </div>
        )
    }
];

export default function GATESyllabusPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="GATE Mathematics Syllabus"
                subtitle="Detailed breakdown of the GATE MA syllabus. Master Calculus, Linear Algebra, Real Analysis, and specialized topics."
                ctaText="Download PDF"
                ctaHref="#"
                secondaryCtaText="View Test Series"
                secondaryCtaHref="/gate/test-series"
                features={["Topic-wise List", "Weightage Analysis", "General Aptitude"]}
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
                                <TableHead className="text-white font-bold text-lg py-6">No. of Questions</TableHead>
                                <TableHead className="text-white font-bold text-lg py-6">Marks</TableHead>
                                <TableHead className="text-white font-bold text-lg py-6">Nature</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-green-50/60 transition-colors odd:bg-white even:bg-slate-50/50">
                                <TableCell className="font-bold text-green-700 py-4 text-base">General Aptitude</TableCell>
                                <TableCell className="py-4 text-base">10</TableCell>
                                <TableCell className="font-bold text-slate-900 py-4 text-base">15</TableCell>
                                <TableCell className="text-slate-600 font-medium py-4 text-base">MCQ</TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-green-50/60 transition-colors odd:bg-white even:bg-slate-50/50">
                                <TableCell className="font-bold text-green-700 py-4 text-base">Subject Questions</TableCell>
                                <TableCell className="py-4 text-base">55</TableCell>
                                <TableCell className="font-bold text-slate-900 py-4 text-base">85</TableCell>
                                <TableCell className="text-slate-600 font-medium py-4 text-base">MCQ, MSQ, NAT</TableCell>
                            </TableRow>
                            <TableRow className="bg-green-50 font-bold border-t-2 border-green-100">
                                <TableCell className="text-green-800 py-4 text-lg">Total</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">65</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">100</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">3 Hours</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ExamCTA
                title="Master GATE Syllabus Efficiently"
                subtitle="Structured video lectures covering every topic in depth."
                ctaText="Enroll Now"
                ctaLink="/gate/course"
            />
        </div>
    );
}
