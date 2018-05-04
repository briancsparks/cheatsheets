
import _                      from 'underscore';
import React                  from 'react';

import ThatContainer          from './containers/Container';
import * as Actions           from '../actions/actions';

import './App.css';
//import 'bootstrap/dist/css/bootstrap.css';
import './short.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

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

