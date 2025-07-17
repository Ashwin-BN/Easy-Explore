import React from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          color={star <= rating ? "#FFD700" : "#e4e5e9"}
          size={20}
        />
      ))}
    </div>
  );
}
