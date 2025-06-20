import { getToken } from '@/lib/authentication';

export async function fetchSavedAttractions() {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-attractions`, {
        headers: {
            Authorization: `jwt ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch saved attractions');
    }

    return res.json();
}

export async function removeSavedAttraction(attractionId) {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-attractions/${attractionId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `jwt ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to remove attraction');
    }

    return res.json();
}