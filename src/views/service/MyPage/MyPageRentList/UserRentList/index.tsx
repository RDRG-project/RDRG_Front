import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import "./style.css";
import { RentItem } from 'src/types';
import { useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, MYPAGE_DETAILS_ABSOLUTE_PATH, RENT_DETAIL_COUNT_PER_PAGE, RENT_DETAIL_COUNT_PER_SECTION } from 'src/constants';
import ResponseDto from 'src/apis/response.dto';
import { GetMyRentPageResponseDto } from 'src/apis/payment/dto/response';
import { getMyRentPageRequest, patchRentStatusRequest } from 'src/apis/payment';
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
    
    //                    function                    //
    const navigator = useNavigate();
    const [cookies] = useCookies();

    const formatDate = (datetime: string) => {
        return datetime.split(' ')[0];
    };

    //                    event handler                    //
    const onClickHandler = () => navigator(MYPAGE_DETAILS_ABSOLUTE_PATH(rentNumber));

    const mainName = name[0];
    const additionalCount = name.length - 1;
    const displayName = additionalCount > 0 ? `${mainName} 외 ${additionalCount}건` : mainName;

    const onCancelHandler = async() => {
        if (!cookies.accessToken){
            return;
        }

        const confirmCancel = window.confirm("대여를 취소하시겠습니까?")
        if (!confirmCancel) {
            return;
        }

        try {
            const requestBody = {
                rentStatus : "대여 취소"
            };

            const result = await patchRentStatusRequest(cookies.accessToken ,rentNumber, requestBody);
            if (result && result.code === 'SU') {
                alert('취소되었습니다.');
                window.location.reload();
            } else {
                alert('대여 상태 변경에 실패했습니다.')
            }
        } catch (error) {
            alert('대여 상태 변경 중 오류가 발생했습니다.');
        }
    }

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
                {rentStatus !== '대여 취소' && (
                    <div className='user-rent-list-cancel-button' onClick={onCancelHandler}> 대여 취소</div>
                )}
            </div>
        </div>
    );
}

//                    component                    //
export default function UserRentList() {

    //                    state                    //
    const [cookies] = useCookies();
    const { loginUserRole } = useUserStore();

    const [rentList, setRentList] = useState<RentItem[]>([]);
    const [viewList, setViewList] = useState<RentItem[]>([]);
    const [totalLength, setTotalLength] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentSection, setCurrentSection] = useState<number>(1);
    const [pageList, setPageList] = useState<number[]>([1]);
    const [totalSection, setTotalSection] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);

    //                    function                    //
    const navigator = useNavigate();

    const changePage = (rentList: RentItem[], totalLength: number) => {
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

    const changeRentList = (rentList: RentItem[]) => {
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

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken) {
            navigator(AUTH_ABSOLUTE_PATH);
            return;
        }
        getMyRentPageRequest(cookies.accessToken).then(getMyPageRentListResponse);

    }, [cookies.accessToken, loginUserRole, navigator]);

    useEffect(() => {
        if (!rentList.length) return;
        changePage(rentList, totalLength);
    }, [currentPage, rentList, totalLength]);
    
    useEffect(() => {
        if (!rentList.length) return;
        changeSection(totalPage);
    }, [currentSection, rentList.length, totalPage]);

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
}
