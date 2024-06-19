import React from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom';
import { HOME_ABSOLUTE_PATH } from 'src/constants';

//                    component                    //
export default function NotFound() {

    //                    function                    //
    const navigator = useNavigate();

    //                    event handler                    //
    const onHomeButtonClickHandler = () => navigator(HOME_ABSOLUTE_PATH);

    //                    render                    //
    return (
        <div className="not-found-container">
            <div className="company-name">
                <div className="company-icon"></div>
                <div>RDRG</div>
            </div>
                <div className="not-found-content">
                <h1 className="not-found-title">404 Not Found</h1>
                <p className="not-found-text">죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
                <p className="not-found-text">존재하지 않는 주소를 입력하셨거나, 요청하신 페이지의 주소가 변경, 삭제되어 페이지를 찾을 수 없습니다.</p>
                <div className="button-container">
                <button className="btn btn-home" onClick={onHomeButtonClickHandler}>홈으로 가기</button>
                </div>
            </div>
        </div>
    );
};