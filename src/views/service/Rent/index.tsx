import React, { useState } from 'react'
import './style.css'
import RentSiteSelectBox from 'src/components/Selectbox/RentSiteSelectBox'
import { useCookies } from 'react-cookie';
import ReturnSiteSelectBox from 'src/components/Selectbox/ReturnSiteSelectBox';
import RentSelectBox from 'src/components/Selectbox/RentItemSelectBox';
import BasketBox from 'src/components/basketbox';

//                    component                    //
export default function Rent() {

    //                    state                    //
    const [cookies] = useCookies();
    const [rentSelect, setRentSelect] = useState<string>('');
    const [returnSelect, setReturnSelect] = useState<string>('');
    // const [dateSelect, setDateSelect] = useState<string>('');
    const [rentItem, setRentItem] = useState<string>('');


    //                    event handler                    //
    const onRentChangeHandler = (rentSelect: string) => {
        setRentSelect(rentSelect);
    };
    const onReturnChangeHandler = (returnSelect: string) => {
        setReturnSelect(returnSelect);
    };

    // const onDateChangeHandler = (dateSelect: string) => {
    //     setDateSelect(dateSelect);
    // };

    const onRentItemChangeHandler = (rentItem: string) => {
        setRentItem(rentItem);
    }
    

    //                    render                    //
    return (
        <div id='rent-wrapper'>
            <div className='rent-left-side'>
                <div className='rent-left-side-rental'>
                    <RentSiteSelectBox value={rentSelect} onChange={onRentChangeHandler} />
                </div>
                <div className='rent-left-side-return'>
                    <ReturnSiteSelectBox value={returnSelect} onChange={onReturnChangeHandler} />
                </div>
                <div className='rent-left-side-date'>날짜 및 시간</div>
            </div>
            <div className='rent-item'>
                <RentSelectBox value={rentItem} onChange={onRentItemChangeHandler} />
            </div>
            <div className='rent-right-side'>
                <div className='rent-right-side-top-basket'>장바구니</div>
                <div className='rent-right-side-basket'>
                    <div className='rent-right-side-basket-set'>
                        <BasketBox />
                    </div>
                </div>
                <div className='rent-right-sid-payment'>결제</div>
            </div>
        </div>
    );
}