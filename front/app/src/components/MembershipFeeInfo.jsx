import React, { Component } from "react";

class MembershipFeeInfo extends Component {
  render() {
    return (
      <section className="form nes-container with-title">
        <h2 className="title">Jäsenmaksu</h2>
        <div>
          <p>Ruut&apos;n jäsenmaksu vuodelle 2024 on</p>
          <ul className="nes-list is-disc">
            <li>Aktiivijäsenelle 5€</li>
            <li>Alumnijäsenelle 0€</li>
          </ul>
          <p>Jäsenmaksu maksetaan yhdistyksen holvi verkkokaupaan:</p>
          <a href="https://holvi.com/shop/lagfest/product/6f1aa3eb35858778c3821ef7ac084249/">
            Linkki holvin verkkokaupaan
          </a>
        </div>
      </section>
    );
  }
}

export default MembershipFeeInfo;
