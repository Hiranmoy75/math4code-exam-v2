export async function getZoomAccessToken(accountId: string, clientId: string, clientSecret: string) {
    try {
        const id = clientId.trim();
        const secret = clientSecret.trim();
        const accId = accountId.trim();
        const auth = btoa(`${id}:${secret}`);

        const response = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            next: { revalidate: 3500 } // Cache for slightly less than 1 hour (3600s)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Zoom Token Error:', error);
            throw new Error(error.reason || 'Failed to get access token');
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Zoom Auth Error:', error);
        throw error;
    }
}

export async function validateZoomCredentials(accountId: string, clientId: string, clientSecret: string) {
    try {
        const token = await getZoomAccessToken(accountId, clientId, clientSecret);
        return !!token;
    } catch (error) {
        return false;
    }
}

export async function createZoomMeeting(token: string, topic: string, startTime: string, duration: number, password?: string) {
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            topic,
            type: 2, // Scheduled meeting
            start_time: startTime,
            duration,
            password, // Optional, Zoom generates if null
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                jbh_time: 0,
                mute_upon_entry: true,
                watermark: false,
                use_pmi: false,
                approval_type: 2, // Automatically approve
                audio: 'both',
                auto_recording: 'local', // or 'cloud'
                waiting_room: true
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create meeting');
    }

    return await response.json();
}
