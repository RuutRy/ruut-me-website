import React, { Component } from 'react';

const DEMO_FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(.+)\.dem$/;
const LS_KEY = 'kiltacs_key';
const API = 'https://ruut-backend-function-app.azurewebsites.net/api/kiltacs';

function pad(n) {
  return String(n).padStart(2, '0');
}

function parseDemo(blob) {
  const match = blob.name.match(DEMO_FILENAME_RE);
  if (!match) return null;
  const [, year, month, day, hour, minute, map] = match;
  const utc = new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute));
  const localDate =
    `${utc.getFullYear()}-${pad(utc.getMonth() + 1)}-${pad(utc.getDate())} ` +
    `${pad(utc.getHours())}:${pad(utc.getMinutes())}`;
  return {
    name: blob.name,
    url: blob.url,
    date: localDate,
    sortKey: `${year}-${month}-${day}-${hour}-${minute}`,
    map,
  };
}

class Kiltacs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordInput: '',
      passwordError: false,
      demos: [],
      loading: false,
      error: null,
    };
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.fetchDemos = this.fetchDemos.bind(this);
  }

  componentDidMount() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      this.fetchDemos(saved);
    }
  }

  fetchDemos(key) {
    this.setState({ loading: true, error: null });
    fetch(`${API}?key=${encodeURIComponent(key)}`)
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem(LS_KEY);
          this.setState({ loading: false, passwordError: true, demos: [] });
          return null;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const demos = data
          .map(parseDemo)
          .filter(Boolean)
          .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1));
        this.setState({ demos, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err.message, loading: false });
      });
  }

  handlePasswordSubmit(e) {
    e.preventDefault();
    const { passwordInput } = this.state;
    this.setState({ passwordError: false });
    fetch(`${API}?key=${encodeURIComponent(passwordInput)}`)
      .then((res) => {
        if (res.status === 401) {
          this.setState({ passwordError: true, passwordInput: '' });
          return null;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        localStorage.setItem(LS_KEY, passwordInput);
        const demos = data
          .map(parseDemo)
          .filter(Boolean)
          .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1));
        this.setState({ demos, loading: false, passwordInput: '' });
      })
      .catch((err) => {
        this.setState({ error: err.message, loading: false });
      });
  }

  render() {
    const { passwordInput, passwordError, demos, loading, error } = this.state;
    const unlocked = demos.length > 0 || (loading && !passwordError);

    return (
      <section className="nes-container with-title">
        <h2 className="title">CS2 demot</h2>

        {!unlocked && (
          <form onSubmit={this.handlePasswordSubmit}>
            <div className="nes-field">
              <label htmlFor="demo-key">Salasana</label>
              <input
                id="demo-key"
                className="nes-input"
                type="password"
                value={passwordInput}
                onChange={(e) => this.setState({ passwordInput: e.target.value, passwordError: false })}
                autoFocus
              />
            </div>
            {passwordError && (
              <p className="nes-text is-error" style={{ marginTop: '0.5rem' }}>
                Vaara salasana.
              </p>
            )}
            <button type="submit" className="nes-btn is-primary" style={{ marginTop: '0.75rem' }}>
              OK
            </button>
          </form>
        )}

        {loading && <p>Ladataan...</p>}

        {error && (
          <p className="nes-text is-error">Virhe: {error}</p>
        )}

        {!loading && !error && demos.length > 0 && (
          <table className="nes-table is-bordered is-centered">
            <thead>
              <tr>
                <th>Päivämäärä</th>
                <th>Kartta</th>
                <th>Lataa</th>
              </tr>
            </thead>
            <tbody>
              {demos.map((demo) => (
                <tr key={demo.name}>
                  <td>{demo.date}</td>
                  <td>{demo.map}</td>
                  <td>
                    <a
                      href={demo.url}
                      download={demo.name}
                      className="nes-btn is-primary"
                    >
                      .dem
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    );
  }
}

export default Kiltacs;
