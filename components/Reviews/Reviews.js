import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import ReviewForm from "./ReviewForm";
import StarRating from "../StarRating";
import { readToken } from "@/lib/authentication";
import { color } from "framer-motion";

export default function Reviews({ attractionId, token }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);

  const currentUser = readToken(); // get logged-in user

  // Fetch reviews from backend
  const fetchReviews = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/reviews/${attractionId}`)
      .then((res) => res.json())
      .then((data) => {
        // Sort so current user's review is on top
        const sorted = [...data].sort((a, b) => {
          const isAUser = a.userId?._id === currentUser?._id || a.userId === currentUser?._id;
          const isBUser = b.userId?._id === currentUser?._id || b.userId === currentUser?._id;
          if (isAUser && !isBUser) return -1;
          if (!isAUser && isBUser) return 1;
          return 0; // otherwise leave order as-is
        });
      
        setReviews(sorted);
        setLoading(false);
      })
      
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (attractionId) fetchReviews();
  }, [attractionId]);

  if (loading) return <p>Loading reviews...</p>;

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

  const hasUserReviewed =
    currentUser &&
    reviews.some(
      (r) =>
        r.userId?._id === currentUser._id || r.userId === currentUser._id
    );

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `jwt ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to delete review");
      }

      fetchReviews(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
    setMenuOpen({});
  };

  const submitEdit = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${editingReviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`,
        },
        body: JSON.stringify({ rating: editRating, comment: editComment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to update review");
      }

      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ marginTop: "1em", textAlign: "left" }}>
      

      {/* Show average rating if reviews exist */}
      {totalReviews > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5em", marginBottom: "1em" }}>
          <StarRating rating={Math.round(averageRating)} />
          <span style={{ fontSize: "0.95em", color: "#333" }}>
            {averageRating} / 5 · {totalReviews} review{totalReviews !== 1 && "s"}
          </span>
        </div>
      )}

      {/* Review list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {reviews.map((review) => {
          const isOwner =
            currentUser &&
            (review.userId?._id === currentUser._id || review.userId === currentUser._id);
          const isEditing = editingReviewId === review._id;

          return (
            <li
              key={review._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1em",
                marginBottom: "1em",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>{review.userId?.userName || "Anonymous"}</strong>
                  {!isEditing && <StarRating rating={review.rating} />}
                </div>

                {/* Options menu */}
                {isOwner && (
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() =>
                        setMenuOpen((prev) => ({
                          ...prev,
                          [review._id]: !prev[review._id],
                        }))
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "#333",
                      }}
                    >
                      &#8942;
                    </button>

                    {menuOpen[review._id] && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "25px",
                          background: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                          zIndex: 100,
                        }}
                      >
                        <button onClick={() => handleEdit(review)} style={dropdownBtn}>Edit</button>
                        <button onClick={() => handleDelete(review._id)} style={{ ...dropdownBtn, color: "red" }}>Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* Show comment or editable fields */}
                {isEditing ? (
                  <div style={{ width: "100%" }}>
                    <div style={{ display: "flex", marginTop: "0.5em" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={20}
                          style={{ cursor: "pointer", marginRight: 4 }}
                          color={star <= editRating ? "#FFD700" : "#e4e5e9"}
                          onClick={() => setEditRating(star)}
                        />
                      ))}
                    </div>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "0.5em",
                        marginTop: "0.5em",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <div style={{ marginTop: "0.5em" }}>
                      <button onClick={submitEdit} style={saveBtn}>Save</button>
                      <button onClick={() => setEditingReviewId(null)} style={cancelBtn}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ marginTop: "0.5em", flex: 1 }}>{review.comment}</p>
                )}

                <small style={{ color: "#666", marginLeft: "1em", whiteSpace: "nowrap" }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Show form only if user hasn't reviewed */}
      {token && !hasUserReviewed && (
        <ReviewForm
          attractionId={attractionId}
          token={token}
          onReviewAdded={fetchReviews}
        />
      )}

      {/* Message if already reviewed */}
      {token && hasUserReviewed && (
        <p style={{ color: "green" }}>You have already reviewed this attraction.</p>
      )}
    </div>
  );
}

// Styles for dropdown buttons
const dropdownBtn = {
  display: "block",
  width: "100%",
  padding: "0.5em 1em",
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "0.9em",
  color:"Red"
};

// Save button style
const saveBtn = {
  backgroundColor: "#1976d2",
  color: "#fff",
  border: "none",
  padding: "0.4em 0.8em",
  borderRadius: "4px",
  marginRight: "0.5em",
};

// Cancel button style
const cancelBtn = {
  backgroundColor: "#ccc",
  border: "none",
  padding: "0.4em 0.8em",
  borderRadius: "4px",
};
