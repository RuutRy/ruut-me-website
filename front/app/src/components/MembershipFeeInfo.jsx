import React, { Component } from "react";

class MembershipFeeInfo extends Component {
  render() {
    return (
      <section className="form nes-container with-title">
        <h2 className="title">Jäsenmaksu</h2>
        <div>
          <p>Ruut&apos;n jäsenmaksu vuodelle 2023 on</p>
          <ul className="nes-list is-disc">
            <li>Aktiivijäsenelle 5€</li>
            <li>Alumnijäsenelle 0€</li>
          </ul>
          <p>Jäsenmaksu maksetaan yhdistyksen tilille:</p>
          <pre>IBAN: FI80 7997 7994 3130 59</pre>
        </div>
      </section>
    );
  }
}

export default MembershipFeeInfo;
