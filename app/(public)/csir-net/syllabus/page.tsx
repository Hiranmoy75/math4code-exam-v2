import { ExamHero } from "@/components/exam/ExamHero";
import { ExamCTA } from "@/components/exam/ExamCTA";
import { ExamContent } from "@/components/exam/ExamContent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "CSIR NET Mathematics Syllabus 2026 | Download PDF",
    description: "Detailed syllabus for CSIR NET Mathematical Sciences Part A, Part B, and Part C. Topic-wise breakdown of Real Analysis, Linear Algebra, and more.",
};

const SYLLABUS_CONTENT = [
    {
        heading: "Unit 1: Analysis & Linear Algebra",
        body: (
            <div className="space-y-4">
                <p>This is the most critical unit, carrying approximately 40% of the total weightage.</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Real Analysis</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                            <li>Sequences and Series of Real Numbers</li>
                            <li>Functions of One Real Variable</li>
                            <li>Topology of R</li>
                            <li>Riemann Integration</li>
                        </ul>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Linear Algebra</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                            <li>Vector Spaces, Subspaces</li>
                            <li>Linear Transformations</li>
                            <li>Matrices & Determinants</li>
                            <li>Eigenvalues & Eigenvectors</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    {
        heading: "Unit 2: Complex Analysis, Algebra & Topology",
        body: (
            <div className="space-y-4">
                <p>This unit focuses on abstract structures and functions of complex variables.</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Complex Analysis</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                            <li>Analytic Functions</li>
                            <li>Complex Integration</li>
                            <li>Singularities & Residues</li>
                        </ul>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Algebra</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                            <li>Groups, Subgroups, Homomorphisms</li>
                            <li>Rings, Fields, Ideals</li>
                            <li>Number Theory Basics</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    {
        heading: "Unit 3: Applied Mathematics",
        body: (
            <div className="space-y-4">
                <p>Essential for candidates opting for Applied Statistics or Physics backgrounds.</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Ordinary Differential Equations (ODE)</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                            <li>First Order ODEs</li>
                            <li>Higher Order Linear Equations</li>
                            <li>Systems of ODEs</li>
                        </ul>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Partial Differential Equations (PDE)</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                            <li>First Order PDEs</li>
                            <li>Wave, Heat, Laplace Equations</li>
                        </ul>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Numerical Analysis</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                            <li>Numerical Solutions of Algebraic Equations</li>
                            <li>Interpolation</li>
                            <li>Numerical Integration</li>
                        </ul>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Calculus of Variations</h4>
                        <ul className="text-sm space-y-1 text-slate-600 list-disc pl-4">
                            <li>Euler-Lagrange Equation</li>
                            <li>Extremals</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
];

export default function CSIRNETSyllabusPage() {
    return (
        <div className="min-h-screen bg-white">
            <ExamHero
                title="CSIR NET Mathematics Syllabus"
                subtitle="A comprehensive guide to the CSIR NET Mathematical Sciences syllabus. Prioritize your topics with our weightage analysis."
                ctaText="Download PDF"
                ctaHref="#"
                secondaryCtaText="View Test Series"
                secondaryCtaHref="/csir-net/test-series"
                features={["Unit-wise Breakdown", "Exam Pattern", "Important Topics"]}
                badge="Updated for 2026"
            />

            <ExamContent content={SYLLABUS_CONTENT} />

            <div className="container max-w-4xl mx-auto px-4 md:px-6 mb-32">
                <h2 className="text-3xl font-bold mb-8 text-slate-900 border-b-2 border-green-500 inline-block pb-2">Exam Pattern</h2>
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-lg bg-white">
                    <Table className="text-slate-900">
                        <TableHeader className="bg-gradient-to-r from-green-600 to-emerald-600">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="w-[100px] text-white font-bold text-lg py-6">Part</TableHead>
                                <TableHead className="text-white font-bold text-lg py-6">Subject</TableHead>
                                <TableHead className="text-white font-bold text-lg py-6">Questions</TableHead>
                                <TableHead className="text-white font-bold text-lg py-6">Marks</TableHead>
                                <TableHead className="text-white font-bold text-lg py-6">Negative Marking</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-green-50/60 transition-colors odd:bg-white even:bg-slate-50/50">
                                <TableCell className="font-bold text-green-700 py-4 text-base">Part A</TableCell>
                                <TableCell className="font-medium text-slate-700 py-4 text-base">General Aptitude</TableCell>
                                <TableCell className="py-4 text-base">20 (Attempt 15)</TableCell>
                                <TableCell className="font-bold text-slate-900 py-4 text-base">30</TableCell>
                                <TableCell className="text-red-500 font-medium py-4 text-base">0.5</TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-green-50/60 transition-colors odd:bg-white even:bg-slate-50/50">
                                <TableCell className="font-bold text-green-700 py-4 text-base">Part B</TableCell>
                                <TableCell className="font-medium text-slate-700 py-4 text-base">Mathematics (MCQ)</TableCell>
                                <TableCell className="py-4 text-base">40 (Attempt 25)</TableCell>
                                <TableCell className="font-bold text-slate-900 py-4 text-base">75</TableCell>
                                <TableCell className="text-red-500 font-medium py-4 text-base">0.75</TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-green-50/60 transition-colors odd:bg-white even:bg-slate-50/50 border-0">
                                <TableCell className="font-bold text-green-700 py-4 text-base">Part C</TableCell>
                                <TableCell className="font-medium text-slate-700 py-4 text-base">Mathematics (MSQ)</TableCell>
                                <TableCell className="py-4 text-base">60 (Attempt 20)</TableCell>
                                <TableCell className="font-bold text-slate-900 py-4 text-base">95</TableCell>
                                <TableCell className="text-green-600 font-bold py-4 text-base">No Negative Marking</TableCell>
                            </TableRow>
                            <TableRow className="bg-green-50 font-bold border-t-2 border-green-100">
                                <TableCell className="text-green-800 py-4 text-lg">Total</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">-</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">120 (Attempt 60)</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">200</TableCell>
                                <TableCell className="text-green-800 py-4 text-lg">-</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ExamCTA
                title="Cover the Entire Syllabus with Experts"
                subtitle="Join our structured online course and master every unit systematically."
                ctaText="Enroll Now"
                ctaLink="/csir-net/course"
            />
        </div>
    );
}
