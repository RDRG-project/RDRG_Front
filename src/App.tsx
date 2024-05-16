import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, CUSTOMER_SUPPORT_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH, MYPAGE_PROFILE_ABSOLUTE_PATH, MYPAGE_UNREGISTER_ABSOLUTE_PATH, RDRG_ABSOLUTE_PATH, SIGN_UP_ABSOLUTE_PATH } from './constants';
import Authentication, { SignUp } from './views/Authentication';
import RdrgContainer from './layouts/HomeContainer';
import Home from './views/Home';
import CustomerSupportList from './views/service/CustomerSupport/CustomerSupportList';
import MypageProfile from './views/service/MyPage/MyPageProfile';
import MypageUnRegister from './views/service/MyPage/MyPageUnRegister';

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
            <Route path={SIGN_UP_ABSOLUTE_PATH} element = {<SignUp onLinkClickHandler={function (): void {
                throw new Error('Function not implemented.');
            } }/>} />
            <Route path={CUSTOMER_SUPPORT_ABSOLUTE_PATH} element={<CustomerSupportList/>} />
            <Route path={MYPAGE_PROFILE_ABSOLUTE_PATH} element={<MypageProfile />}/>
            <Route path={MYPAGE_UNREGISTER_ABSOLUTE_PATH} element={<MypageUnRegister />}/>
        </Route>
    </Routes>
  )
}

export default App;
