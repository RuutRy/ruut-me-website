import React, { Component } from "react";

class Contacts extends Component {
  render() {
    return (
      <section className="nes-container with-title">
        <h2 className="title">Yhteystiedot</h2>
        <div>
          <h3>Puheenjohtaja</h3>
          <p>Miko Mattila</p>
          <p>
            <a href="mailto:Miko.Mattila@student.lut.fi">
              Miko.Mattila@student.lut.fi
            </a>
          </p>
          <h3>Varapuheenjohtaja</h3>
          <p>Noora Parkko</p>
          <p>
            <a href="mailto:noora.parkko@student.lut.fi">
              noora.parkko@student.lut.fi
            </a>
          </p>
          <h3>Rahastonhoitaja</h3>
          <p>Tuomas Mustakallio</p>
          <p>
            <a href="mailto:tuomas.mustakallio@student.lut.fi">
              tuomas.mustakallio@student.lut.fi
            </a>
          </p>
          <h3>ATK-vastaava</h3>
          <p>Konsta Keski-Mattinen</p>
          <p>
            <a href="mailto:konsta.keski-mattinen@student.lut.fi">
              konsta.keski-mattinen@student.lut.fi
            </a>
          </p>
          <h3>Sihteeri</h3>
          <p>leevi Laitala</p>
          <p>
            <a href="mailto:leevi.laitala@student.lut.fi">
              leevi.laitala@student.lut.fi
            </a>
          </p>
          <h3>Hallituksen jäsen</h3>
          <p>Jeremias Walhsten</p>
          <p>
            <a href="mailto:jeremias.walhsten@student.lut.fi">
              jeremias.walhsten@student.lut.fi
            </a>
          </p>
        </div>
      </section>
    );
  }
}

export default Contacts;
