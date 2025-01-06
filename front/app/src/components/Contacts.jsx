import React, { Component } from 'react';

class Contacts extends Component {
  render() {
    return (
      <section className="nes-container with-title">
        <h2 className="title">Yhteystiedot</h2>
        <div>
          <h3>Puheenjohtaja</h3>
          <p>Miko Mattila</p>
          <p>
            <a href="mailto:pj@ruut.me">
              pj@ruut.me
            </a>
          </p>
          <h3>Varapuheenjohtaja</h3>
          <p>Jeremias Wahlsten</p>
          <p>
            <a href="mailto:pj@ruut.me">
              pj@ruut.me
            </a>
          </p>
          <h3>Rahastonhoitaja</h3>
          <p>Santeri Nikula</p>
          <p>
            <a href="mailto:laskutus@ruut.me">
              laskutus@ruut.me
            </a>
          </p>
          <h3>ATK-vastaava</h3>
          <p>Pekka Hautaniemi</p>
          <p>
            <a href="mailto:atk@ruut.me">
              atk@ruut.me
            </a>
          </p>
          <h3>Sihteeri</h3>
          <p>Eelis Ojainmaa</p>
          <p>
            <a href="mailto:sihteeri@ruut.me">
              sihteeri@ruut.me
            </a>
          </p>
          <h3>Yrityssuhdevastaava</h3>
          <p>Vilppu Penttilä</p>
          <p>
            <a href="mailto:yritys@ruut.me">
              yritys@ruut.me
            </a>
          </p>
        </div>
      </section>
    );
  }
}

export default Contacts;
