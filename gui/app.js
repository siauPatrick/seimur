import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {applyMiddleware, createStore, combineReducers, compose} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import App from 'gui/components/App/App';
import PairList from 'gui/components/PairList/PairList';
import PairDetail from 'gui/components/PairDetail/PairDetail';
import * as reducers from 'gui/reducers';
require.context('./components/', true, /\.scss$/);


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
      <Route path="/" component={App}>
        <IndexRedirect to="/pairs"/>
        <Route path="/pairs" component={PairList}/>
        <Route path="/pairs/:id" component={PairDetail}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('seimur-app')
);
