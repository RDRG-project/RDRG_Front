import React, { useState } from 'react'
import './style.css'
import RentSiteSelectBox from 'src/components/Selectbox/RentSiteSelectBox'
import { useCookies } from 'react-cookie';

//                    component                    //
export default function Rent() {

    //                    state                    //
    const [cookies] = useCookies();
    const [rentSelect, setRentSelect] = useState<string>('');


    //                    event handler                    //
    const onRentChangeHandler = (rentSelect: string) => {
        setRentSelect(rentSelect);
    };

    

    //                    render                    //
    return (
        <div id='rent-wrapper'>
            <div className='rent-left-side'>
                <div className='rent-left-side-rental'>대여지점</div>
                    <RentSiteSelectBox value={rentSelect} onChange={onRentChangeHandler} />
                <div className='rent-left-side-return'>반납지점</div>
                <div className='rent-left-side-date'>날짜 및 시간</div>
            </div>
            <div className='rent-item'>기기 선택</div>
            <div className='rent-right-side'>
                <div className='rent-right-side-basket'>장바구니</div>
                <div className='rent-right-sid-payment'>결제</div>
            </div>
        </div>
    );
}