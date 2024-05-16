import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, CUSTOMER_SUPPORT_DETAIL_PATH, CUSTOMER_SUPPORT_PATH, CUSTOMER_SUPPORT_UPDATE_PATH, CUSTOMER_SUPPORT_WRITE_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH, MYPAGE_PROFILE_ABSOLUTE_PATH, RDRG_ABSOLUTE_PATH, SIGN_UP_ABSOLUTE_PATH } from './constants';
import Authentication, { SignUp } from './views/Authentication';
import RdrgContainer from './layouts/HomeContainer';
import Home from './views/Home';
import CustomerSupportList from './views/service/CustomerSupport/CustomerSupportList';
import MypageProfile from './views/service/MyPage/MyPageProfile';
import SupportWrite from './views/service/CustomerSupport/CustomerSupportWrite';
import SupportDetail from './views/service/CustomerSupport/CustomerSupportDetail';
import SupportUpdate from './views/service/CustomerSupport/CustomerSupportUpdate';

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
                throw new Error('Function not implemented.');} }/>} />
            <Route path={CUSTOMER_SUPPORT_PATH} >
                <Route index element={< CustomerSupportList/>} />
                <Route path={CUSTOMER_SUPPORT_WRITE_ABSOLUTE_PATH} element={<SupportWrite/>}/>
                <Route path={CUSTOMER_SUPPORT_DETAIL_PATH} element={<SupportDetail/>} />
                <Route path={CUSTOMER_SUPPORT_UPDATE_PATH} element={<SupportUpdate/>} />
            </Route>
            <Route path={MYPAGE_PROFILE_ABSOLUTE_PATH} element={<MypageProfile />}/>
        </Route>
    </Routes>
    );
}

export default App;
