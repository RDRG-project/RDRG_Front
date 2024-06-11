import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import "./style.css";
import { AdminRentItem, RentItem } from 'src/types';
import { useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, COUNT_PER_PAGE, COUNT_PER_SECTION, MYPAGE_DETAILS_ABSOLUTE_PATH, RENT_DETAIL_COUNT_PER_PAGE, RENT_DETAIL_COUNT_PER_SECTION } from 'src/constants';
import ResponseDto from 'src/apis/response.dto';
import { GetAdminRentPageResponseDto, GetMyRentPageResponseDto } from 'src/apis/payment/dto/response';
import { getAdminRentPageRequest, getAdminSearchWordRequest, getMyRentPageRequest } from 'src/apis/payment';
import { useCookies } from 'react-cookie';
import { useUserStore } from 'src/stores';

//                    component                    //
function RentListItem({
    rentNumber,
    rentStatus,
    name,
    rentDatetime,
    rentReturnDatetime,
    totalPrice
    }:RentItem) {
    const navigator = useNavigate();

    const onClickHandler = () => navigator(MYPAGE_DETAILS_ABSOLUTE_PATH(rentNumber));

    const mainName = name[0];
    const additionalCount = name.length - 1;
    const displayName = additionalCount > 0 ? `${mainName} 외 ${additionalCount}건` : mainName;

    return (
        <div className='mp-rent-list-table'>
            <div className='mp-rent-list-content'>
                <div className='cs-status-primary-button'>{rentStatus}</div>
                <div className='mp-rent-list-name'>{displayName}</div>
                <div className='mp-rent-list-date'>
                    <div className='mp-rent-list-rent-place'>대여일 : {rentDatetime}</div>
                    <div className='mp-rent-list-return-place'>반납일 : {rentReturnDatetime}</div>
                </div>
                <div className='mp-rent-list-table-bottom'>
                    <div className='mp-rent-list-total-price'>{totalPrice}원</div>
                    <div className='mp-rent-list-page-button' onClick={onClickHandler}>
                        <div className='mp-rent-list-detail'>대여상세</div>
                        <div className='mp-rent-list-next-button'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

//                    component                    //
function AdminRentListItem({
    rentNumber,
    userId,
    name,
    rentDatetime,
    rentReturnDatetime,
    totalPrice,
    rentStatus
    }:AdminRentItem) {
    
    //                    function                    //
    const navigator = useNavigate();

    //                    event handler                    //
    const onClickHandler = () => navigator(MYPAGE_DETAILS_ABSOLUTE_PATH(rentNumber));

    const mainName = name[0];
    const additionalCount = name.length - 1;
    const displayName = additionalCount > 0 ? `${mainName} 외 ${additionalCount}건` : mainName;
    //                    render                    //
    return (
        <div className='mp-rent-list-table'>
            <div className='mp-rent-list-content'>
                <div className='cs-status-primary-button'>{rentStatus}</div>
                <div className='mp-rent-list-name'>{displayName}</div>
                <div className='mp-rent-list-date'>
                    <div className='mp-rent-list-rent-place'>대여일 : {rentDatetime}</div>
                    <div className='mp-rent-list-return-place'>반납일 : {rentReturnDatetime}</div>
                </div>
                <div>{userId}</div>
                <div className='mp-rent-list-table-bottom'>
                    <div className='mp-rent-list-total-price'>{totalPrice}원</div>
                    <div className='mp-rent-list-page-button' onClick={onClickHandler}>
                        <div className='mp-rent-list-detail'>대여상세</div>
                        <div className='mp-rent-list-next-button'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

//                    component                    //
export default function MypageRentList() {

    //                    state                    //
    const [cookies] = useCookies();
    const { loginUserRole } = useUserStore();

    const [rentList, setRentList] = useState<RentItem[]>([]);
    const [viewList, setViewList] = useState<RentItem[] | AdminRentItem[]>([]);
    const [totalLength, setTotalLength] = useState<number>(0);
    const [ adminRentList, setAdminRentList ] = useState<AdminRentItem[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentSection, setCurrentSection] = useState<number>(1);
    const [pageList, setPageList] = useState<number[]>([1]);
    const [totalSection, setTotalSection] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [word, setWord] = useState<string>('');

    //                    function                    //
    const navigator = useNavigate();

    const changePage = (rentList: RentItem[] | AdminRentItem[], totalLength: number) => {
        if (!currentPage) return;
        const startIndex = (currentPage - 1) * RENT_DETAIL_COUNT_PER_PAGE;
        let endIndex = currentPage * RENT_DETAIL_COUNT_PER_PAGE;
        if (endIndex > totalLength - 1) endIndex = totalLength;
        const viewList = rentList.slice(startIndex, endIndex);
        setViewList(viewList);
    };

    const changeSection = (totalPage: number) => {
        if (!currentSection) return;
        const startPage = (currentSection * RENT_DETAIL_COUNT_PER_SECTION) - (RENT_DETAIL_COUNT_PER_SECTION - 1);
        let endPage = currentSection * RENT_DETAIL_COUNT_PER_SECTION;
        if (endPage > totalPage) endPage = totalPage;
        const pageList: number[] = [];
        for (let page = startPage; page <= endPage; page++) pageList.push(page);
        setPageList(pageList);
    };

    const changeRentList = (rentList: RentItem[] | AdminRentItem[]) => {
        if (!rentList || rentList.length === 0) {
            alert('대여 목록을 찾을 수 없습니다.');
            return;
        }

        setRentList(rentList);

        const totalLength = rentList.length;
        setTotalLength(totalLength);

        const totalPage = Math.floor((totalLength - 1) / RENT_DETAIL_COUNT_PER_PAGE) + 1;
        setTotalPage(totalPage);

        const totalSection = Math.floor((totalPage - 1) / RENT_DETAIL_COUNT_PER_SECTION) + 1;
        setTotalSection(totalSection);

        changePage(rentList, totalLength);

        changeSection(totalPage);
    };

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
        changeRentList(rentList);

        setCurrentPage(!rentList.length ? 0 : 1);
        setCurrentSection(!rentList.length ? 0 : 1);
    }
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
        changeRentList(adminRentList);

        setCurrentPage(!adminRentList.length ? 0 : 1);
        setCurrentSection(!adminRentList.length ? 0 : 1);
    }

    const getAdminSearchWordResponse = (result : GetAdminRentPageResponseDto | ResponseDto | null) => {
        if(!result) {
            alert('서버에 문제가 있습니다.');
            return;
        }
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '검색어를 입력하세요' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if(!result || result.code !== 'SU') {
            alert(message);
            if(result.code === 'AF') navigator(AUTH_ABSOLUTE_PATH);
            return;
        }

        const { adminRentList } = result as GetAdminRentPageResponseDto;
        if (!adminRentList || !adminRentList.length) {
            alert('대여 목록을 찾을 수 없습니다.');
            return;
        }
        changeRentList(adminRentList);

        setCurrentPage(!adminRentList.length ? 0 : 1);
        setCurrentSection(!adminRentList.length ? 0 : 1);
        
    }

    //                    event handler                    //
    const onPreSectionClickHandler = () => {
        if (currentSection <= 1) return;
        setCurrentSection(currentSection - 1);
        setCurrentPage((currentSection - 1) * RENT_DETAIL_COUNT_PER_SECTION);
    };

    const onNextSectionClickHandler = () => {
        if (currentSection === totalSection) return;
        setCurrentSection(currentSection + 1);
        setCurrentPage(currentSection * RENT_DETAIL_COUNT_PER_SECTION + 1);
    };

    const onPrePageClickHandler = () => {
        if (currentPage <= 1) return;
        if ((currentPage - 1) % RENT_DETAIL_COUNT_PER_SECTION === 0) {
            setCurrentSection(currentSection - 1);
        }
        setCurrentPage(currentPage - 1);
    };

    const onNextPageClickHandler = () => {
        if (currentPage === totalPage) return;
        if (currentPage % RENT_DETAIL_COUNT_PER_SECTION === 0) {
            setCurrentSection(currentSection + 1);
        }
        setCurrentPage(currentPage + 1);
    };

    const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    };

    const onSearchWordKeydownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        onSearchButtonClickHandler();
    }

    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const word = event.target.value;
        setWord(word);
    };

    const onSearchButtonClickHandler = () => {
        if (!word) return;
        if (!cookies.accessToken) return;

        getAdminSearchWordRequest(word, cookies.accessToken).then(getAdminSearchWordResponse);
    };

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken) {
            navigator(AUTH_ABSOLUTE_PATH);
            return;
        }
        if (loginUserRole === 'ROLE_USER') {
            getMyRentPageRequest(cookies.accessToken).then(getMyPageRentListResponse);
        } else if (loginUserRole === 'ROLE_ADMIN') {
            getAdminRentPageRequest(cookies.accessToken).then(getAdminRentRentPageResponse);
        } 
    }, [cookies.accessToken, loginUserRole, navigator]);

    useEffect(() => {
        if (!rentList.length) return;
        changePage(rentList, totalLength);
    }, [currentPage, rentList, totalLength]);
    
    useEffect(() => {
        if (!rentList.length) return;
        changeSection(totalPage);
    }, [currentSection, rentList.length, totalPage]);

    useEffect(() => {
        if (!rentList.length) return;
        changePage(rentList, totalLength);
    }, [currentPage, adminRentList, totalLength]);
    
    useEffect(() => {
        if (!rentList.length) return;
        changeSection(totalPage);
    }, [currentSection, adminRentList.length, totalPage]);

    //                    render                    //
    return (
        <div id='mp-rent-list-wrapper'>
            {loginUserRole === 'ROLE_ADMIN' ? 
            <div className='mp-list-search-input-box'>
                <input className='mp-list-search-input' placeholder='아이디를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeydownHandler}/>
            <div className='mp-rent-search' onClick={onSearchButtonClickHandler}>검색하기</div>
            </div> : <div></div>
            }
            {loginUserRole === 'ROLE_USER' ? (
                viewList.map(item => <RentListItem key={item.rentNumber} {...item} />)
            ) : (
                viewList.map(item => <AdminRentListItem key={item.rentNumber} {...item} />)
            )}
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
}
