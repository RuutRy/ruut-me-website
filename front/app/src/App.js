import React, { Component } from "react";

import { BrowserRouter as Router, Link } from "react-router-dom";

import "./App.css";
import "nes.css/css/nes.css";

import Content from "./Content.jsx";


class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <header>
            <h1>
              <img className="brand" src="/ruut_small.png" alt="Ruut ry logo" />
              Ruut ry
            </h1>
          </header>

          <nav className="main-nav">
            <Link to="/">
              <button className="nes-btn">Yleistä</button>
            </Link>
            <Link to="/yhteystiedot">
              <button className="nes-btn">Yhteystiedot</button>
            </Link>
            <Link to="/jäseneksi">
              <button className="nes-btn">Jäseneksi</button>
            </Link>
            <Link to="/jäsenmaksu">
              <button className="nes-btn">Jäsenmaksu</button>
            </Link>
            <Link to="/lagfest">
              <button className="nes-btn">Lagfest</button>
            </Link>
            <Link to="/lagfest-setätäti">
              <button className="nes-btn">TätiSetälanit</button>
            </Link>
          </nav>

          <Content />

          <footer className="footer">
            <p>
              <a href="/tietosuojaseloste.pdf">
                Tietosuojaseloste
              </a>
            </p>
            <p>(c) Ruut ry 2024</p>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
