import { getToken } from '@/lib/authentication';

function normalizeProfileBundle(data) {
    // If backend returns just the user object, normalize to a bundle
    if (data && !data.user) {
        return { user: data, itineraries: data.itineraries || [], recentReviews: data.recentReviews || [] };
    }
    return {
        user: data?.user || null,
        itineraries: data?.itineraries || [],
        recentReviews: data?.recentReviews || []
    };
}

export async function loadMyProfileBundle() {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: { Authorization: `jwt ${token}` },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch user profile');
    }
    const raw = await res.json();
    return normalizeProfileBundle(raw);
}

export async function loadUserProfile() {
    const { user } = await loadMyProfileBundle();
    return user;
}

export async function loadMyRecentReviews() {
    const { recentReviews } = await loadMyProfileBundle();
    return recentReviews;
}

export async function getPublicProfileBundle(username) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile/username/${encodeURIComponent(username)}`
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch public profile");
    }
    // -> { user, itineraries }
    return res.json();
}

export async function getUserProfileByUsername(username) {
    const { user } = await getPublicProfileBundle(username);
    return user;
}

export async function loadPublicItinerariesByUsername(username) {
    const { itineraries } = await getPublicProfileBundle(username);
    return itineraries || [];
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