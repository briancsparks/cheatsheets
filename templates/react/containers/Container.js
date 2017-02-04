
//import _                                from 'underscore';
//import React, { Component }             from 'react';
import { connect }                      from 'react-redux';
import ThatComponent                    from '../components/Component.js';


const mapStateToProps = (state) => {
  console.log('ThatContainer.mapStateToProps');

  return {
    noun: state.noun
  }
}

//const mapDispatchToProps = (dispatch) => { }

const ThatContainer = connect(
  mapStateToProps
)(ThatComponent);

export default ThatContainer;

