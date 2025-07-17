import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

// Component to submit a review for an attraction
export default function ReviewForm({ attractionId, token, onReviewAdded }) {
  // 🟡 Define component state for form input and feedback
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Render login prompt if no token
  if (!token) {
    return (
      <p style={{ color: "gray", marginTop: "1em" }}>
        Please log in to leave a review.
      </p>
    );
  }

  // 🟢 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`, // ✅ secure the request
        },
        body: JSON.stringify({ attractionId, rating, comment }),
      });

      const text = await res.text(); // Handle non-JSON responses

      if (!res.ok) {
        let errorMsg = "Failed to submit review";
        try {
          const data = JSON.parse(text);
          errorMsg = data.message || errorMsg;
        } catch {
          errorMsg = text;
        }
        throw new Error(errorMsg);
      }

      // ✅ Reset form and refresh parent list
      setRating(0);
      setHover(0);
      setComment("");
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1em" }}>
      <h4>Write a Review</h4>

      {/* 🔴 Show any error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ⭐ Star rating input */}
      <div style={{ marginBottom: "0.5em" }}>
        <label>Your Rating:</label>
        <div style={{ display: "flex" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={24}
              color={star <= (hover || rating) ? "#FFD700" : "#e4e5e9"}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{ cursor: "pointer", marginRight: 4 }}
            />
          ))}
        </div>
      </div>

      {/* 📝 Comment text area */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Share your experience..."
        style={{
          width: "100%",
          padding: "0.6em",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      {/* ✅ Submit button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: "#1976d2",
          color: "#fff",
          padding: "0.5em 1em",
          borderRadius: "4px",
          marginTop: "0.5em",
          cursor: "pointer",
        }}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
