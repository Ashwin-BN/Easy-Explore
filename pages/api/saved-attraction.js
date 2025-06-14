// pages/api/saved-attractions.js
import clientPromise from "@/lib/mongodb";
import { jwtDecode } from "jwt-decode";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("easyexplore");
  const collection = db.collection("savedAttractions");

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  let user;
  try {
    user = jwtDecode(token); // get user info
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }

  const userId = user.sub || user.email;

  if (req.method === "POST") {
    const attraction = req.body;

    // Prevent duplicates
    const exists = await collection.findOne({ userId, "attraction.id": attraction.id });
    if (exists) {
      return res.status(409).json({ message: "Already saved" });
    }

    await collection.insertOne({ userId, attraction });
    return res.status(201).json({ message: "Attraction saved" });
  }

  if (req.method === "GET") {
    const saved = await collection.find({ userId }).toArray();
    return res.status(200).json(saved.map((doc) => doc.attraction));
  }

  res.status(405).end(); // method not allowed
}
