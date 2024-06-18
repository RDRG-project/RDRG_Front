import React, { useEffect, useState } from 'react'
import './style.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { MYPAGE_PROFILE_ABSOLUTE_PATH, MYPAGE_RENT_DETAIL_ABSOLUTE_PATH } from 'src/constants';
import { useUserStore } from 'src/stores';

//                    type                    //
type Path = '프로필 관리' | '대여 내역' | '';

//                    interface                    //
interface Props {
    path: Path;
}

//                    component                    //
function SideNavigation({ path }: Props) {

    //                    state                    //
    const profileClass = `mypage-navigation-item${path === '프로필 관리' ? ' active' : ''}`
    const rentDetailClass = `mypage-navigation-item${path === '대여 내역' ? ' active' : ''}`
    const { loginUserRole } = useUserStore();

    //                    function                    //
    const navigator = useNavigate();

    //                    event handler                    //
    const onProfileClickHandler = () => { navigator(MYPAGE_PROFILE_ABSOLUTE_PATH) };
    const onRentDetailClickHandler = () => { navigator(MYPAGE_RENT_DETAIL_ABSOLUTE_PATH) };

    //                    render                    //
    if (loginUserRole !== 'ROLE_ADMIN') {
        return (
            <div className="mypage-navigation-container">
                <div className={profileClass} onClick={onProfileClickHandler}>
                    <div className="mypage-navigation-title">프로필 관리</div>
                </div>
                <div className={rentDetailClass} onClick={onRentDetailClickHandler}>
                    <div className="mypage-navigation-title">대여 내역</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="mypage-navigation-container">
                <div className={rentDetailClass} onClick={onRentDetailClickHandler}>
                    <div className="mypage-navigation-title">대여 내역</div>
                </div>
                <div className={profileClass} onClick={onProfileClickHandler}>
                    <div className="mypage-navigation-title">프로필 관리</div>
                </div>
            </div>
        );
    }
}

//                    component                    //
export default function MypageContainer() {

    //                    state                    //
    const { pathname } = useLocation();
    const [path, setPath] = useState<Path>('');
    const { loginUserRole } = useUserStore();

    //                    function                    //
    const navigator = useNavigate();

    //                    effect                    //
    useEffect(() => {
        const path =
            pathname === MYPAGE_PROFILE_ABSOLUTE_PATH ? '프로필 관리' :
                pathname === MYPAGE_RENT_DETAIL_ABSOLUTE_PATH ? '대여 내역' : '';

        setPath(path);
    }, [pathname]);

    useEffect(() => {
        if (pathname === '/rdrg/mypage') {
            if (loginUserRole === 'ROLE_ADMIN') {
                navigator(MYPAGE_RENT_DETAIL_ABSOLUTE_PATH);
            } else {
                navigator(MYPAGE_PROFILE_ABSOLUTE_PATH);
            }
        }
    }, [loginUserRole, pathname, navigator]);

    //                    render                    //
    return (
        <div id="mypage-wrapper">
            {loginUserRole === 'ROLE_ADMIN' ?
                <div className='mypage-image'>회원 관리</div> :
                <div className='mypage-image'>마이페이지</div>
            }
            <SideNavigation path={path} />
            <div className="mypage-main-container">
                <Outlet />
            </div>
        </div>
    )
}
