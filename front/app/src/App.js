import React, { Component } from 'react';

import { BrowserRouter as Router, Link } from 'react-router-dom';

import './App.css';
import 'nes.css/css/nes.css';

import Content from './Content.jsx';

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
						<a href="https://haalarilan.it/">
							<button className="nes-btn">Haalarilanit</button>
						</a>
					</nav>

					<Content />

					<footer className="footer">
						<div className="socialmedia">
							<a href="https://www.instagram.com/ruut_ry/">
								<img alt="instagram" src="/images/instagram_logo.png"></img>
							</a>
							<h6>
								<a href="https://www.instagram.com/ruut_ry/">Instagram</a>
							</h6>
							<a href="https://t.me/+GZFAzIDgOBYxYTI0">
								<img alt="telegram" src="images/telegram_logo_black.png"></img>
							</a>
							<h6>
								<a href="https://t.me/+GZFAzIDgOBYxYTI0">Telegram</a>
							</h6>
						</div>
						<p>
							<a href="/tietosuojaseloste.pdf">Tietosuojaseloste</a>
						</p>

						<p>(c) Ruut ry 2026</p>
					</footer>
				</div>
			</Router>
		);
	}
}

export default App;
