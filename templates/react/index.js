
import React                            from 'react';
import { Grid, Navbar }                 from 'react-bootstrap';
import { Provider }                     from 'react-redux';

import configureStore                   from './configureStore';
import IndexComponent                   from './containers/IndexComponent';

var store     = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <IndexComponent store={store} />
      </Provider>
    );
  }
}


