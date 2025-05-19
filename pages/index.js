import { useState } from "react";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [results, setResults] = useState([]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Attraction Finder</h1>
      <SearchBar onResults={setResults} />
      <ul>
        {results.map((r) => (
          <li key={r.id}>
            <strong>{r.name}</strong> – {r.distance}m away
          </li>
        ))}
      </ul>
    </div>
  );
}
