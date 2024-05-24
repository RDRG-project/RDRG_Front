import React, { useState } from 'react'
import './style.css'
import RentSiteSelectBox from 'src/components/Selectbox/RentSiteSelectBox'
import { useCookies } from 'react-cookie';
import ReturnSiteSelectBox from 'src/components/Selectbox/ReturnSiteSelectBox';
import RentSelectBox from 'src/components/Selectbox/RentItemSelectBox';
import { useBasketStore, useRentItemStore } from 'src/stores/index';
import ReactDatePicker from 'src/components/DateTimebox';



//                    component                    //
function Basket() {

    //                    state                    //
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();
    // const [paymentState, setPaymentState] = useState<boolean>(false);
    // const [payment, setPayment] = useState<string>('');
    

    //                    event handler                    //
    const removeItemButtonClickHandler = (index: number) => {
        const itemToRemove = basketItems[index];
        setBasketItems(basketItems.filter((_, i) => i !== index));
        setTotalAmount(totalAmount - itemToRemove.price);
    };

    const clearButtonClickHandler = () => {
        setBasketItems([]);
        setTotalAmount(0);
    };

    // const paymentButtonClickHandler = () => {
    //     if (basketItems !== []) return;
    //     setPaymentState(!paymentState);
    // };

    //                    render                    //
    return (
        <div className='selected-type-wrapper'>
            
            <div className='basket-items'>
                {basketItems.map((item, index) => (
                <div key={index} className='basket-item'>
                {item.name}: {item.price.toLocaleString()}원               
                <button onClick={() => removeItemButtonClickHandler(index)}>Remove</button>
                </div>
                ))}
            </div>
            <div className='payment-box'>
                <div className='payment-top-box'>
                    <div className='payment-count'>총 {basketItems.length}개 품목 선택</div>
                    <div className='payment-basket-delete'>
                        <button onClick={clearButtonClickHandler}>전체 삭제</button>
                    </div>
                </div>
                <div className='payment-bottom-box'>
                <div className='payment-sum'>총 합계금액: {totalAmount.toLocaleString()}원</div>
                </div>
            </div>
        </div>
    );
}

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

    // 날짜 및 시간 클릭에 대한 변경 핸들러
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
                <div className='rent-datetime-container'>
                    <div className='rent-left-side-date'>날짜 및 시간</div>
                    <ReactDatePicker />
                </div>
            </div>
            <div className='rent-item'>
                <RentSelectBox value={rentItem} onChange={onRentItemChangeHandler} />
            </div>
            <div className='rent-right-side'>
                <div className='rent-right-side-top-basket'>장바구니</div>
                <div className='rent-right-side-basket'>
                    <div className='rent-right-side-basket-set'>
                        <Basket />
                    </div>
                </div>
                <div className='rent-right-sid-payment'>
                    <button>결제</button>
                </div>
            </div>
        </div>
    );
}