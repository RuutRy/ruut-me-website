import React, { Component } from 'react';

const DEMO_FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(.+)\.dem$/;

function parseDemo(blob) {
  const match = blob.name.match(DEMO_FILENAME_RE);
  if (!match) return null;
  const [, year, month, day, hour, minute, map] = match;
  return {
    name: blob.name,
    url: blob.url,
    date: `${year}-${month}-${day} ${hour}:${minute}`,
    sortKey: `${year}-${month}-${day}-${hour}-${minute}`,
    map,
  };
}

class Kiltacs extends Component {
  constructor(props) {
    super(props);
    this.state = { demos: [], loading: true, error: null };
  }

  componentDidMount() {
    fetch('https://ruut-backend-function-app.azurewebsites.net/api/kiltacs')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
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

  render() {
    const { demos, loading, error } = this.state;

    return (
      <section className="nes-container with-title">
        <h2 className="title">CS2 demot</h2>

        {loading && <p>Ladataan...</p>}

        {error && (
          <p className="nes-text is-error">Virhe: {error}</p>
        )}

        {!loading && !error && demos.length === 0 && (
          <p>Ei demoja saatavilla.</p>
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
