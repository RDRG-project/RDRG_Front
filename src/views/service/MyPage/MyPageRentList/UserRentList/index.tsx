import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

import { useUserStore } from 'src/stores';

import { usePagination } from 'src/hooks';

import { RentItem } from 'src/types';

import ResponseDto from 'src/apis/response.dto';
import { getMyRentPageRequest, patchRentStatusRequest } from 'src/apis/payment';
import { GetMyRentPageResponseDto } from 'src/apis/payment/dto/response';

import { AUTH_ABSOLUTE_PATH, COUNT_PER_SECTION, MYPAGE_DETAILS_ABSOLUTE_PATH, USER_RENT_LIST_COUNT_PER_PAGE } from 'src/constants';

import "./style.css";

//                    component                    //
function RentListItem({
    rentNumber,
    rentStatus,
    name,
    rentDatetime,
    rentReturnDatetime,
    totalPrice
    }:RentItem) {

    //                    state                    //
    const [cookies] = useCookies();

    const {loginUserRole} = useUserStore();
    
    //                    function                    //
    const navigator = useNavigate();

    const patchRentStatusResponse = (result: ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '존재하지 않은 예약내역입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

            if (!result || result.code !== 'SU') {
                alert(message)
                return;
            } else {
                alert('대여 취소가 되었습니다.');
                window.location.reload();
            };
    };

    const formatDate = (datetime: string) => {return datetime.split(' ')[0]};

    //                    event handler                    //
    const onClickHandler = () => navigator(MYPAGE_DETAILS_ABSOLUTE_PATH(rentNumber));

    const mainName = name[0];
    const additionalCount = name.length - 1;
    const displayName = additionalCount > 0 ? `${mainName} 외 ${additionalCount}건` : mainName;

    const onCancelHandler = () => {
        if (loginUserRole !== 'ROLE_USER') return;
        const requestBody = { rentStatus: '대여 취소' };
        
        patchRentStatusRequest(cookies.accessToken, rentNumber, requestBody).then(patchRentStatusResponse)
    };

    //                    render                    //
    return (
        <div className='user-rent-list-table'>
            <div className='user-rent-list-content'>
                <div className='cs-status-disable-button'>{rentStatus}</div>
                <div className='user-rent-list-name'>{displayName}</div>
                <div className='user-rent-list-date'>
                    <div className='user-rent-list-rent-place'>대여일 : {formatDate(rentDatetime)}</div>
                    <div className='user-rent-list-return-place'>반납일 : {formatDate(rentReturnDatetime)}</div>
                </div>
                <div className='user-rent-list-table-bottom'>
                    <div className='user-rent-list-total-price'>{totalPrice}원</div>
                    <div className='user-rent-list-page-button' onClick={onClickHandler}>
                        <div className='user-rent-list-detail'>대여상세</div>
                        <div className='user-rent-list-next-button'></div>
                    </div>
                </div>
                {rentStatus == '결제 완료' && (
                <div className='user-rent-list-cancel-button' onClick={onCancelHandler}>대여 취소</div>
                )}
            </div>
        </div>
    );
};

//                    component                    //
export default function UserRentList() {

    //                    state                    //
    const [cookies] = useCookies();

    const { loginUserRole } = useUserStore();

    const {
        currentPage, 
        viewList, 
        pageList, 
        setCurrentPage, 
        setCurrentSection, 
        changeBoardList,  
        onPageClickHandler, 
        onPreSectionClickHandler, 
        onPrePageClickHandler, 
        onNextPageClickHandler, 
        onNextSectionClickHandler
    } = usePagination<RentItem>(USER_RENT_LIST_COUNT_PER_PAGE, COUNT_PER_SECTION);

    //                    function                    //
    const navigator = useNavigate();

    const getMyPageRentListResponse = (result : GetMyRentPageResponseDto | ResponseDto | null) =>{ 
        if (!result) {
            alert('서버에 문제가 있습니다.');
            return;
        }

        const message =
            result.code === 'VF' ? '인증에 실패했습니다.' : 
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(AUTH_ABSOLUTE_PATH);
            return;
        }

        const { rentList } = result as GetMyRentPageResponseDto;
        if (!rentList || !rentList.length) {
            alert('대여 목록을 찾을 수 없습니다.');
            return;
        }   

        changeBoardList(rentList);
        setCurrentPage(!rentList.length ? 0 : 1);
        setCurrentSection(!rentList.length ? 0 : 1);
    };

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken) {
            navigator(AUTH_ABSOLUTE_PATH);
            return;
        }
        getMyRentPageRequest(cookies.accessToken).then(getMyPageRentListResponse);

    }, [cookies.accessToken, loginUserRole, navigator]);

    //                    render                    //
    return (
        <div id='user-rent-list-wrapper'>
            {viewList.map(item => <RentListItem key={item.rentNumber} {...item} />)}
            <div className='cs-list-bottom'>
                <div className='cs-list-pagination'>
                    <div className='cs-list-page-pre-section' onClick={onPreSectionClickHandler}></div>
                    <div className='cs-list-page-left' onClick={onPrePageClickHandler}></div>
                    <div className='cs-list-page-box'>
                        {pageList.map(page => page === currentPage ? <div key={page} className='cs-list-page-active'>{page}</div> : 
                        <div key={page} className='cs-list-page' onClick={() => onPageClickHandler(page)}>{page}</div>
                        )}
                    </div>
                    <div className='cs-list-page-right' onClick={onNextPageClickHandler}></div>
                    <div className='cs-list-page-next-section' onClick={onNextSectionClickHandler}></div>
                </div>
            </div>
        </div>
    );
};