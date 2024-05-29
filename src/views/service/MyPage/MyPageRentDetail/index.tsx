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
    const [rentStatus, setRentStatus] = useState<boolean>(false);
    const [rentTotalPrice, setRentTotalPrice] = useState<number>(0);

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
        
        const {rentDetailList, rentDatetime, rentReturnDatetime, rentStatus, rentTotalPrice} = result as GetRentDetailResponseDto;
        setRent(rentDetailList);
        setRentDatetime(rentDatetime);
        setRentReturnDatetime(rentReturnDatetime);
        setRentStatus(rentStatus);
        setRentTotalPrice(rentTotalPrice);
    };

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken || !rentNumber) return;
        getRentDetailRequest(rentNumber, cookies.accessToken).then(getRentDetailResponse);
    }, []);

    //                    render                    //
    return (
        <div className="rental-details">
            <div>대여 상세 내역</div>
            <div className="rental-info">
                <div className='rental-content'>
                {rent.map((item, index) => (
                        <p key={index}>{item.name} <span>{item.price}원</span></p>
                ))}
                </div>
                <div className="summary">총합계 : {rentTotalPrice}원</div>
                <div className="rental-spot">
                    <p>대여일 : {rentDatetime} 반납일 : {rentReturnDatetime}</p>
                    <p>대여지점 : 부산 반납지점 : 서울</p>
                </div>
            </div>
            <div className="payment-info">
                <p>결제번호 24154212313244</p>
                <p>카드정보 0000 0000 **** ****</p>
                <p>결제금액 500000원</p>
            </div>
        </div>
    );
}