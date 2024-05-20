import React from 'react'
import "./style.css";

export default function MypageRentDetail() {

    return (
        <div id='mypage-rent-detail-wrapper'>
            <div className='rent-detail-title'>이용내역</div>
            <div className='rent-detail-view'>
                <div className='rent-detail-status'>대여 중 / 반납 완료</div>
                <div className='rent-detail-view-in'>
                    <div className='rent-detail-image'></div>
                    <div className='rent-detail-view-3'>
                        <div className='rent-detail-name'><ul><li>노트북 : Apple MacBook</li></ul></div>
                        <div className='rent-detail-date'><ul><li>24.01.01.00:00 ~ 24.01.03.13:00</li></ul></div>
                    </div>
                    <div className='rent-detail-view-4'>
                        <div><ul><span className='box'>대여</span> : 서울역</ul></div>
                        <div><ul><span className='box'>반납</span> : 부산역</ul></div>
                    </div>
                </div>               
            </div>
        </div>
    )

    function MypageRentDetailText () {
    
    return (
        <div>상세정보</div>
    )
}

}