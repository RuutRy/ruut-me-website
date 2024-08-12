import React, { Component } from "react";

import classNames from "classnames";

import moment from "moment";

import "./nes.css.fixes.css";

import "./LagfestInfo.css";
import Sponsors from "./Sponsors";

//Todo update this page to actually work

const formUrl =
  "https://ruut-backend-function-app.azurewebsites.net/api/tatisetaSignup";
const signupsUrl =
  "https://ruut-backend-function-app.azurewebsites.net/api/tatiseta";

const signupMax = 80;

const Star = () => <span style={{ color: "red" }}>*</span>;

const formatDuration = (left) => {
  const ajat = [
    [24 * 60 * 60 * 1000, "päivä", "päivää"],
    [60 * 60 * 1000, "tunti", "tuntia"],
    [60 * 1000, "minuutti", "minuuttia"],
    [1000, "sekunti", "sekuntia"],
  ];

  const parts = [];
  ajat.forEach((time) => {
    const amount = Math.floor(left / time[0]);
    left -= amount * time[0];
    if (amount > 1) {
      parts.push(`${amount} ${time[2]}`);
    } else if (amount === 1) {
      parts.push(`${amount} ${time[1]}`);
    }
  });
  if (parts.length === 0) {
    return "NYT";
  } else if (parts.length === 1) {
    return parts[0];
  } else {
    return `${parts.slice(0, parts.length - 1).join(", ")} ja ${
      parts[parts.length - 1]
    }`;
  }
};

class LagfestInfo extends Component {
  constructor(props) {
    super(props);

    this.targetRegistration = new Date(2024, 7, 15, 16);
    this.targetStart = new Date(2024, 8, 19, 16);
    this.targetEnd = new Date(2024, 8, 22, 12);

    this.state = {
      dateString: this.getDateString(new Date(), this.targetStart),
      signupString: this.getDateString(new Date(), this.targetRegistration),

      signups: [],
      extras: [],

      name: null,
      email: null,
      yell: null,
      ticket: null,
      gdpr: null,
      opiskelija: null,

      stage: "form",
    };

    this.tick = this.tick.bind(this);
    this.fetchSignups = this.fetchSignups.bind(this);
    this.renderField = this.renderField.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.validate = this.validate.bind(this);
  }

  async fetchSignups() {
    let raw = [];
    try {
      raw = await window
        .fetch(signupsUrl, {
          method: "GET",
          cors: "cors",
        })
        .then((res) => res.json());
    } catch (ex) {
      console.error(ex);
    }

    const signups = raw.slice(0, signupMax);
    const extras = raw.slice(signupMax);
    this.setState({ signups, extras });
  }

  sendForm(e) {
    e.preventDefault();
    this.setState(
      {
        stage: "sending",
      },
      async () => {
        try {
          const { name, email, yell, ticket, gdpr, opiskelija } = this.state;
          const data = { name, email, yell, ticket, gdpr, opiskelija };
          const res = await window.fetch(formUrl, {
            method: "POST",
            cors: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (res.status !== 200) {
            this.setState({
              stage: "error",
              message: json["message"],
              retry: !!json["retry"],
            });
          } else {
            this.fetchSignups();
            this.setState({
              stage: "sent",
            });
          }
        } catch (ex) {
          this.setState({
            stage: "error",
            message: null,
            retry: true,
          });
        }
      }
    );
  }

  validate({ key, type = "text", required = true }) {
    const input = this.state[key];

    if (input === null) {
      return !required || null;
    }

    if (type === "flag") {
      return !required || !!input;
    }

    if (type === "multi") {
      return true;
    }

    return !required || (input && input.length > 0);
  }

  renderField(spec) {
    const { key, title, type = "text", required = true } = spec;
    const onChange = (e) => {
      if (type === "flag") {
        this.setState({
          [key]: e.target.checked,
        });
      } else if (type === "multi") {
        if (e.target.checked) {
          this.setState({
            [key]: e.target.value,
          });
        }
      } else {
        this.setState({
          [key]: e.target.value,
        });
      }
    };

    const result = this.validate(spec);
    const value = this.state[key];

    if (type === "multi") {
      const { options } = spec;
      const choices = options.map((o) => {
        return (
          <label key={o.key} style={{ display: "block" }}>
            <input
              className="nes-radio"
              type="radio"
              value={o.key}
              checked={value === o.key}
              onChange={onChange}
            />
            <span>{o.name}</span>
          </label>
        );
      });
      return (
        <div key={key}>
          <p>
            {title}
            {required && <Star />}
          </p>
          {choices}
        </div>
      );
    }

    if (type === "flag") {
      return (
        <label key={key}>
          <input
            className="nes-checkbox"
            type="checkbox"
            checked={!!value}
            onChange={onChange}
          />
          <span>
            {title}
            {required && <Star />}
          </span>
        </label>
      );
    }

    const className = classNames("nes-input", {
      "is-error": result === false,
      "is-success": result === true,
    });

    return (
      <div className="nes-field" key={key}>
        <label htmlFor={key}>
          {title}
          {required && <Star />}
        </label>
        <input
          value={value || ""}
          id={key}
          className={className}
          type={type}
          onChange={onChange}
        />
      </div>
    );
  }

  renderForm() {
    const fieldSpecs = [
      { key: "name", title: "Koko nimi" },
      { key: "email", title: "Sähköpostiosoite" },
      { key: "yell", title: "Sotahuuto", required: false },
      {
        key: "ticket",
        title: "Lipun tyyppi (valitse alta)",
        type: "multi",
        options: [
          { key: "organizer", name: "Järjestäjät 0€" },
          {
            key: "active",
            name: "Lanittajat 30€ ",
          },
        ],
      },
      {
        key: "opiskelija",
        title: "Olen opiskelija",
        type: "flag",
        required: false,
      },
      {
        key: "gdpr",
        title: "Hyväksyn, että nimeni näkyy osallistujalistalla",
        type: "flag",
      },
    ];

    let valid = true;
    fieldSpecs.forEach((spec) => {
      if (this.validate(spec) !== true) {
        valid = false;
      }
    });

    const fields = fieldSpecs.map(this.renderField);

    const className = classNames("nes-btn", "is-primary", "btn-right", {
      "is-disabled": !valid,
    });

    return (
      <form>
        {fields}
        <div className="form-actions">
          <button
            disabled={!valid}
            className={className}
            type="submit"
            onClick={this.sendForm}
          >
            Ilmoittaudu
          </button>
        </div>
      </form>
    );
  }

  getDateString(now, target) {
    const diff = new Date(target - now);
    if (diff >= 0) {
      const m = moment(target);
      return (
        <>
          <p>{formatDuration(diff)}</p>
          <p>{m.format("YYYY-MM-DD HH:mm")}</p>
        </>
      );
    } else {
      return "Onneksi on jo lanit.";
    }
  }

  tick() {
    this.setState({
      dateString: this.getDateString(Date.now(), this.targetStart),
      signupString: this.getDateString(Date.now(), this.targetRegistration),
    });
  }

  componentDidMount() {
    this.timer = window.setInterval(this.tick, 1000);
    this.fetchSignups();
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  render() {
    const { dateString, signupString } = this.state;
    const { stage, message } = this.state;
    const { signups, extras } = this.state;

    const signupEls = signups.map((s, i) => (
      <div key={i} className="nes-container is-rounded">
        <p>
          #{i + 1} {s.name}
        </p>
        {s.yell && <p className="yell">"{s.yell}"</p>}
      </div>
    ));

    const extraEls = extras.map((s, i) => (
      <div key={i} className="nes-container is-rounded">
        <p>
          #{i + 1} {s.name}
        </p>
        {s.yell && <p>"{s.yell}"</p>}
      </div>
    ));

    const now = new Date();

    const showForm = now >= this.targetRegistration;
    const hideJoin = now >= this.targetStart;
    const over = now >= this.targetEnd;

    return (
      <>
        <section className="nes-container with-title">
          <h2 className="title">TätiSetälanit</h2>
          <div>
            <>{over ?<p>"TätiSetälanit järjestetään 19.9. - 22.9.2024."</p> : dateString}</>
          </div>
        </section>

        {!over && showForm && (
          <>
            <section className="nes-container with-title">
              <h2 className="title">Verkkokauppa</h2>
              <p>
                Ilmoittaudu ensin laneille. Jos sait suoraan lanipaikan, käy
                maksamassa lanipaikkasi alla olevasta linkistä.
              </p>
              <p>
                <a href="https://holvi.com/shop/lagfest/">
                  Lippujen maksaminen
                </a>
              </p>
            </section>
          </>
        )}

        {!over && !showForm && !hideJoin && (
          <section className="nes-container with-title">
            <h2 className="title">Lippujen hinnat</h2>
            <p>Järjestäjät 0€</p>
            <p>
              Lanittajat 30€
            </p>
          </section>
        )}

        {!over && !hideJoin && (
          <section className="nes-container with-title">
            <h2 className="title">
              Ilmoittautuminen{signups.length >= signupMax && " varasijoille"}
            </h2>
            {(showForm && (
              <>
                {stage === "form" && this.renderForm()}
                {stage === "sending" && <p>Lomaketta lähetetään...</p>}
                {stage === "sent" && (
                  <>
                    <p>Kiitos ilmoittautumisestasi!</p>
                    <p>
                      Muistathan vielä maksaa lippusi yllä olevasta linkistä.
                    </p>
                  </>
                )}
                {stage === "error" && (
                  <>
                    <p>
                      {message || "Lomaketta lähetettäessä tapahtui virhe."}
                    </p>
                    <button
                      className="nes-btn is-error"
                      onClick={() => this.setState({ stage: "form" })}
                    >
                      Yritä uudelleen
                    </button>
                  </>
                )}
              </>
            )) || (
              <div>
                <>{signupString}</>
              </div>
            )}
          </section>
        )}
        {
          <section  className="nes-container with-title">
            <h2 className="title">yhteistyökumppanit</h2>
            <Sponsors class="sponsors-container" />
          </section>
        }
        {!over && signups.length > 0 && showForm && (
          <section className="nes-container with-title">
            <h2 className="title">
              TätiSetä-ilmoittautumiset ({signups.length}/{signupMax})
            </h2>
            {signupEls}
          </section>
        )}
        {!over && extras.length > 0 && showForm && (
          <section className="nes-container with-title">
            <h2 className="title">Varasijat ({extras.length})</h2>
            {extraEls}
          </section>
        )}
      </>
    );
  }
}

export default LagfestInfo;
