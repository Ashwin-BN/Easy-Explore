import StarRating from "@/components/StarRating";

export default function ReviewStrip({ reviews = [], onSeeAll }) {
    if (!reviews || reviews.length === 0) return null;

    // browser-safe helpers (no Buffer)
    const isMostlyPrintable = (s) => {
        if (!s) return false;
        const printable = s.replace(/[^\p{L}\p{N}\p{P}\p{Zs}]/gu, "");
        return printable.length / s.length > 0.6 && printable.trim().length >= 4;
    };

    const tryHexToUtf8 = (hex) => {
        if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) return "";
        try {
            const bytes = new Uint8Array(hex.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
            const txt = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
            return isMostlyPrintable(txt) ? txt.trim() : "";
        } catch {
            return "";
        }
    };

    const tryBase64ToUtf8 = (b64) => {
        if (!/^[A-Za-z0-9+/=]+$/.test(b64) || b64.length % 4 !== 0) return "";
        try {
            const raw = atob(b64);
            const bytes = new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
            const txt = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
            return isMostlyPrintable(txt) ? txt.trim() : "";
        } catch {
            return "";
        }
    };

    const decodeWeirdId = (input) => {
        if (!input || typeof input !== "string") return "";
        const hex = tryHexToUtf8(input);
        if (hex) return hex;
        const b64 = tryBase64ToUtf8(input);
        if (b64) return b64;

        // fallback: take longest printable segment
        const segments = input.split(/[^\p{L}\p{N}\p{P}\p{Zs}]+/gu).filter(Boolean);
        if (segments.length) {
            segments.sort((a, b) => b.length - a.length);
            const candidate = segments[0].trim();
            if (candidate.length >= 4) return candidate;
        }
        return "";
    };

    // SAFE name getter (no unsafe deref)
    const getAttractionName = (r) =>
        r.attractionName || // flattened by backend
        r.attractionTitle ||
        r.attraction?.name ||
        r.attraction?.displayName ||
        decodeWeirdId(r.attractionId) || // smarter fallback
        r.attractionId || // last resort
        "Attraction";

    const colors = {
        text: "var(--review-text, #111)",
        sub: "var(--review-sub, #666)",
        border: "var(--review-border, #eee)",
        cardBg: "var(--review-card, #fff)",
    };

    return (
        <section style={{ marginTop: "2rem" }}>
            <style>{`
        @media (prefers-color-scheme: dark) {
          :root {
            --review-text: #eaeaea;
            --review-sub: #aaa;
            --review-border: #333;
            --review-card: #2a2a3a;
          }
        }
      `}</style>

            <h3 style={{ marginBottom: ".75rem", color: colors.text }}>Recent Reviews</h3>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {reviews.map((r) => (
                    <li
                        key={r._id}
                        style={{
                            padding: "12px 14px",
                            border: `1px solid ${colors.border}`,
                            borderRadius: 10,
                            background: colors.cardBg,
                            marginBottom: 10,
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                            <div style={{ fontWeight: 600, color: colors.text, flex: 1, minWidth: 0 }}>
                <span
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                    }}
                >
                  {getAttractionName(r)}
                </span>

                                {r.comment ? (
                                    <span style={{ color: colors.sub, display: "block", marginTop: 4 }}>
                    {r.comment}
                  </span>
                                ) : null}
                            </div>

                            {r.rating ? (
                                <div
                                    aria-label={`Rating ${r.rating} out of 5`}
                                    title={`Rating ${r.rating}/5`}
                                    style={{
                                        minWidth: 90,
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        paddingLeft: 8,
                                    }}
                                >
                                    <StarRating rating={r.rating} />
                                </div>
                            ) : null}
                        </div>

                        <div style={{ color: colors.sub, fontSize: 12, marginTop: 6 }}>
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                        </div>
                    </li>
                ))}
            </ul>

            {typeof onSeeAll === "function" && (
                <button
                    onClick={onSeeAll}
                    style={{
                        marginTop: 12,
                        background: "none",
                        border: `1px solid ${colors.border}`,
                        padding: "8px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                >
                    See all reviews
                </button>
            )}
        </section>
    );
}