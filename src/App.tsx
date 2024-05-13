import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import index from './layouts/ServiceContainer';
import { AUTH_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH } from './constants';
import HomeContainer from './layouts/ServiceContainer';
import Authentication from './views/Authentication';

function App() {
  return(
    <Routes>
      <Route path={HOME_ABSOLUTE_PATH} element = {<HomeContainer/>} />
      <Route path={AUTH_ABSOLUTE_PATH} element = {<Authentication/>} />
    </Routes>
  )
}

export default App;
