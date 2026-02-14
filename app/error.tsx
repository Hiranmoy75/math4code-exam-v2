'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-slate-600 text-sm">
                        We encountered an unexpected error. Don't worry, your data is safe.
                    </p>
                </div>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-slate-50 rounded-lg p-4 text-left">
                        <p className="text-xs font-mono text-slate-700 break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={reset}
                        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>

                    <Link href="/" className="w-full">
                        <button className="w-full px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                            <Home className="w-4 h-4" />
                            Go to Home
                        </button>
                    </Link>
                </div>

                {/* Support */}
                <p className="text-xs text-slate-500">
                    If this problem persists, please{' '}
                    <a href="mailto:math4code.acad@gmail.com" className="text-indigo-600 hover:underline font-semibold">
                        contact support
                    </a>
                </p>
            </div>
        </div>
    )
}
