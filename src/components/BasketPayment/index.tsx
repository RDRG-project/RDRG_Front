import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

import { differenceInDays } from "date-fns";

import { useBasketStore, useRentDateStore, useRentListStore, useRentStore, useReturnStore, useUserStore } from "src/stores";

import ResponseDto from "src/apis/response.dto";
import { postPaymentSaveRequest } from "src/apis/payment";
import { PostPaymentSaveRequestDto } from "src/apis/payment/dto/request";
import { PostPaymentResponseDto } from "src/apis/payment/dto/response";

import { HOME_ABSOLUTE_PATH } from "src/constants";
import { dateFormat } from "src/utils";

import './style.css';

//                    component                    //
export default function Basket() {

    //                    state                    //
    const { setRentShow, setRentSelectedItem } = useRentStore();
    const { setReturnShow, setReturnSelectedItem } = useReturnStore();
    const { startDate, setStartDate, endDate, setEndDate } = useRentDateStore();
    const { basketItems, setBasketItems, totalAmount, setTotalAmount } = useBasketStore();

    //                    function                    //
    const calculateItemPrice = (basePrice: number, startDate: Date | null, endDate: Date | null): number => {
        if (!startDate || !endDate) return 0;
        const rentalDays = differenceInDays(endDate, startDate);
        return rentalDays > 1 ? basePrice + ((rentalDays - 1) * 2000) : basePrice;
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        basketItems.forEach(item => {
            totalPrice += calculateItemPrice(item.price, startDate, endDate);
        });
        return totalPrice;
    };

    //                    event handler                    //
    const removeItemButtonClickHandler = (index: number) => {
        const itemToRemove = basketItems[index];
        setBasketItems(basketItems.filter((_, i) => i !== index));
        setTotalAmount(totalAmount - itemToRemove.price);
    };

    const clearButtonClickHandler = () => {
        setRentShow(false);
        setRentSelectedItem('');
        setReturnSelectedItem('');
        setReturnShow(false);
        setStartDate(new Date());
        setEndDate(new Date());
        setBasketItems([]);
        setTotalAmount(0);
    };

    //                    effect                    //
    useEffect(() => {
        if (startDate && endDate) {
            setTotalAmount(calculateTotalPrice());
        }
    }, [startDate, endDate, basketItems]);

    //                    render                    //
    return (
        <div className='selected-type-wrapper'>
            <div className='basket-container'>
                {basketItems.map((item, index) => (
                    <div key={index} className='basket-box'>
                        <div className='basket-item-name'>{item.name + item.model}</div>
                        <div className='basket-item-bottom'>
                            <div className='basket-item-price'>{calculateItemPrice(item.price, startDate, endDate).toLocaleString()}원</div>
                            <button className='basket-item-remove-button' onClick={() => removeItemButtonClickHandler(index)}>X</button>
                        </div>
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
                    <div className='payment-sum-title'>총 합계금액</div>
                    <div className='payment-sum-title'>{totalAmount.toLocaleString()}원</div>
                </div>
            </div>
        </div>
    );
}

//                    component                    //
export function Payment() {

    //                    state                    //
    const [cookies] = useCookies();

    const { loginUserId ,loginUserRole } = useUserStore();
    const { rentStatus, setRentStatus } = useRentListStore();
    const { rentSite, setRentSite, setRentShow } = useRentStore();
    const { returnSite, setReturnSite, setReturnShow } = useReturnStore();
    const { startDate, setStartDate, endDate, setEndDate } = useRentDateStore();
    const { basketItems, setBasketItems, totalAmount, setTotalAmount } = useBasketStore();

    //                    function                    //
    const navigate = useNavigate();

    const PostPaymentSaveResponseDto = (result: PostPaymentResponseDto | ResponseDto | null) => {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '대여장소 및 반납장소, 날짜와 시간, 기기종류를 선택해주세요.' :
            result.code === 'AF' ? '로그인 후 결제를 진행해주세요.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }; 
        
        const { nextRedirectPcUrl } = result as PostPaymentResponseDto;
        window.location.href = nextRedirectPcUrl;
    };

    //                    event handler                    //
    const onPaymentButtonClickHandler = () => {
        if (loginUserRole !== 'ROLE_USER') {
            alert('로그인을 해주세요.');
            navigate(HOME_ABSOLUTE_PATH);
        };

        const rentSerialNumber = basketItems.map(item => item.serialNumber);

        if (!startDate || !endDate) return;

        const requestBody: PostPaymentSaveRequestDto = {
            rentUserId: loginUserId, 
            rentSerialNumber,
            rentPlace: rentSite, 
            rentReturnPlace: returnSite, 
            rentDatetime: dateFormat(startDate), 
            rentReturnDatetime: dateFormat(endDate),
            rentTotalPrice: totalAmount,
            rentStatus
        };

        postPaymentSaveRequest(requestBody, cookies.accessToken)
            .then(result => { 
                PostPaymentSaveResponseDto(result);
                navigate('/rent-success', {state: {basketItems,totalAmount}});
            });

        setRentSite('');
        setReturnSite('');
        setRentStatus('');
        setBasketItems([]);
        setTotalAmount(0);
        setStartDate(new Date());
        setEndDate(new Date());
        setRentShow(false);
        setReturnShow(false);
    };

    //                    render                    //
    return (
        <div className="payment-container">
            <button className="payment-button" onClick={onPaymentButtonClickHandler}>결제하기</button>
        </div>
    )
}