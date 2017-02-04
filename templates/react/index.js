
import React                            from 'react';
import ReactDOM                         from 'react-dom';
import { Provider }                     from 'react-redux';
import './index.css';

import configureStore                   from './configureStore';
import IndexComponent                   from './containers/IndexComponent';

var store     = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <IndexComponent store={store} />
      </Provider>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);

