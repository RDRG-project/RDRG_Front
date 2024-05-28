import React, { useEffect, useState } from 'react'
import "./style.css";
import { RentItem } from 'src/types';
import { useNavigate } from 'react-router';
import { COUNT_PER_PAGE, COUNT_PER_SECTION } from 'src/constants';

//                    component                    //
// function RentDetailItem({
//     rentStatus,
//     name,
//     rentDatetime,
//     rentReturnDatetime,
//     totalPrice
// }:RentItem) {
    //                    function                    //
//     const navigator = useNavigate();

    //                    event handler                    //
    // 대여 상세 페이지로 이동 헨들러 만들기

    //                    render                    //
//     return (
//         <div className='mp-rent-detail-table'>
//             {rentStatus ?
//             <div className='mp-rent-detail-status-button'>대여중</div> :
//             <div className='mp-rent-detail-status-button'>대여완료</div>
//             }
//             <div className='mp-rent-detail-name'>{name}</div>
//             <div className='mp-rent-detail-rent-place'>대여일 : {rentDatetime}</div>
//             <div className='mp-rent-detail-return-place'>반납일 : {rentReturnDatetime}</div>
//             <div className='mp-rent-detail-total-price'>{totalPrice}</div>
//             <div className='mp-rent-detail-rental'>대여상세</div>
//         </div>
//     );
// }

//                    component                    //
export default function MypageRentDetail() {

    //                    state                    //
    const [rentDetailList, setRentDetailList] = useState<RentItem[]>([]);
    const [viewList, setViewList] = useState<RentItem[]>([]);
    const [totalLength, setTotalLength] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentSection, setCurrentSection] = useState<number>(1);
    const [pageList, setPageList] = useState<number[]>([1]);
    const [totalSection, setTotalSection] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);

    //                    function                    //
    const changePage = (rentDetailList: RentItem[], totalLength: number) => {
        if (!currentPage) return;
        const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
        let endIndex = currentPage * COUNT_PER_PAGE;
        if (endIndex > totalLength - 1) endIndex = totalLength;
        const viewList = rentDetailList.slice(startIndex, endIndex);
        setViewList(viewList);
    };

    const changeSection = (totalPage: number) => {
        if (!currentSection) return;
        const startPage = (currentSection * COUNT_PER_SECTION) - (COUNT_PER_SECTION - 1);
        let endPage = currentSection * COUNT_PER_SECTION;
        if (endPage > totalPage) endPage = totalPage;
        const pageList: number[] = [];
        for (let page = startPage; page <= endPage; page++) pageList.push(page);
        setPageList(pageList);
    };

    //                    event handler                    //
    const onPreSectionClickHandler = () => {
        if (currentSection <= 1) return;
        setCurrentSection(currentSection - 1);
        setCurrentPage((currentSection - 1) * COUNT_PER_SECTION);
    };

    const onNextSectionClickHandler = () => {
        if (currentSection === totalSection) return;
        setCurrentSection(currentSection + 1);
        setCurrentPage(currentSection * COUNT_PER_SECTION + 1);
    };

    const onPrePageClickHandler = () => {
        if (currentPage <= 1) return;
        if ((currentPage - 1) % COUNT_PER_SECTION === 0) {
            setCurrentSection(currentSection - 1);
        }
        setCurrentPage(currentPage - 1);
    };

    const onNextPageClickHandler = () => {
        if (currentPage === totalPage) return;
        if (currentPage % COUNT_PER_SECTION === 0) {
            setCurrentSection(currentSection + 1);
        }
        setCurrentPage(currentPage + 1);
    };

    const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    };

    //                    effect                    //
    useEffect(() => {
        if (!rentDetailList.length) return;
        changePage(rentDetailList, totalLength);
    }, [currentPage]);
    
    useEffect(() => {
        if (!rentDetailList.length) return;
        changeSection(totalPage);
    }, [currentSection]);

    //                    render                    //
    return (
        <div id='mp-rent-detail-wrapper'>
            {/* {viewList.map(item => <RentDetailItem {...item}/>)} */}
            <div className='mp-rent-detail-table'>
                <div className='mp-rent-detail-content'>
                    <div className='cs-status-primary-button'>대여중</div>
                    <div className='mp-rent-detail-name'>삼성전자 갤럭시북4 울트라</div>
                    <div className='mp-rent-detail-date'>
                        <div className='mp-rent-detail-rent-place'>대여일 : 2024.05.28</div>
                        <div className='mp-rent-detail-return-place'>반납일 : 2024.05.28</div>
                    </div>
                    <div className='mp-rent-detail-table-bottom'>
                        <div className='mp-rent-detail-total-price'>50,000원</div>
                        <div className='mp-rent-detail-page-button'>
                            <div className='mp-rent-detail-rental'>대여상세</div>
                            <div className='mp-rent-detail-next-button'></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mp-rent-detail-table'>
                <div className='mp-rent-detail-content'>
                    <div className='cs-status-disable-button'>반납완료</div>
                    <div className='mp-rent-detail-name'>네오스 짱구는 못말려! 탄광마을의 흰둥이 한글판</div>
                    <div className='mp-rent-detail-date'>
                        <div className='mp-rent-detail-rent-place'>대여일 : 2024.05.28</div>
                        <div className='mp-rent-detail-return-place'>반납일 : 2024.05.28</div>
                    </div>
                    <div className='mp-rent-detail-table-bottom'>
                        <div className='mp-rent-detail-total-price'>10,000원</div>
                        <div className='mp-rent-detail-page-button'>
                            <div className='mp-rent-detail-rental'>대여상세</div>
                            <div className='mp-rent-detail-next-button'></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mp-rent-detail-table'>
                <div className='mp-rent-detail-content'>
                    <div className='cs-status-disable-button'>반납완료</div>
                    <div className='mp-rent-detail-name'>네오스 짱구는 못말려! 탄광마을의 흰둥이 한글판</div>
                    <div className='mp-rent-detail-date'>
                        <div className='mp-rent-detail-rent-place'>대여일 : 2024.05.28</div>
                        <div className='mp-rent-detail-return-place'>반납일 : 2024.05.28</div>
                    </div>
                    <div className='mp-rent-detail-table-bottom'>
                        <div className='mp-rent-detail-total-price'>10,000원</div>
                        <div className='mp-rent-detail-page-button'>
                            <div className='mp-rent-detail-rental'>대여상세</div>
                            <div className='mp-rent-detail-next-button'></div>
                        </div>
                    </div>
                </div>
            </div>
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