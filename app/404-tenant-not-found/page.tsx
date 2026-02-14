import { headers } from "next/headers";
import Link from 'next/link'
export const dynamic = 'force-static';
export default function TenantNotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center p-8 max-w-md">
                <div className="mb-6">
                    <svg
                        className="mx-auto h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Tenant Not Found
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                    The domain you're trying to access is not configured.
                </p>
                <p className="text-sm text-gray-500">
                    Please contact support if you believe this is an error.
                </p>
                <div className="mt-6">
                    <Link
                        href="mailto:math4code.acad@gmail.com"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    )
}
