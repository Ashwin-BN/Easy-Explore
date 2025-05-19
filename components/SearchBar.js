import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const res = await fetch(`/api/search?query=${query}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input
        type="text"
        placeholder="Search attractions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "10px 16px",
          fontSize: "16px",
          width: "300px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          marginLeft: "10px",
          padding: "10px 16px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      >
        Search
      </button>

      <div style={{ marginTop: "30px" }}>
        {results.length > 0 ? (
          <ul>
            {results.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> – {item.location}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}