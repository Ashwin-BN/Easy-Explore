export async function deleteReview(reviewId, token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`, {
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
  