import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router'
import { getReserveRequest } from 'src/apis/payment';
import { ReserveResponseDto } from 'src/apis/payment/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { getSignInUserRequest } from 'src/apis/user';
import { GetSignInUserResponseDto } from 'src/apis/user/dto/response';
import { AUTH_ABSOLUTE_PATH } from 'src/constants';
import { useUserStore } from 'src/stores';

export default function RentSuccess() {

    const [ cookies ] = useCookies();
    const { rentNumber } = useParams();
    const { loginUserId } = useUserStore();
    const [reserveUserId, setReserveUserId] = useState<string>('');
    const [rentPlace, setRentPlace] = useState<string>('');
    const [rentTotalPrice, setRentTotalPrice] = useState<number>(0);
    const [rentalPeriod, setRentalPeriod] = useState<string>('');

    const navigator = useNavigate();

    const getSignInUserResponse = (result : GetSignInUserResponseDto | ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            navigator(AUTH_ABSOLUTE_PATH);
            return;
        }
    
        const {userId} = result as GetSignInUserResponseDto;
        getReserveRequest(userId, cookies.accessToken).then(getReserveResponse);
    };

    const getReserveResponse = (result: ReserveResponseDto | ResponseDto | null) => {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '유효하지 않은 아이디입니다.' :
            result.code === 'AF' ? '로그인 후 결제를 진행해주세요.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        const { userId, rentalPeriod, rentPlace, rentTotalPrice } = result as ReserveResponseDto;
        setReserveUserId(userId);
        setRentPlace(rentPlace);
        setRentTotalPrice(rentTotalPrice);
        setRentalPeriod(rentalPeriod);

    }

    useEffect(() => {
        console.log(`accessToken: ${cookies.accessToken}`);
        console.log(`loginUserId: ${loginUserId}`);
        if (!loginUserId || !cookies.accessToken) return;
        // getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
        getReserveRequest(loginUserId, cookies.accessToken).then(getReserveResponse);
    }, [loginUserId]);

    return (
        <div>
            <h1>{reserveUserId}</h1>
            <h3>{rentalPeriod}</h3>
            <h3>{rentPlace}</h3>
            <h3>{rentTotalPrice}</h3>
        </div>
    )
}
