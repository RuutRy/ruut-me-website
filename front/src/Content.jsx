import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';

import asyncComponent from './AsyncComponent.jsx';

import './Content.css';

const AsyncGeneral = asyncComponent(() => import('./components/General.jsx'));
const AsyncContacts = asyncComponent(() => import('./components/Contacts.jsx'));
const AsyncMembershipJoinInfo = asyncComponent(() =>
  import('./components/MembershipJoinInfo.jsx')
);
const AsyncMembershipFeeInfo = asyncComponent(() =>
  import('./components/MembershipFeeInfo.jsx')
);
const AsyncLagfestInfo = asyncComponent(() =>
  import('./components/LagfestInfo.jsx')
);

const AsyncVanhusLagfestInfo = asyncComponent(() =>
  import('./components/VanhusLagfestInfo.jsx')
);

const AsyncKiltacs = asyncComponent(() => import('./components/Kiltacs.jsx'));

class Content extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={AsyncGeneral} />
        <Route path="/yhteystiedot" component={AsyncContacts} />
        <Route path="/jäseneksi" component={AsyncMembershipJoinInfo} />
        <Route path="/jäsenmaksu" component={AsyncMembershipFeeInfo} />
        <Route path="/lagfest" component={AsyncLagfestInfo} />
        <Route path="/lagfest-setätäti" component={AsyncVanhusLagfestInfo} />
        <Route path="/kiltacs" component={AsyncKiltacs} />
      </Switch>
    );
  }
}

export default Content;
