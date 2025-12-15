import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import StreamList from "./components/StreamList";
import Movies from "./components/Movies";
import Cart from "./components/Cart";
import About from "./components/About";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>EZTechMovie StreamList</h1>
        <p>Create and manage your personal streaming list</p>
      </header>

      <nav className="app-nav">
        <ul>
          <li>
            <Link to="/">StreamList</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <small>EZTechMovie StreamList Prototype</small>
      </footer>
    </div>
  );
}

export default App;
