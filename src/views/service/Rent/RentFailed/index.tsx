import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';

import { useUserStore } from 'src/stores';

import ResponseDto from 'src/apis/response.dto';
import { deleteRentCancelRequest } from 'src/apis/payment';

import { HOME_ABSOLUTE_PATH, RENT_ABSOLUTE_PATH } from 'src/constants';

import './style.css';

//                    component                    //
export default function RentFailed() {

    //                    state                    //
    const [cookies] = useCookies();

    const { loginUserId } = useUserStore();

    const { rentNumber } = useParams();

    //                    function                    //
    const navigator = useNavigate();

    const DeleteRentCancelResponseDto = (result: ResponseDto | null) => {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '존재하지 않는 예약내역입니다.' :
            result.code === 'NBD' ? '존재하지 않는 예약내역입니다.' :
            result.code === 'AF' ? '로그인을 진행하고 계속해주세요.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        alert('대여에 실패했습니다.');
    };

    //                    event handler                    //
    const reRentButtonClickHandler = () => navigator(RENT_ABSOLUTE_PATH);

    const homeButtonClickHandler = () => navigator(HOME_ABSOLUTE_PATH);

    //                    effect                    //
    useEffect(() => {
        if (!loginUserId || !cookies.accessToken || !rentNumber) return;
        const rentNumberInt = Number(rentNumber);
        if (isNaN(rentNumberInt)) {
            alert('잘못된 예약 번호입니다.');
            return;
        }
        deleteRentCancelRequest(cookies.accessToken, rentNumberInt).then(DeleteRentCancelResponseDto);
    }, [loginUserId, rentNumber, cookies.accessToken]);

    //                    render                    //
    return (
        <div id='rent-fail-wrapper'>
            <div className='rent-fail-box'>
                <div className='rent-fail-top'>
                    <div className='rent-fail-top-left'>대여/결제</div>
                    <div className='rent-fail-top-right'>
                        <div className='rent-state'>장바구니</div>
                        <div className='rent-state'>대여/결제</div>
                        <div className='rent-state-on'>완료</div>
                    </div>
                </div>
                <div className='rent-fail-detail-box'>
                    <div className='rent-fail-middle'>
                        <div className='rent-fail-title'>
                            <span className='highlight'>대여처리에 실패</span>하여 대여를 완료하지 못하였습니다.
                        </div>
                        <div className='rent-fail-explain-box'>
                            <div className='rent-fail-explain-title'>대여 정보 조회실패</div>
                            <div className='rent-fail-explain-cs'>재시도를 하신 후에도 계속해서 같은 오류가 발생한다면 고객센터로 문의하여 주시길 바랍니다.</div>
                        </div>
                    </div>
                    <div className='rent-fail-bottom'>
                        <div className='rent-fail-button' onClick={reRentButtonClickHandler}>다시 대여하기</div>
                        <div className='rent-fail-button'onClick={homeButtonClickHandler}>홈 가기</div>
                    </div>
                </div>
            </div>
        </div>
    );
};