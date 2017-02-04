
import { combineReducers } from 'redux'

import {
  SET_NOUN
} from '../actions/actions.js'

/**
 *  {
 *    nouns: {},
 *  }
 */

// ----- Nouns -----
function nouns(state = {}, action) {
  switch (action.type) {
    case SET_NOUN:
      return Object.assign({}, state, {
        noun: action.noun
      });

    default:
      return state;
  }
}

