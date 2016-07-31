import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {applyMiddleware, createStore, combineReducers, compose} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import './app.css';
import * as components from './components';
import * as reducers from './reducers';


const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
});

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={components.PairList} />
      <Route path="/pairs/:pk" component={components.PairDetail} />
    </Router>
  </Provider>,
  document.getElementById('seimur-app')
);
