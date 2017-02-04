
import { createStore, applyMiddleware }   from 'redux'
import thunk                              from 'redux-thunk';
import createLogger                       from 'redux-logger'
import rootReducer                        from './reducers'

const veryVerbose = false;

console.log("configureStore.js loading");

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
  if (veryVerbose) {
    middleware.push(createLogger())
  }
}

export default function configureStore(preloadedState = {}) {
  var store;
  store = createStore(rootReducer, preloadedState, applyMiddleware(...middleware));

  // React Native hot-reloading
  if (module.hot) {
    console.log("configureStore.js re-loading");
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers/reducers', () => {
      const nextRootReducer = require('./reducers/reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}


