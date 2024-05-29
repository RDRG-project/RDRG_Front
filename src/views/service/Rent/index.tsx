import React, { useEffect, useState } from 'react'
import './style.css'
import RentSiteSelectBox from 'src/components/Selectbox/RentSiteSelectBox'
import { useCookies } from 'react-cookie';
import ReturnSiteSelectBox from 'src/components/Selectbox/ReturnSiteSelectBox';
import RentSelectBox from 'src/components/Selectbox/RentItemSelectBox';
import { useBasketStore, useBatteryStore, useNoteBookStore, useRentDateStore, useRentItemStore, useRentListStore, useRentSiteStore, useRentStatusStore, useReturnSiteStore, useSiteShowStore, useTabletStore, useTotalRentTimeStore, useUserStore } from 'src/stores/index';
import ReactDatePicker from 'src/components/DateTimebox';
import { HOME_ABSOLUTE_PATH } from 'src/constants';
import { useNavigate } from 'react-router';
import { postPaymentSaveRequest } from 'src/apis/payment';
import { PostPaymentSaveRequestDto } from 'src/apis/payment/dto/request';
import ResponseDto from 'src/apis/response.dto';
import { dateFormat, dateTimeFormat } from 'src/utils';
import useGameItStore from 'src/stores/gameIt.store';
import { differenceInHours } from 'date-fns';

//                    component                    //
function Basket() {
    const { startDate, endDate, setStartDate, setEndDate } = useRentDateStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const { setShow } = useSiteShowStore();
    const [rentDuration, setRentDuration] = useState<{ days: number; hours: number }>({ days: 0, hours: 0 });

    const calculateRentDuration = (startDate: Date, endDate: Date) => {
        const durationInHours = differenceInHours(endDate, startDate);
        const durationInDays = Math.ceil(durationInHours / 24);
        return { days: durationInDays, hours: durationInHours % 24 };
    };

    const calculateItemPrice = (basePrice: number, startDate: Date | null, endDate: Date | null): number => {
        if (!startDate || !endDate) return 0;
        const rentalHours = differenceInHours(endDate, startDate);
        return basePrice * rentalHours;
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        basketItems.forEach(item => {
            totalPrice += calculateItemPrice(item.price, startDate, endDate);
        });
        return totalPrice;
    };

    const removeItemButtonClickHandler = (index: number) => {
        const itemToRemove = basketItems[index];
        setBasketItems(basketItems.filter((_, i) => i !== index));
        setTotalAmount(totalAmount - itemToRemove.price);
    };

    const clearButtonClickHandler = () => {
        setShow(false);
        setStartDate(new Date());
        setEndDate(new Date());
        setBasketItems([]);
        setTotalAmount(0);
        setRentDuration({ days: 0, hours: 0 });
    };

    useEffect(() => {
        if (startDate && endDate) {
            const duration = calculateRentDuration(startDate, endDate);
            setRentDuration(duration);
            setTotalAmount(calculateTotalPrice());
        }
    }, [startDate, endDate, basketItems]);

    return (
        <div className='selected-type-wrapper'>
            <div className='basket-items'>
                {basketItems.map((item, index) => (
                    <div key={index} className='basket-item'>
                        {item.name}: {calculateItemPrice(item.price, startDate, endDate).toLocaleString()}원               
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

function Payment() {

    const [cookies] = useCookies();

    const { loginUserId } = useUserStore();
    const { rentSite, setRentSite } = useRentSiteStore();
    const { returnSite, setReturnSite } = useReturnSiteStore();
    const { setShow } = useSiteShowStore();
    const { startDate, endDate, setStartDate, setEndDate } = useRentDateStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();
    const { rentStatus, setRentStatus } = useRentStatusStore();
    const navigate = useNavigate();

    const PostPaymentSaveResponseDto = (result: ResponseDto | null) => {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '유효성 실패입니다.' :
            result.code === 'AF' ? '로그인 후 결제를 진행해주세요.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        navigate(HOME_ABSOLUTE_PATH);
    }

    const onPaymentButtonClickHandler = () => {
        const rentSerialNumber = basketItems.map(item => item.serialNumber);

        if (!startDate || !endDate) return;

        const requestBody: PostPaymentSaveRequestDto = {
            rentUserId: loginUserId, 
            rentSerialNumber,
            rentPlace: rentSite, 
            rentReturnPlace: returnSite, 
            rentDatetime: dateTimeFormat(startDate), 
            rentReturnDatetime: dateTimeFormat(endDate),
            rentTotalPrice: totalAmount,
            rentStatus
        };

        setRentSite('');
        setReturnSite('');
        setRentStatus(true);
        setBasketItems([]);
        setTotalAmount(0);
        setStartDate(new Date());
        setEndDate(new Date());
        setShow(false);
        
        if (!cookies.accessToken) return;
        postPaymentSaveRequest(requestBody, cookies.accessToken).then(PostPaymentSaveResponseDto);
    };

    return (
        <div>
            <button className="payment-button" onClick={onPaymentButtonClickHandler}>결제하기</button>
        </div>
    );
}

//                    component                    //
export default function Rent() {
    const [rentSelect, setRentSelect] = useState<string>('');
    const [returnSelect, setReturnSelect] = useState<string>('');
    const [rentItem, setRentItem] = useState<string>('');

    const onRentChangeHandler = (rentSelect: string) => {
        setRentSelect(rentSelect);
    };
    const onReturnChangeHandler = (returnSelect: string) => {
        setReturnSelect(returnSelect);
    };
    const onRentItemChangeHandler = (rentItem: string) => {
        setRentItem(rentItem);
    };

    return (
        <div id='rent-wrapper'>
            <div className='rent-left-side'>
                <div className='rent-left-side-site'>
                    <RentSiteSelectBox value={rentSelect} onChange={onRentChangeHandler} />
                </div>
                <div className='rent-left-side-site'>
                    <ReturnSiteSelectBox value={returnSelect} onChange={onReturnChangeHandler} />
                </div>
                <div className='rent-left-side-date'>
                    <ReactDatePicker />
                </div>
            </div>
            <div className='rent-item'>
                <RentSelectBox value={rentItem} onChange={onRentItemChangeHandler} />
            </div>
            <div className='rent-right-side'>
                <div className='rent-right-side-top-basket'>장바구니</div>
                <div className='rent-right-side-basket'>
                    <Basket />
                </div>
                <div className='rent-right-side-payment'>
                    <Payment />
                </div>
            </div>
        </div>
    );
}