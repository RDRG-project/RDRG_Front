import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import index from './layouts/ServiceContainer';
import { HOME_PATH } from './constants';
import HomeContainer from './layouts/ServiceContainer';

function App() {
  return(
    <Routes>
      <Route path={HOME_PATH} element = {<HomeContainer/>} />
    </Routes>
  )
}

export default App;
