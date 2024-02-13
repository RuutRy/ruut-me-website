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
          <p>Miko Mattila</p>
          <p>
            <a href="mailto:miko.mattila@student.lut.fi">
              miko.mattila@student.lut.fi
            </a>
          </p>
          <h3>Rahastonhoitaja</h3>
          <p>Niklas Hjelm</p>
          <p>
            <a href="mailto:niklas.hjelm@student.lut.fi">
              niklas.hjelm@student.lut.fi
            </a>
          </p>
          <h3>ATK-vastaava</h3>
          <p>Elias Samuli</p>
          <p>
            <a href="mailto:elias.samuli@student.lut.fi">
              elias.samuli@student.lut.fi
            </a>
          </p>
          <h3>Sihteeri</h3>
          <p>Miika Pynttäri</p>
          <p>
            <a href="mailto:miika.pynttari@student.lut.fi">
              miika.pynttari@student.lut.fi
            </a>
          </p>
          <h3>Hallituksen jäsen</h3>
          <p>Elias Ryökäs</p>
          <p>
            <a href="mailto:elias.ryökäs@student.lut.fi">
              elias.ryökäs@student.lut.fi
            </a>
          </p>
        </div>
      </section>
    );
  }
}

export default Contacts;
