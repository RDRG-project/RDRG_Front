import React from 'react'
import "./style.css";

export default function MypageRentDetail() {

    return (
        <div id='mypage-rent-detail-wrapper'>
            <div className='rent-detail-title'>이용내역</div>
            <div className='rent-detail-view'>
                <div className='rent-detail-status'>대여 중 / 반납 완료</div>
                <div className='rent-detail-view-2'>
                    <div className='rent-detail-image'>이미지 IMG</div>
                    <div className='rent-detail-view-3'>
                        <div className='rent-detail-name'>노트북 : Apple MacBook</div>
                        <div className='rent-detail-date'>24.01.01.00:00 ~ 24.01.03.13:00</div>
                    </div>
                    <div className='rent-detail-view-4'>
                        <div>대여 : 서울역</div>
                        <div>반납 : 부산역</div>
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