import React, { Component } from "react";

class MembershipFeeInfo extends Component {
  render() {
    return (
      <section className="form nes-container with-title">
        <h2 className="title">Liity jäseneksi</h2>
        <div>
          <p>Liittyminen Ruut ry:n jäseneksi on ilmaista.</p> 
          <p>Jäsenyyden avulla pääset paremmin vaikuttamaan Ruut ry:n toimintaan, sekä saat käyttöösi jäsenetuja.</p>
          <p>Jäsenedut:</p>
          <ul>
            <li>
              Läsnäolo-, puhe- ja äänioikeus yhdistyksen yleiskokouksissa
            </li>
            <li>
              Edullisemmat tapahtumaliput 
            </li>
            <li>
              Saat maksutta käyttöösi Ruut ry:n laitteistoa (huom. rajoitukset)”
            </li>
          </ul>
        </div>
      </section>
    );
  }
}

export default MembershipFeeInfo;
