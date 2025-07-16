import { getToken } from '@/lib/authentication';

export async function loadUserProfile() {
    if (typeof window === 'undefined') return null;
    const token = getToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: { Authorization: `jwt ${token}` },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch user profile");
    }

    return res.json();
}

export async function updateUserField(key, value) {
    const token = getToken();
    if (!token) throw new Error("User not authenticated");

    const body = typeof key === 'object' ? key : { [key]: value };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `jwt ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update user field");
    }

    return res.json();
}