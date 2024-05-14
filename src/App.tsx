import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH, RDRG_ABSOLUTE_PATH } from './constants';
import Authentication from './views/Authentication';
import RdrgContainer from './layouts/HomeContainer';
import Home from './views/Home';

// component : root 경로 컴포넌트 //
function Index() {

  //                    function                    //
  const navigator =useNavigate();

  //                    effect                    //
  useEffect(() => {
    navigator(HOME_ABSOLUTE_PATH);
  }, []);

  //                    render                    //
  return <></>;
}

function App() {
  return(
    <Routes>
      <Route index element = {<Index />} />
      <Route path={RDRG_ABSOLUTE_PATH} element = {<RdrgContainer/>} >
        <Route path={HOME_ABSOLUTE_PATH} element = {<Home />} />
        <Route path={AUTH_ABSOLUTE_PATH} element = {<Authentication/>} />
      </Route>
    </Routes>
  )
}

export default App;
