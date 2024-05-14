import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import index from './layouts/ServiceContainer';
import { AUTH_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH, RDRG_ABSOLUTE_PATH } from './constants';
import Authentication from './views/Authentication';
import RdrgContainer from './layouts/ServiceContainer';
import Home from './views/Home';

function App() {
  return(
    <Routes>
      <Route path={RDRG_ABSOLUTE_PATH} element = {<RdrgContainer/>} >
        <Route path={HOME_ABSOLUTE_PATH} element = {<Home />} />
        <Route path={AUTH_ABSOLUTE_PATH} element = {<Authentication/>} />
      </Route>
    </Routes>
  )
}

export default App;
