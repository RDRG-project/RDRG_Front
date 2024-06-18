import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router';
import { AUTH_PATH, CUSTOMER_SUPPORT_DETAIL_PATH, CUSTOMER_SUPPORT_PATH, CUSTOMER_SUPPORT_UPDATE_PATH, CUSTOMER_SUPPORT_WRITE_PATH, HOME_ABSOLUTE_PATH, HOME_CLAUSE_PATH, HOME_COMPANY_PATH, HOME_PATH, HOME_PLACE_PATH, HOME_POLICY_PATH, MYPAGE_DETAILS_PATH, MYPAGE_PATH, MYPAGE_PROFILE_PATH, MYPAGE_RENT_DETAIL_PATH, MYPAGE_UNREGISTER_PATH, RDRG_PATH, RENT_ADD_PATH, RENT_CANCEL_PATH, RENT_FAIL_PATH, RENT_PATH, RENT_SUCCESS_PATH } from './constants';
import Home from './views/Home';
import CustomerSupportList from './views/service/CustomerSupport/CustomerSupportList';
import MypageProfile from './views/service/MyPage/MyPageProfile';
import SupportWrite from './views/service/CustomerSupport/CustomerSupportWrite';
import SupportDetail from './views/service/CustomerSupport/CustomerSupportDetail';
import SupportUpdate from './views/service/CustomerSupport/CustomerSupportUpdate';
import MypageUnRegister from './views/service/MyPage/MyPageUnRegister';
import MypageContainer from './layouts/MypageContainer';
import Rent from './views/service/Rent';
import CompanyIntroduction from './views/Home/FootBarMenu/1.CompanyIntroduction';
import TermsAndConditions from './views/Home/FootBarMenu/2.TermsAndConditions';
import PersonalInformationProcessingPolicy from './views/Home/FootBarMenu/3.PersonalInformationProcessingPolicy';
import BranchInformation from './views/Home/FootBarMenu/4.BranchInformation';
import Authentication from './views/Authentication';
import MypageRentList from './views/service/MyPage/MyPageRentList';
import MypageRentDetail from './views/service/MyPage/MyPageRentDetail';
import RentSuccess from './views/service/Rent/RentSuccess';
import RentFailed from './views/service/Rent/RentFailed';
import { RentAdd } from './views/service/Rent/RentAdd';
import HomeContainer from './layouts/HomeContainer';
import RentCancel from './views/service/Rent/RentCancel';

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
        <Route path={RDRG_PATH} element = {<HomeContainer/>} >
            <Route path={HOME_PATH} element = {<Home />} />
                <Route path={HOME_COMPANY_PATH} element = {<CompanyIntroduction />} />
                <Route path={HOME_CLAUSE_PATH} element = {<TermsAndConditions />} />
                <Route path={HOME_POLICY_PATH} element = {<PersonalInformationProcessingPolicy />} />
                <Route path={HOME_PLACE_PATH} element = {<BranchInformation />} />
            <Route path={AUTH_PATH} element = {<Authentication/>} />
            <Route path={CUSTOMER_SUPPORT_PATH} >
                <Route index element={< CustomerSupportList/>} />
                <Route path={CUSTOMER_SUPPORT_WRITE_PATH} element={<SupportWrite/>}/>
                <Route path={CUSTOMER_SUPPORT_DETAIL_PATH} element={<SupportDetail/>} />
                <Route path={CUSTOMER_SUPPORT_UPDATE_PATH} element={<SupportUpdate/>} />
            </Route>
            <Route path={RENT_PATH} >
                <Route index element={<Rent/>}/>
                <Route path={RENT_ADD_PATH} element={<RentAdd/>}/>
            </Route>
            <Route path={RENT_SUCCESS_PATH} element={<RentSuccess />} />
            <Route path={RENT_FAIL_PATH} element={<RentFailed/>} />
            <Route path={RENT_CANCEL_PATH} element={<RentCancel />} />
            <Route path={MYPAGE_PATH} element={<MypageContainer/>}>
                <Route path={MYPAGE_PROFILE_PATH} element={<MypageProfile />}/>
                <Route path={MYPAGE_UNREGISTER_PATH} element={<MypageUnRegister />}/>
                <Route path={MYPAGE_RENT_DETAIL_PATH}>
                    <Route index element={<MypageRentList />} />
                    <Route path={MYPAGE_DETAILS_PATH} element={<MypageRentDetail />}/>
                </Route>
            </Route>
        </Route>
    </Routes>
    );
}

export default App;
