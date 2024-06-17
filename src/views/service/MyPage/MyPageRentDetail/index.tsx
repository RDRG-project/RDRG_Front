import React, { useEffect, useState } from 'react'
import "./style.css";
import { GetRentDetailResponseDto } from 'src/apis/payment/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { HOME_ABSOLUTE_PATH, MYPAGE_RENT_DETAIL_ABSOLUTE_PATH } from 'src/constants';
import { useNavigate, useParams } from 'react-router';
import { RentDetailList } from 'src/types';
import { useCookies } from 'react-cookie';
import { getRentDetailRequest } from 'src/apis/payment';

//                    component                    //
export default function MypageRentDetail() {

    //                    state                    //
    const {rentNumber} = useParams();

    const [cookies] = useCookies();
    const [rent, setRent] = useState<RentDetailList[]>([]);
    const [rentDatetime, setRentDatetime] = useState<string>('');
    const [rentReturnDatetime, setRentReturnDatetime] = useState<string>('');
    const [rentStatus, setRentStatus] = useState<string>('');
    const [rentTotalPrice, setRentTotalPrice] = useState<number>(0);
    const [rentPlace, setRentPlace] = useState<string>('');
    const [rentReturnPlace, setRentReturnPlace] = useState<string>('');

    //                    function                    //
    const navigator = useNavigate();

    const getRentDetailResponse = (result : GetRentDetailResponseDto | ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 대여번호입니다.' : 
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') {
                navigator(HOME_ABSOLUTE_PATH);
                return;
            }
            navigator(MYPAGE_RENT_DETAIL_ABSOLUTE_PATH);
            return;
        }
        
        const {rent, rentDatetime, rentReturnDatetime, rentStatus, rentTotalPrice, rentPlace, rentReturnPlace} = result as GetRentDetailResponseDto;
        setRent(rent);
        setRentDatetime(rentDatetime);
        setRentReturnDatetime(rentReturnDatetime);
        setRentStatus(rentStatus);
        setRentTotalPrice(rentTotalPrice);
        setRentPlace(rentPlace);
        setRentReturnPlace(rentReturnPlace);
    };

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken || !rentNumber) return;
        getRentDetailRequest(rentNumber, cookies.accessToken).then(getRentDetailResponse);
    }, []);

    //                    render                    //
    return (
        <div id='mp-rent-detail-wrapper'>
            <div className='mp-rent-detail-title'>대여 상세 내역</div>
            <div className='mp-rent-detail-container'>
                <div className="mp-rent-detail-content-container">
                    <div className="mp-rent-detail-content-title">대여정보</div>
                    <div className='mp-rent-detail-content-box'>
                        <div className='mp-rent-detail-items-box'>
                            {rent.map((item, index) => (
                                    <div className='mp-rent-detail-item' key={index}>{item.name} <span>{item.price}원</span></div>
                            ))}
                        </div>
                        <div className='mp-rent-detail-items-divide'></div>
                        <div className="mp-rent-detail-items-summary">총합계 : <span>{rentTotalPrice}원</span></div>
                        <div className="mp-rent-detail-time">
                            <div>대여일 : {rentDatetime}</div>
                            <div>반납일 : {rentReturnDatetime}</div>
                        </div>
                        <div className="mp-rent-detail-spot">
                            <div>대여지점 : {rentPlace}</div>
                            <div>반납지점 : {rentReturnPlace}</div>
                        </div>
                        <div className='rental-status'>{rentStatus}</div>
                    </div>
                </div>
                <div className="mp-rent-detail-payment-container">
                    <div className="mp-rent-detail-content-title">결제정보</div>
                    <div className="mp-rent-detail-payment-content-box">
                        <div className="mp-rent-detail-payment-number">결제번호 24154212313244</div>
                        <div className="mp-rent-detail-payment-card-number">카드정보 0000 0000 **** ****</div>
                        <div className="mp-rent-detail-payment-sum">결제금액 500000원</div>
                    </div>
                </div>
            </div>
        </div>
    );
}