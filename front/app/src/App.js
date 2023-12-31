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
            <Link to="/liittyminen">
              <button className="nes-btn">Liittyminen</button>
            </Link>
            <Link to="/jäsenmaksu">
              <button className="nes-btn">Jäsenmaksu</button>
            </Link>
            <Link to="/lagfest">
              <button className="nes-btn">Lagfest</button>
            </Link>
            <Link to="/lagfest-fuksit">
              <button className="nes-btn">Tutustumislanit</button>
            </Link>
          </nav>

          <Content />

          <footer className="footer">
            <p>
              <a href="https://www.facebook.com/RuutRy/">
                <i className="nes-icon facebook is-small" /> Ruut
              </a>
            </p>
            <p>(c) Ruut ry 2023</p>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
