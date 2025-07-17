import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Reviews from "../../components/Reviews/Reviews";
import ReviewForm from "../../components/Reviews/ReviewForm";

export default function AttractionDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [token, setToken] = useState("");

  useEffect(() => {
    // Load the JWT token from localStorage
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
    }
  }, []);

  if (!id) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "1em" }}>
      <h1>Attraction Details</h1>
      <p>Attraction ID: {id}</p>

      <Reviews attractionId={id} />

      {token ? (
        <ReviewForm
          attractionId={id}
          token={token}
          onReviewAdded={() => router.replace(router.asPath)}
        />
      ) : (
        <p style={{ color: "gray" }}>Log in to write a review.</p>
      )}
    </div>
  );
}
