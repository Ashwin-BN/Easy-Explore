export async function deleteReview(reviewId, token) {
    const res = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `jwt ${token}`,
      },
    });
  
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to delete review');
    }
  }
  