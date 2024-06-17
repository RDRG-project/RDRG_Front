import { differenceInDays } from "date-fns";
import './style.css';
import { useEffect, useState } from "react";
import { useBasketStore, useBatteryStore, useNoteBookStore, useRentDateStore, useRentItemStore, useRentSelectStore, useRentSiteShowStore, useRentSiteStore, useRentStatusStore, useReturnSelectStore, useReturnSiteShowStore, useReturnSiteStore, useTabletStore, useTotalRentTimeStore, useUserStore } from "src/stores";
import useGameItStore from "src/stores/gameIt.store";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { PostPaymentResponseDto } from "src/apis/payment/dto/response";
import ResponseDto from "src/apis/response.dto";
import { HOME_ABSOLUTE_PATH } from "src/constants";
import { PostPaymentSaveRequestDto } from "src/apis/payment/dto/request";
import { dateTimeFormat } from "src/utils";
import { postPaymentSaveRequest } from "src/apis/payment";

//                    component                    //
export default function Basket() {

    //                    state                    //
    const { startDate, endDate, setStartDate, setEndDate } = useRentDateStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const { setRentShow } = useRentSiteShowStore();
    const { setRentSelectedItem } = useRentSelectStore();
    const { setReturnShow } = useReturnSiteShowStore();
    const { setReturnSelectedItem } = useReturnSelectStore();
    const { setTotalRentTime } = useTotalRentTimeStore();
    const [rentDuration, setRentDuration] = useState<{ days: number; hours: number }>({ days: 0, hours: 0 });
    const { setNotebookState } = useNoteBookStore();
    const { setTabletState } = useTabletStore();
    const { setGameItState } = useGameItStore();
    const { setExternalBatteryState } = useBatteryStore();

    //                    function                    //
    const calculateRentDuration = (startDate: Date, endDate: Date) => {
        const durationInDays = differenceInDays(endDate, startDate);
        return { days: durationInDays, hours: 0 };
    };

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
        setRentDuration({ days: 0, hours: 0 });
        setTotalRentTime('');
        setNotebookState(false);
        setTabletState(false);
        setGameItState(false);
        setExternalBatteryState(false);
    };

    //                    effect                    //
    useEffect(() => {
        if (startDate && endDate) {
            const duration = calculateRentDuration(startDate, endDate);
            setRentDuration(duration);
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
    const navigator = useNavigate();
    const {loginUserRole} = useUserStore();
    const [cookies] = useCookies();
    const { loginUserId } = useUserStore();
    const { rentSite, setRentSite } = useRentSiteStore();
    const { returnSite, setReturnSite } = useReturnSiteStore();
    const { setRentShow } = useRentSiteShowStore();
    const { setReturnShow } = useReturnSiteShowStore();
    const { startDate, endDate, setStartDate, setEndDate } = useRentDateStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();
    const { rentStatus, setRentStatus } = useRentStatusStore();
    const { setNotebookState } = useNoteBookStore();
    const { setTabletState } = useTabletStore();
    const { setGameItState } = useGameItStore();
    const { setExternalBatteryState } = useBatteryStore();

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
        } 
        
        const { nextRedirectPcUrl } = result as PostPaymentResponseDto;
        window.location.href = nextRedirectPcUrl;
    }

    //                    event handler                    //
    const onPaymentButtonClickHandler = () => {
        if (loginUserRole !== 'ROLE_USER') {
            alert('로그인 하라')
            navigator(HOME_ABSOLUTE_PATH);
        };
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
        setRentStatus('');
        setBasketItems([]);
        setTotalAmount(0);
        setStartDate(new Date());
        setEndDate(new Date());
        setRentShow(false);
        setReturnShow(false);
        setNotebookState(false);
        setTabletState(false);
        setGameItState(false);
        setExternalBatteryState(false);

        if (!cookies.accessToken) return;
        postPaymentSaveRequest(requestBody, cookies.accessToken).then(PostPaymentSaveResponseDto);
    };

    //                    render                    //
    return (
        <div className="payment-container">
            <button className="payment-button" onClick={onPaymentButtonClickHandler}>결제하기</button>
        </div>
    );
}