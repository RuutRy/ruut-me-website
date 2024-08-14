import React, { Component } from 'react';
import './sponsors.css';


class Sponsors extends Component{
  constructor(){
    super();
    this.state = {
      sponsors: []
    };
  }


  componentDidMount(){
    fetch('/sponsors/sponsors.json')
      .then(res => res.json())
      .then(sponsors => this.setState({sponsors: sponsors}))
      // eslint-disable-next-line no-console
      .catch(err => console.error(err));
  }

  render(){
    const {sponsors} = this.state;

    return(!sponsors.length ? <></> : <ul>
      {sponsors.map(sponsor => <>  
                <li key={sponsor.name}>
                  <a href={sponsor.link}>
                    <img src={sponsor.src} alt={sponsor.name} />
                  </a>
                </li>
              </>  
      )}
    </ul>);
  }
}

export default Sponsors;