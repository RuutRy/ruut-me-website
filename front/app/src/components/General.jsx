import React, { Component } from 'react';

import { LutUniversityLink, SaimiaLink } from './links.jsx';

class General extends Component {
  render() {
    return (
      <section className="nes-container with-title">
        <h2 className="title">Yleistä</h2>
        <div>
          <p>
            Ruut ry tarjoaa <LutUniversityLink />n ja <SaimiaLink />n opiskelijoille ja henkilökunnalle tietoteknisiä palveluja.
          </p>
          <p>
            Muutamia Ruut&apos;n tarjoamia palveluja ovat:
          </p>
          <ul className="nes-list is-disc">
            <li>Lagfest-lanit kahdesti vuodessa</li>
            <li>Assembly Summer -yhteistilaus</li>
          </ul>
        </div>
      </section>
    );
  }
}

export default General;
