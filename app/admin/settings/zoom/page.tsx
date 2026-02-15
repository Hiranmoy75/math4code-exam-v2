'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff, ExternalLink } from 'lucide-react';

export default function ZoomSettingsPage() {
    const [accountId, setAccountId] = useState('');
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSettings, setHasSettings] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/zoom-settings');
            const data = await res.json();

            if (data.hasSettings) {
                setAccountId(data.account_id || '');
                setClientId(data.client_id || '');
                setClientSecret('********'); // Masked
                setHasSettings(true);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };

    const handleSave = async () => {
        if (!accountId || !clientId || !clientSecret) {
            setMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        if (clientSecret === '********') {
            // User didn't change secret, but we need it for validation if we were to re-validate everything?
            // Actually API should handle update without secret if it's masked? 
            // My API route expects all fields for validation.
            // If secret is masked, we can't validate. 
            // I should force user to re-enter secret if they want to update.
            // OR I should handle partial updates in API.
            // For now, simple approach: Require secret if saving.
            setMessage({ type: 'error', text: 'Please re-enter Client Secret to save changes' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/zoom-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    account_id: accountId,
                    client_id: clientId,
                    client_secret: clientSecret
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Zoom settings saved successfully!' });
                fetchSettings();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete your Zoom settings?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/zoom-settings', { method: 'DELETE' });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings deleted' });
                setAccountId('');
                setClientId('');
                setClientSecret('');
                setHasSettings(false);
            } else {
                setMessage({ type: 'error', text: 'Failed to delete' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Zoom Integration Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Configure Zoom Server-to-Server OAuth to enable automatic meeting creation.
                </p>
            </div>

            {message && (
                <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center">
                        {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" /> : <XCircle className="h-4 w-4 text-red-600 mr-2" />}
                        <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                            {message.text}
                        </AlertDescription>
                    </div>
                </Alert>
            )}

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Zoom OAuth Credentials</CardTitle>
                        <CardDescription>
                            Create a Server-to-Server OAuth app in Zoom Marketplace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Account ID</label>
                            <Input value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="Enter Zoom Account ID" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Client ID</label>
                            <Input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Enter Client ID" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Client Secret</label>
                            <div className="relative">
                                <Input
                                    type={showSecret ? 'text' : 'password'}
                                    value={clientSecret}
                                    onChange={(e) => setClientSecret(e.target.value)}
                                    placeholder="Enter Client Secret"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSecret(!showSecret)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button onClick={handleSave} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Settings
                            </Button>
                            {hasSettings && (
                                <Button onClick={handleDelete} variant="destructive" disabled={loading}>
                                    Delete Settings
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Setup Instructions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                        <ol className="list-decimal pl-4 space-y-2">
                            <li>Go to <a href="https://marketplace.zoom.us/" target="_blank" className="text-blue-600 hover:underline">Zoom Marketplace</a> and sign in.</li>
                            <li>Click "Develop" - "Build App".</li>
                            <li>Choose "Server-to-Server OAuth" and click Create.</li>
                            <li>Fill in App Name (e.g., "LMS Integration").</li>
                            <li>Copy <strong>Account ID</strong>, <strong>Client ID</strong>, and <strong>Client Secret</strong> from "App Credentials".</li>
                            <li>In "Scopes", add <code>meeting:write:admin</code> scope.</li>
                            <li>Activate the app.</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
