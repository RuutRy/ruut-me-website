import React, { Component } from 'react';

class MembershipFeeInfo extends Component {
  render() {
    return (
      <section className="form nes-container with-title">
        <h2 className="title">Jäsenmaksu</h2>
        <div>
          <p>Ruut&apos;n jäsenmaksu vuodelle 2024 on</p>
          <ul className="nes-list is-disc">
            <li>Aktiivijäsenelle 5€</li>
            <li>Kannatusjäsenelle 25€</li>
          </ul>
          <p>Jäsenmaksu maksetaan yhdistyksen holvi verkkokaupaan:</p>
          <a href="https://holvi.com/shop/lagfest/">
            Linkki holvin verkkokaupaan
          </a>
        </div>
      </section>
    );
  }
}

export default MembershipFeeInfo;
