import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

import { useUserStore } from 'src/stores';

import { usePagination } from 'src/hooks';

import { AdminRentItem} from 'src/types';

import ResponseDto from 'src/apis/response.dto';
import { getAdminRentPageRequest, getAdminSearchWordRequest, patchRentStatusRequest } from 'src/apis/payment';
import { GetAdminRentPageResponseDto} from 'src/apis/payment/dto/response';

import { ADMIN_RENT_LIST_COUNT_PER_PAGE, AUTH_ABSOLUTE_PATH, COUNT_PER_SECTION, MYPAGE_DETAILS_ABSOLUTE_PATH } from 'src/constants';

import "./style.css";

//                    component                    //
function AdminRentListItem({
    rentNumber,
    userId,
    name,
    rentDatetime,
    rentReturnDatetime,
    rentStatus
    }:AdminRentItem) {
    
    //                    state                    //
    const [ cookies ] = useCookies();
    const [ selectedStatus, setSelectedStatus ] = useState<string>('');

    //                    function                    //
    const navigator = useNavigate();

    const patchRentStatusResponse = (result : ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '존재하지 않은 예약내역입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
            if (!result || result.code !== 'SU') {
                alert(message)
                return;
            } else {
                alert('상태가 변경되었습니다.');
                window.location.reload();
            };
        };

    //                    effect                 //
    useEffect(() => {
        setSelectedStatus(rentStatus);
    }, [rentStatus]);

    //                    event handler                    //
    const onClickHandler = () => navigator(MYPAGE_DETAILS_ABSOLUTE_PATH(rentNumber));

    const mainName = name[0];
    const additionalCount = name.length - 1;
    const displayName = additionalCount > 0 ? `${mainName} 외 ${additionalCount}건` : mainName;

    const onStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(event.target.value);

    const onStatusChangeHandler = () => {
        if (!cookies.accessToken) return;
        const requestBody = { rentStatus: selectedStatus };
        patchRentStatusRequest(cookies.accessToken, rentNumber, requestBody).then(patchRentStatusResponse);
    };

    const formatDate = (datetime: string) => {
        return datetime.split(' ')[0];
    };

    //                    render                    //
    return (
        <div className='admin-rent-list-table-tr'>
            <div className='admin-rent-list-status'>
                <div className='cs-status-disable-button'>{rentStatus}</div>
            </div>
            <div className='admin-rent-list-status-change'>
                <select value={selectedStatus} onChange={onStatusChange}>
                    <option value = "결제 완료">결제 완료</option>
                    <option value = "대여 중">대여 중</option>
                    <option value = "반납 완료">반납 완료</option>
                    <option value = "대여 취소">대여 취소</option>
                </select>
                <button onClick={onStatusChangeHandler}>적용</button>
            </div>
            <div className='admin-rent-list-name'>{displayName}</div>
            <div className='admin-rent-list-user-id'>{userId}</div>
            <div className='admin-rent-list-rent-date'>{formatDate(rentDatetime)}</div>
            <div className='admin-rent-list-return-date'>{formatDate(rentReturnDatetime)}</div>
            <div className='admin-rent-list-page-button' onClick={onClickHandler}>
                <div className='admin-rent-list-detail'>대여상세</div>
                <div className='admin-rent-list-next-button'></div>
            </div>
        </div>
    );
};

//                    component                    //
export default function AdminRentList () {

    //                    state                    //
    const [cookies] = useCookies();

    const { loginUserRole } = useUserStore();

    const [word, setWord] = useState<string>('');

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
    } = usePagination<AdminRentItem>(ADMIN_RENT_LIST_COUNT_PER_PAGE, COUNT_PER_SECTION);

    //                    function                    //
    const navigator = useNavigate();

    const getAdminRentRentPageResponse = (result : GetAdminRentPageResponseDto | ResponseDto | null) => {
        if (!result) {
            alert('서버에 문제가 있습니다.');
            return;
        }

        const message = 
        result.code === 'VF' ? '올바르지 않은 접근입니다.' :
        result.code === 'AF' ? '관리자로 로그인 후 이용해주세요.' :
        result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (result.code !== 'SU') {
            alert(message);
        if (result.code === 'AF') navigator(AUTH_ABSOLUTE_PATH);
        return;
        }
        const { adminRentList } = result as GetAdminRentPageResponseDto;
        if (!adminRentList || !adminRentList.length) {
            alert('대여 목록을 찾을 수 없습니다.');
            return;
        }

        changeBoardList(adminRentList);
        setCurrentPage(!adminRentList.length ? 0 : 1);
        setCurrentSection(!adminRentList.length ? 0 : 1);
    };

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken) {
            navigator(AUTH_ABSOLUTE_PATH);
            return;
        }
        if (loginUserRole === 'ROLE_ADMIN') {
            getAdminRentPageRequest(cookies.accessToken).then(getAdminRentRentPageResponse);
        } 
    }, [cookies.accessToken, loginUserRole, navigator]);

    //                    event handler                    //
    const onSearchWordKeydownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        onSearchButtonClickHandler();
    };
    
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const word = event.target.value;
        setWord(word);
    };
    
    const onSearchButtonClickHandler = () => {
        if (!word) return;
        if (!cookies.accessToken) return;
    
        getAdminSearchWordRequest(word, cookies.accessToken).then((result) => {
            console.log("Search Word:", result);
            if (!result) {
                alert('서버에 문제가 있습니다.');
                return;
            }
    
            const { adminRentList } = result as GetAdminRentPageResponseDto;
            
            changeBoardList(adminRentList);
            setCurrentPage(!adminRentList.length ? 0 : 1);
            setCurrentSection(!adminRentList.length ? 0 : 1);
        });
    };

    //                    render                    //
    return (
        <div className= 'admin-rent-list-wrapper'>
            <div className='admin-rent-list-table'>
                <div className='admin-rent-list-search-box'>
                    <div className='admin-rent-list-search-input-box'>
                        <input className='admin-rent-list-search-input' placeholder='아이디를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeydownHandler}/>
                    </div>
                    <div className='customer-support-button' onClick={onSearchButtonClickHandler}>검색하기</div>
                </div>
                <div className='cs-list-table-th'>
                    <div className='admin-rent-list-table-status'>상태</div>
                    <div className='admin-rent-list-table-status-change'>상태 변경</div>
                    <div className='admin-rent-list-table-title'>대여품목</div>
                    <div className='admin-rent-list-table-id'>회원 ID</div>
                    <div className='admin-rent-list-table-rent-date'>대여일</div>
                    <div className='admin-rent-list-table-return-date'>반납일</div>
                    <div className='admin-rent-list-table-rent-detail'>상세정보</div>
                </div>
                {viewList.map(item => <AdminRentListItem key={item.rentNumber} {...item} />)}
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
        </div>
    );
};