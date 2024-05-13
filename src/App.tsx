import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import index from './layouts/ServiceContainer';
import { AUTH_PATH, HOME_PATH } from './constants';
import HomeContainer from './layouts/ServiceContainer';
import Authentication from './views/Authentication';

function App() {
  return(
    <Routes>
      <Route path={HOME_PATH} element = {<HomeContainer/>} />
      <Route path={AUTH_PATH} element = {<Authentication/>} />
    </Routes>
  )
}

export default App;
