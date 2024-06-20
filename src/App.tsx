import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router';

import Authentication, { Sns } from './views/Authentication';

import Home from './views/Home';
import HomeContainer from './layouts/HomeContainer';
import CompanyIntroduction from './views/Home/FootBarMenu/1.CompanyIntroduction';
import TermsAndConditions from './views/Home/FootBarMenu/2.TermsAndConditions';
import PersonalInformationProcessingPolicy from './views/Home/FootBarMenu/3.PersonalInformationProcessingPolicy';
import BranchInformation from './views/Home/FootBarMenu/4.BranchInformation';

import NotFound from './views/NotFound';

import SupportDetail from './views/service/CustomerSupport/CustomerSupportDetail';
import CustomerSupportList from './views/service/CustomerSupport/CustomerSupportList';
import SupportUpdate from './views/service/CustomerSupport/CustomerSupportUpdate';
import SupportWrite from './views/service/CustomerSupport/CustomerSupportWrite';

import MypageContainer from './layouts/MypageContainer';
import MypageProfile from './views/service/MyPage/MyPageProfile';
import MypageRentDetail from './views/service/MyPage/MyPageRentDetail';
import MypageRentList from './views/service/MyPage/MyPageRentList';
import MypageUnRegister from './views/service/MyPage/MyPageUnRegister';

import Rent from './views/service/Rent';
import { RentAdd } from './views/service/Rent/RentAdd';
import RentCancel from './views/service/Rent/RentCancel';
import RentFailed from './views/service/Rent/RentFailed';
import RentSuccess from './views/service/Rent/RentSuccess';

import { 
    HOME_ABSOLUTE_PATH,
    RDRG_PATH, AUTH_PATH, SNS_PATH, HOME_PATH, HOME_CLAUSE_PATH, HOME_COMPANY_PATH,  HOME_PLACE_PATH, HOME_POLICY_PATH, 
    CUSTOMER_SUPPORT_PATH, CUSTOMER_SUPPORT_WRITE_PATH, CUSTOMER_SUPPORT_DETAIL_PATH, CUSTOMER_SUPPORT_UPDATE_PATH, 
    MYPAGE_PATH, MYPAGE_PROFILE_PATH, MYPAGE_UNREGISTER_PATH, MYPAGE_RENT_DETAIL_PATH, MYPAGE_DETAILS_PATH, 
    RENT_PATH, RENT_ADD_PATH, RENT_SUCCESS_PATH, RENT_FAIL_PATH, RENT_CANCEL_PATH
} from './constants';

import './App.css';

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
};

//                    component                    //
function App() {

    //                    render                    //
    return(
    <Routes>
        <Route index element = {<Index />} />
        <Route path={SNS_PATH} element={<Sns/>} />
        <Route path={RDRG_PATH} element = {<HomeContainer/>} >
            <Route path={HOME_PATH}>
                <Route index element={<Home />}/>
                <Route path={HOME_COMPANY_PATH} element = {<CompanyIntroduction />} />
                <Route path={HOME_CLAUSE_PATH} element = {<TermsAndConditions />} />
                <Route path={HOME_POLICY_PATH} element = {<PersonalInformationProcessingPolicy />} />
                <Route path={HOME_PLACE_PATH} element = {<BranchInformation />} />
            </Route>
            <Route path={AUTH_PATH} element = {<Authentication/>} />
            <Route path={CUSTOMER_SUPPORT_PATH} >
                <Route index element={< CustomerSupportList/>} />
                <Route path={CUSTOMER_SUPPORT_WRITE_PATH} element={<SupportWrite/>}/>
                <Route path={CUSTOMER_SUPPORT_DETAIL_PATH} element={<SupportDetail/>} />
                <Route path={CUSTOMER_SUPPORT_UPDATE_PATH} element={<SupportUpdate/>} />
            </Route>
            <Route path={MYPAGE_PATH} element={<MypageContainer/>}>
                <Route path={MYPAGE_PROFILE_PATH} element={<MypageProfile />}/>
                <Route path={MYPAGE_UNREGISTER_PATH} element={<MypageUnRegister />}/>
                <Route path={MYPAGE_RENT_DETAIL_PATH}>
                    <Route index element={<MypageRentList />} />
                    <Route path={MYPAGE_DETAILS_PATH} element={<MypageRentDetail />}/>
                </Route>
            </Route>
            <Route path={RENT_PATH} >
                <Route index element={<Rent/>}/>
                <Route path={RENT_ADD_PATH} element={<RentAdd/>}/>
            </Route>
            <Route path={RENT_SUCCESS_PATH} element={<RentSuccess />} />
            <Route path={RENT_FAIL_PATH} element={<RentFailed/>} />
            <Route path={RENT_CANCEL_PATH} element={<RentCancel />} />
        </Route>
        <Route path="*" element={<NotFound />}/>
    </Routes>
    );
};

export default App;