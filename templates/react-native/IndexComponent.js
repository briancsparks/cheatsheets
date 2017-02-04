
import _                      from 'underscore';
import React                  from 'react';

import ThatContainer          from './containers/Container';
import * as Actions           from '../actions/actions';

// Keep this for React Native
import { Router, Scene }      from 'react-native-router-flux';

import {
  StyleSheet,
  DeviceEventEmitter } from 'react-native';

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

    return (
      <Router>
        <Scene key="root">

          <Scene key="thatContainer" component={ThatContainer} title="That"
            store={this.props.store}
          />

        </Scene>
      </Router>
    )
  }
}

