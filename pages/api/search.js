const attractions = [
    { id: 1, name: "Museum of Natural History", location: "New York" },
    { id: 2, name: "Louvre Museum", location: "Paris" },
    { id: 3, name: "Tokyo Tower", location: "Tokyo" },
    { id: 4, name: "Eiffel Tower", location: "Paris" }
  ];
  
  export default function handler(req, res) {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }
  
    const results = attractions.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase())
    );
  
    return res.status(200).json(results);
  }