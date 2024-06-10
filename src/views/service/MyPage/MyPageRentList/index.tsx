import React, { useEffect, useState } from 'react'
import "./style.css";
import { RentItem } from 'src/types';
import { useNavigate } from 'react-router';
import { AUTH_ABSOLUTE_PATH, COUNT_PER_PAGE, COUNT_PER_SECTION, MYPAGE_DETAILS_ABSOLUTE_PATH, RENT_DETAIL_COUNT_PER_PAGE, RENT_DETAIL_COUNT_PER_SECTION } from 'src/constants';
import ResponseDto from 'src/apis/response.dto';
import { GetMyRentPageResponseDto } from 'src/apis/payment/dto/response';
import { getMyRentPageRequest } from 'src/apis/payment';
import { useCookies } from 'react-cookie';

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

    //                    event handler                    //
    const onClickHandler = () => navigator(MYPAGE_DETAILS_ABSOLUTE_PATH(rentNumber));

    //                    render                    //
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
export default function MypageRentList() {

    //                    state                    //
    const [cookies] = useCookies();

    const [rentList, setRent] = useState<RentItem[]>([]);
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

        setRent(rentList);

        const totalLength = rentList.length;
        setTotalLength(totalLength);

        const totalPage = Math.floor((totalLength - 1) / RENT_DETAIL_COUNT_PER_PAGE) + 1;
        setTotalPage(totalPage);

        const totalSection = Math.floor((totalPage - 1) / RENT_DETAIL_COUNT_PER_SECTION) + 1;
        setTotalSection(totalSection);

        changePage(rentList, totalLength);

        changeSection(totalPage);
    };

    const getMyPageRentListResponseDto = (result : GetMyRentPageResponseDto | ResponseDto | null) =>{ 
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
        if (!cookies.accessToken) return;
        getMyRentPageRequest(cookies.accessToken).then(getMyPageRentListResponseDto);
    }, []);

    useEffect(() => {
        if (!rentList.length) return;
        changePage(rentList, totalLength);
    }, [currentPage]);
    
    useEffect(() => {
        if (!rentList.length) return;
        changeSection(totalPage);
    }, [currentSection]);

    //                    render                    //
    return (
        <div id='mp-rent-list-wrapper'>
            {viewList.map(item => <RentListItem {...item}/>)}
            <div className='cs-list-bottom'>
                <div className='cs-list-pagination'>
                    <div className='cs-list-page-pre-section' onClick={onPreSectionClickHandler}></div>
                    <div className='cs-list-page-left' onClick={onPrePageClickHandler}></div>
                    <div className='cs-list-page-box'>
                        {pageList.map(page => page === currentPage ? <div className='cs-list-page-active'>{page}</div> : 
                        <div className='cs-list-page' onClick={() => onPageClickHandler(page)}>{page}</div>
                        )}
                    </div>
                    <div className='cs-list-page-right' onClick={onNextPageClickHandler}></div>
                    <div className='cs-list-page-next-section' onClick={onNextSectionClickHandler}></div>
                </div>
            </div>
        </div>
    );
}