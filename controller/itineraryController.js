import { getToken, readToken } from "@/lib/authentication";

export async function loadUserItineraries() {
    const token = getToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/itineraries`, {
        headers: {
            Authorization: `jwt ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch itineraries");
    }

    return res.json();
}

export async function saveItinerary(data) {
    const token = getToken();
    const user = readToken();
    const userId = user?.user?._id || user?._id;
    if (!token || !userId) throw new Error("User not authenticated");

    const isEditing = !!data._id;
    const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/itineraries/${data._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/itineraries`;

    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `jwt ${token}`,
        },
        body: JSON.stringify({ ...data, userId }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save itinerary");
    }

    return res.json();
}

export async function deleteItinerary(id) {
    const token = getToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/itineraries/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `jwt ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete itinerary");
    }

    return true;
}

export async function addAttractionToItinerary(itineraryId, attraction) {
    const token = getToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/itineraries/${itineraryId}/attractions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `jwt ${token}`,
        },
        body: JSON.stringify(attraction),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add attraction");
    }

    return res.json();
}

export async function removeAttractionFromItinerary(itineraryId, attractionId) {
    const token = getToken();
    if (!token) throw new Error("User not authenticated");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/itineraries/${itineraryId}/attractions/${attractionId}`, {
        method: "DELETE",
        headers: {
            Authorization: `jwt ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to remove attraction");
    }

    return res.json();
}