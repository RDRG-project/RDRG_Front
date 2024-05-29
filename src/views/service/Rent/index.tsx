import React, { useEffect, useState } from 'react'
import './style.css'
import RentSiteSelectBox from 'src/components/Selectbox/RentSiteSelectBox'
import { useCookies } from 'react-cookie';
import ReturnSiteSelectBox from 'src/components/Selectbox/ReturnSiteSelectBox';
import RentSelectBox from 'src/components/Selectbox/RentItemSelectBox';
import { useBasketStore, useRentDateStore, useRentItemStore, useRentSiteStore, useReturnSiteStore, useUserStore } from 'src/stores/index';
import ReactDatePicker from 'src/components/DateTimebox';
import { HOME_ABSOLUTE_PATH } from 'src/constants';
import { useNavigate } from 'react-router';
import { postPaymentSaveRequest } from 'src/apis/payment';
import { PostPaymentSaveRequestDto } from 'src/apis/payment/dto/request';
import ResponseDto from 'src/apis/response.dto';
import { dateFormat, dateTimeFormat } from 'src/utils';

//                    component                    //
function Basket() {

    //                    state                    //
    const { rentSite, setRentSite } = useRentSiteStore();
    const { returnSite, setReturnSite } = useReturnSiteStore(); 

    const { startDate, setStartDate, endDate, setEndDate } = useRentDateStore();

    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();

    //                    event handler                    //
    const removeItemButtonClickHandler = (index: number) => {
        const itemToRemove = basketItems[index];
        setBasketItems(basketItems.filter((_, i) => i !== index));
        setTotalAmount(totalAmount - itemToRemove.price);
    };

    const clearButtonClickHandler = () => {
        setRentSite('');
        setReturnSite('');
        setStartDate(new Date());
        setEndDate(new Date());

        setBasketItems([]);
        setTotalAmount(0);
    };

    //                    effect                    //
    // useEffect(() => {
    //     setStartDate(startDate);
    // }, [startDate])

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
function Payment() {

    //                    state                    //
    const [cookies] = useCookies();
    const { loginUserId } = useUserStore();
    const { rentSite } = useRentSiteStore();
    const { returnSite } = useReturnSiteStore(); 
    const { startDate, endDate } = useRentDateStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();
    const [ rentStatus, setRentStatus ] = useState<boolean>(false);

    //                    function                    //
    const navigator = useNavigate();

    const PostPaymentSaveResponseDto = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '유효성실패라는데 뭐가 문제일까요?' :
            result.code === 'AF' ? '로그인하고 결제를 진행해주세요' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        navigator(HOME_ABSOLUTE_PATH);
    }

    //                    event handler                    //
    const onPaymentButtonClickHandler = () => {
        const rentSerialNumber = basketItems.map(item => item.serialNumber);

        if (!startDate || !endDate) return;

        const requestBody: PostPaymentSaveRequestDto = {
            rentUserId: loginUserId, 
            rentSerialNumber: rentSerialNumber,
            rentPlace: rentSite, 
            rentReturnPlace: returnSite, 
            rentDatetime: dateTimeFormat(startDate), 
            rentReturnDatetime: dateTimeFormat(endDate),
            rentTotalPrice : totalAmount,
            rentStatus: rentStatus
            }
        if (!cookies.accessToken) return;
        postPaymentSaveRequest(requestBody, cookies.accessToken).then(PostPaymentSaveResponseDto);
    };

    //                    effect                    //
    useEffect(() => {
        
    }, []);

    //                    render                    //
    return (
        <div>
            <button onClick={onPaymentButtonClickHandler}>결제하기</button>
        </div>
    )
}

//                    component                    //
export default function Rent() {
    const navigator = useNavigate();

    //                    state                    //
    const [cookies] = useCookies();
    const [rentSelect, setRentSelect] = useState<string>('');
    const [returnSelect, setReturnSelect] = useState<string>('');
    const [rentItem, setRentItem] = useState<string>('');

    // const {startDate, setStartDate, endDate, setEndDate} = useRentDateStore();

    //                    event handler                    //
    const onRentChangeHandler = (rentSelect: string) => {
        setRentSelect(rentSelect);
    };
    const onReturnChangeHandler = (returnSelect: string) => {
        setReturnSelect(returnSelect);
    };

    const onRentItemChangeHandler = (rentItem: string) => {
        setRentItem(rentItem);
    }

    //                    effect                    //
    

    
    //                    render                    //
    return (
        <div id='rent-wrapper'>
            <div className='rent-left-side'>
                <div className='rent-left-side-rental'>
                    <RentSiteSelectBox value={rentSelect} onChange={onRentChangeHandler}/>
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
                <div className='rent-right-side-payment'>
                    <div className='rent-right-side-payment-box'>
                        <Payment/>
                        {/* <RentCheckout/> */}
                    </div>
                </div>
            </div>
        </div>
    );
}