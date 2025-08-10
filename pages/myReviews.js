import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StarRating from "@/components/StarRating";
import { getToken } from "@/lib/authentication";

const PAGE_SIZE = 10;

export default function AllMyReviews() {
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(PAGE_SIZE);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const pageCount = Math.max(1, Math.ceil(total / limit));

    async function fetchPage(p = 1) {
        setLoading(true);
        setErrMsg("");

        try {
            const token = getToken();
            if (!token) {
                router.replace("/login");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/reviews?page=${p}&limit=${limit}`,
                { headers: { Authorization: `jwt ${token}` } }
            );

            if (res.status === 401) {
                router.replace("/login");
                return;
            }

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to load reviews");
            }

            const data = await res.json();
            setReviews(data.reviews || []);
            setTotal(data.total || 0);
            setPage(data.page || p);
        } catch (e) {
            console.error(e);
            setErrMsg(e.message || "Something went wrong loading reviews.");
        } finally {
            setLoading(false);
            window.scrollTo(0, 0);
        }
    }

    useEffect(() => {
        fetchPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goPrev = () => page > 1 && fetchPage(page - 1);
    const goNext = () => page < pageCount && fetchPage(page + 1);

    const colors = {
        text: "var(--reviews-text, #111)",
        sub: "var(--reviews-sub, #666)",
        border: "var(--reviews-border, #eee)",
        cardBg: "var(--reviews-card, #fff)",
        btnBg: "var(--reviews-btn-bg, #fff)",
    };

    return (
        <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
            <style>{`
        @media (prefers-color-scheme: dark) {
          :root {
            --reviews-text: #eaeaea;
            --reviews-sub: #aaa;
            --reviews-border: #333;
            --reviews-card: #2a2a3a;
            --reviews-btn-bg: #2a2a3a;
          }
        }
      `}</style>

            <h1 style={{ marginBottom: ".5rem", color: colors.text }}>My Reviews</h1>
            <p style={{ marginTop: 0, color: colors.sub }}>
                {loading ? "Loading…" : `${total} review${total === 1 ? "" : "s"} total`}
            </p>

            {errMsg ? (
                <div
                    style={{
                        border: `1px solid ${colors.border}`,
                        padding: "12px",
                        borderRadius: 10,
                        color: "#b00020",
                        background: colors.cardBg,
                        marginBottom: 16,
                    }}
                >
                    {errMsg}
                </div>
            ) : null}

            {loading ? (
                <div
                    style={{
                        border: `1px solid ${colors.border}`,
                        padding: "14px",
                        borderRadius: 10,
                        background: colors.cardBg,
                    }}
                >
                    Loading reviews…
                </div>
            ) : reviews.length === 0 ? (
                <div
                    style={{
                        border: `1px solid ${colors.border}`,
                        padding: "14px",
                        borderRadius: 10,
                        background: colors.cardBg,
                        color: colors.sub,
                    }}
                >
                    You haven’t written any reviews yet.
                </div>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {reviews.map((r) => (
                        <li
                            key={r._id}
                            style={{
                                border: `1px solid ${colors.border}`,
                                borderRadius: 10,
                                background: colors.cardBg,
                                padding: "14px",
                                marginBottom: 12,
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            color: colors.text,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={r.attractionName || r.attractionId}
                                    >
                                        {r.attractionName || r.attractionId || "Attraction"}
                                    </div>

                                    {r.comment ? (
                                        <div style={{ color: colors.sub, marginTop: 6 }}>{r.comment}</div>
                                    ) : null}
                                </div>

                                <div
                                    style={{
                                        minWidth: 110,
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <StarRating rating={r.rating} />
                                    <span style={{ color: colors.sub, fontSize: 12 }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                  </span>
                                </div>
                            </div>

                            {/* Optional: tiny meta row */}
                            {(r.attractionAddress || r.attractionUrl) && (
                                <div style={{ color: colors.sub, fontSize: 12, marginTop: 8 }}>
                                    {r.attractionAddress ? r.attractionAddress : ""}
                                    {r.attractionUrl ? (
                                        <>
                                            {" "}
                                            ·{" "}
                                            <a
                                                href={r.attractionUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{ color: "#0070f3" }}
                                            >
                                                View
                                            </a>
                                        </>
                                    ) : null}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Pagination */}
            {!loading && pageCount > 1 && (
                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 16,
                    }}
                >
                    <button
                        onClick={goPrev}
                        disabled={page <= 1}
                        style={{
                            padding: "8px 12px",
                            background: colors.btnBg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 8,
                            cursor: page <= 1 ? "not-allowed" : "pointer",
                            opacity: page <= 1 ? 0.6 : 1,
                        }}
                    >
                        ← Prev
                    </button>
                    <span style={{ color: colors.sub, minWidth: 120, textAlign: "center" }}>
            Page {page} of {pageCount}
          </span>
                    <button
                        onClick={goNext}
                        disabled={page >= pageCount}
                        style={{
                            padding: "8px 12px",
                            background: colors.btnBg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 8,
                            cursor: page >= pageCount ? "not-allowed" : "pointer",
                            opacity: page >= pageCount ? 0.6 : 1,
                        }}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}