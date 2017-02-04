/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React                            from 'react';
import { AppRegistry }                  from 'react-native';
import { Provider }                     from 'react-redux';

import configureStore                   from './configureStore';
import IndexComponent                   from './containers/IndexComponent';

var store     = configureStore();

export default class App extends React.Component {
	render() {
		return (
      <Provider store={store} >
        <IndexComponent store={store} />
      </Provider>
		);
	}
}

AppRegistry.registerComponent('App', () => App);



