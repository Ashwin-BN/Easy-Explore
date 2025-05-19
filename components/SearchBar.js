import { useState } from "react";

export default function SearchBar({ onResults }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const lat = 43.65107;
  const lon = -79.347015;

  const handleInput = async (value) => {
    setQuery(value);
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/suggest?lat=${lat}&lon=${lon}&query=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSuggestions([]);

    try {
      const res = await fetch(`/api/search?lat=${lat}&lon=${lon}&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      onResults(data);
    } catch (err) {
      console.error("Search failed", err);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Search for attractions"
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={handleSearch} style={{ marginLeft: "10px", padding: "10px" }}>
        Search
      </button>

      {suggestions.length > 0 && (
        <ul style={{ textAlign: "left", width: "300px", margin: "10px auto", background: "#f9f9f9" }}>
          {suggestions.map((s) => (
            <li key={s.id} onClick={() => setQuery(s.name)} style={{ cursor: "pointer", padding: "5px" }}>
              {s.name}
            </li>
          ))}
        </ul>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
}
