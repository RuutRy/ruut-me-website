import React, { Component } from 'react';

import classNames from 'classnames';

import './nes.css.fixes.css';

import FormInfo from './FormInfo.jsx';

// TODO: load this from the environment or something
const formUrl = 'https://ruut.me/api/join';

const Star = () => (
  <span style={{ color: 'red' }}>*</span>
);

class JoinForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: null,
      hometown: null,
      ltky: null,
      study: null,
      'study-other': '',
      email: null,
      gdpr: null,

      stage: 'form',
    };

    this.renderField = this.renderField.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.validate = this.validate.bind(this);
  }

  sendForm(e) {
    e.preventDefault();
    this.setState({
      stage: 'sending'
    }, async () => {
      try {
        const { name, hometown, ltky, study, email, gdpr } = this.state;
        const data = { name, hometown, ltky, study, email, gdpr };
        data['study-other'] = this.state['study-other'];
        const res = await window.fetch(formUrl, {
          method: 'POST',
          cors: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (res.status !== 200) {
          this.setState({
            stage: 'error',
            message: json['message'],
            retry: !!json['retry'],
          });
        } else {
          this.setState({
            stage: 'sent',
          });
        }
      } catch (ex) {
        this.setState({
          stage: 'error',
          message: null,
          retry: true,
        });
      }
    });
  }

  validate({ key, type="text", required=true }) {
    const input = this.state[key];

    if (input === null) {
      return !required || null;
    }

    if (type === 'flag') {
      return !required || !!input;
    }

    if (type === 'multi') {
      return true;
    }

    return !required || (input && input.length > 0);
  }

  renderField(spec) {
    const { key, title, type="text", required=true } = spec;
    const onChange = e => {
      if (type === 'flag') {
        this.setState({
          [key]: e.target.checked
        });
      } else if (type === 'multi') {
        if (e.target.checked) {
          this.setState({
            [key]: e.target.value
          });
        }
      } else {
        this.setState({
          [key]: e.target.value
        });
      }
    };

    const result = this.validate(spec);
    const value = this.state[key];

    if (type === 'multi') {
      const { options } = spec;
      const choices = options.map(o => {
        return (
          <label key={o.key} style={{ display: 'block' }}>
            <input className="nes-radio" type="radio" value={o.key} checked={value===o.key} onChange={onChange} />
            <span>
              {o.name}
            </span>
          </label>
        );
      });
      return (
        <div key={key}>
          <p>{title}{required && <Star />}</p>
          {choices}
        </div>
      );
    }

    if (type === 'flag') {
      return (
        <label key={key}>
          <input className="nes-checkbox" type="checkbox" checked={!!value} onChange={onChange} />
          <span>{title}{required && <Star />}</span>
        </label>
      );
    }

    const className = classNames('nes-input', {
      'is-error': result === false,
      'is-success': result === true,
    });

    return (
      <div className="nes-field" key={key}>
        <label htmlFor={key}>{title}{required && <Star />}</label>
        <input value={value || ''} id={key} className={className} type={type} onChange={onChange} />
      </div>
    );
  }

  renderForm() {
    const fieldSpecs = [
      { key: 'name', title: 'Koko nimi' },
      { key: 'hometown', title: 'Kotipaikka' },
      { key: 'ltky', title: 'Olen LTKY:n jäsen', type: 'flag', required: false },
      { key: 'study', title: 'Valitse opiskelijastatuksesi', type: 'multi', options: [
        { key: 'lut', name: 'Lappeenrannan-Lahden teknillinen yliopisto'},
        { key: 'lab', name: 'LAB-ammattikorkeakoulu'},
        { key: 'alumnus', name: 'Vanha jäsen / Alumni'},
        { key: 'other', name: 'Muu' },
      ] },
      { key: 'study-other', title: 'Muu, mikä?', type: 'text' },
      { key: 'email', title: 'Sähköpostiosoite (Mikäli olet LUT korkeakoulujen opiskelija, käytä opiskelijasähköpostiasi)', type: 'email' },
      { key: 'gdpr', title: 'Hyväksyn, että tietojani säilytetään Ruut ry:n jäsenrekisterissä', type: 'flag' },
    ].filter(s => s.key === 'study-other' ? this.state.study === 'other' : true);

    let valid = true;
    fieldSpecs.forEach(spec => {
      if (this.validate(spec) !== true) {
        valid = false;
      }
    });

    const fields = fieldSpecs.map(this.renderField);

    const className = classNames(
      'nes-btn',
      'is-primary',
      'btn-right',
      { 'is-disabled': !valid }
    );

    return (
      <form>
        {fields}
        <div className="form-actions">
          <button disabled={!valid} className={className} type="submit" onClick={this.sendForm} >Liity</button>
        </div>
      </form>
    );
  }

  render() {

    const { stage, message } = this.state;

    return (
      <section className="form nes-container with-title">
        <h2 className="title">Liittyminen</h2>
        <div>
          <FormInfo />
          {stage === 'form' && this.renderForm()}
          {stage === 'sending' && <p>Lomaketta lähetetään...</p>}
          {stage === 'sent' && <p>Kiitos liittymisestäsi!</p>}
          {stage === 'error' && (
            <>
              <p>{message || 'Lomaketta lähetettäessä tapahtui virhe.'}</p>
              <button
                className="nes-btn is-error"
                onClick={() => this.setState({ stage: 'form' })}
              >
                Yritä uudelleen
              </button>
            </>
          )}
        </div>
      </section>
    );
  }
}

export default JoinForm;
