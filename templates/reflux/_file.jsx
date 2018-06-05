
/**
 *  Foo component implementation file.
 */

import React                  from 'react';
import Reflux                 from 'reflux';
import {
  Glyphicon
}                             from 'react-bootstrap';
import BarStore               from '../Stores/BarStore';
import {
  Actions
}                             from '../Actions/Actions';

import '../short.css';

const sg                      = require('sgsg/lite');
const deref                   = sg.deref;

/**
 *  The Foo class blah...
 */
export class Foo extends Reflux.Component {

  /**
   *  c-tor
   */
  constructor(props) {
    super(props);

    // You can set initial state
    this.state = {};

    // In Reflux, you 'attach' to a store
    this.store = BarStore;
  }

  /**
   *  Renders the DOM for this component
   */
  render() {
    return (
        <div />
    );
  }


//  componentDidMount() {
//    // From the docs:
//    // - This is a good place to initiate network requests for data
//    // - This is a good place to setup subscriptions (like maybe setInterval?)
//    //   But then unsubscribe in componentWillUnmount()
//    // - You can call this.setState(), which will trigger an extra render call (but will not update the page).
//    //   Usually, you do not want to do this, but this might be the only option, and it is safe to do.
//  }
//
//  componentWillUnmount() {
//    // This is effectively a destructor. Clean up.
//  }
//
//
//  // ------------- usually not needed ----------
//
//  componentDidUpdate(prevProps, prevState /*, snapshot */) {
//    // Invoked immediately after update occurs (not called after initial render).
//    // Used to:
//    // - Manually tweak DOM after a render (be very wary of doing this).
//    // - Start network requests.
//    //
//    // See docs for getSnapshotBeforeUpdate() for the snapshot param
//  }
//
//  shouldComponentUpdate(nextProps, nextState) {
//    // Hint to react that a re-render can be skipped. The docs discourage use, as the default `do render only when
//    // state has changed` should be better.
//
//    // TODO: compare this.props and nextProps; this.state and nextState; and then return false to tell React that
//    // the update can be skipped
//  }
//
//
//
//
//
//  // ------------- obsolete-ish ----------
//
//  // Generally, do not do this
//  // Used to convert props (passed in from parent) into our state. This seems like a thing to do during
//  // the constructor, but then our state would not update as the parent passed-in props changed. However,
//  // using this function allows us to do so. However, it is called on every render. The docs say that
//  // UNSAFE_componentWillReceiveProps is a better choice to use.
//  static getDerivedStateFromProps(props, state) {
//
//    // TODO: return the new state, or null to mean no changes.
//  }
//
//  // Generally, do not do this
//  // The note above (for getDerivedStateFromProps) applies to this function.
//  UNSAFE_componentWillReceiveProps(nextProps) {
//    // Generally, you compare this.props and nextProps, and then optionally, use this.setState()
//  }


}

