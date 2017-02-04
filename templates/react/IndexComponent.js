
import _                      from 'underscore';
import React                  from 'react';

import ThatContainer          from './containers/Container';
import * as Actions           from '../actions/actions';

// ----- Begin React Native -----
// Keep this for React Native
import { Router, Scene }      from 'react-native-router-flux';

import {
  StyleSheet,
  DeviceEventEmitter } from 'react-native';
// ----- End React Native -----

// ----- Begin React JS -----
// Keep this for React JS
import './App.css';
//import 'bootstrap/dist/css/bootstrap.css';
import './short.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
// ----- End React JS -----

console.log("IndexComponent.js loading");

export default class IndexComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var self  = this;
    var store = self.props.store;
  }

  render() {
    console.log('IndexComponent.render');

    // Keep this for React Native
    return (
      <Router>
        <Scene key="root">

          <Scene key="thatContainer" component={ThatContainer} title="That"
            store={this.props.store}
          />

        </Scene>
      </Router>
    )

    // Keep this for React JS
    return (
      <div>
        <Navbar inverse fluid fixedTop>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">That App</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
          </Grid>
        </Navbar>
        <div>
          <Grid fluid={true}>
            <ThatComponent />
          </Grid>
        </div>
      </div>
    )
  }
}

