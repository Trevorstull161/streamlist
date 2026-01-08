import React, { useEffect, useMemo, useState } from "react";

export default function Movies() {
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canSearch = useMemo(() => {
    return Boolean(API_KEY) && submittedQuery.trim().length > 0;
  }, [API_KEY, submittedQuery]);

  useEffect(() => {
    const runSearch = async () => {
      // Clear old states
      setErrorMsg("");
      setMovies([]);

      if (!API_KEY) {
        setErrorMsg(
          "TMDB API key is missing. Make sure you created a .env file with REACT_APP_TMDB_API_KEY and restarted npm start."
        );
        return;
      }

      if (!submittedQuery.trim()) return;

      setLoading(true);

      try {
        const encodedQuery = encodeURIComponent(submittedQuery.trim());

        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodedQuery}&include_adult=false&language=en-US&page=1`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`TMDB request failed with status ${res.status}`);
        }

        const data = await res.json();

        if (!data || !Array.isArray(data.results)) {
          throw new Error("Unexpected TMDB response format.");
        }

        setMovies(data.results);
      } catch (err) {
        setErrorMsg(err.message || "Something went wrong while fetching movies.");
      } finally {
        setLoading(false);
      }
    };

    if (canSearch) {
      runSearch();
    }
  }, [API_KEY, canSearch, submittedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedQuery(query);
  };

  const posterUrl = (path) => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/w200${path}`;
  };

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 16 }}>
      <h2>Movies</h2>
      <p>
        Search The Movie Database (TMDB) and display results inside the StreamList
        app.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 10, marginBottom: 16 }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie (example: Batman)"
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {!API_KEY && (
        <p style={{ color: "crimson" }}>
          Missing TMDB API key. Create a <strong>.env</strong> file in the StreamList
          root (same place as package.json) and add:
          <br />
          <code>REACT_APP_TMDB_API_KEY=your_key_here</code>
          <br />
          Then restart your dev server.
        </p>
      )}

      {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}

      {loading && <p>Loading results...</p>}

      {!loading && submittedQuery.trim() && movies.length === 0 && !errorMsg && (
        <p>No results found for "{submittedQuery}". Try a different search.</p>
      )}

      {!loading && movies.length > 0 && (
        <>
          <p>
            Showing {movies.length} result{movies.length !== 1 ? "s" : ""} for "
            {submittedQuery}"
          </p>

          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
            {movies.map((m) => {
              const year = m.release_date ? m.release_date.slice(0, 4) : "N/A";
              const rating =
                typeof m.vote_average === "number"
                  ? m.vote_average.toFixed(1)
                  : "N/A";

              return (
                <li
                  key={m.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: 12,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ width: 80, flexShrink: 0 }}>
                    {posterUrl(m.poster_path) ? (
                      <img
                        src={posterUrl(m.poster_path)}
                        alt={m.title}
                        style={{ width: "100%", borderRadius: 8 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 120,
                          borderRadius: 8,
                          border: "1px solid #ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          opacity: 0.7,
                        }}
                      >
                        No Poster
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0 }}>
                      {m.title}{" "}
                      <span style={{ fontWeight: "normal", opacity: 0.8 }}>
                        ({year})
                      </span>
                    </h3>

                    <p style={{ margin: "6px 0", fontSize: 14, opacity: 0.85 }}>
                      Rating: {rating}
                    </p>

                    <p style={{ margin: 0, fontSize: 14 }}>
                      {m.overview ? m.overview : "No overview available."}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </>
      )}
    </div>
  );
}

