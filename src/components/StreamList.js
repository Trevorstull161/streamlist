import React, { useState } from "react";

function StreamList() {
  const [item, setItem] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (item.trim() === "") {
      console.log("No item entered");
      return;
    }

    console.log("StreamList item added:", item);
    setItem("");
  };

  return (
    <section className="page">
      <h2>StreamList</h2>
      <p>
        Use this page to add movies or shows you want to watch. For Week 1,
        your entries will appear in the browser console.
      </p>

      <form onSubmit={handleSubmit} className="streamlist-form">
        <label htmlFor="streamItem">Add to your StreamList:</label>
        <input
          id="streamItem"
          type="text"
          value={item}
          placeholder="Type a movie or show title"
          onChange={(event) => setItem(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <p className="note">
        Open the browser developer tools and look at the console to see your
        entries printed as you add them.
      </p>
    </section>
  );
}

export default StreamList;
