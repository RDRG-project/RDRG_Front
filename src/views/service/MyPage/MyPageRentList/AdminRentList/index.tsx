import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import "./style.css";
import { AdminRentItem} from 'src/types';
import { useNavigate } from 'react-router';
import { ADMIN_RENT_LIST_COUNT_PER_PAGE, ADMIN_RENT_LIST_COUNT_PER_SECTION, AUTH_ABSOLUTE_PATH, MYPAGE_DETAILS_ABSOLUTE_PATH, RENT_DETAIL_COUNT_PER_PAGE, RENT_DETAIL_COUNT_PER_SECTION } from 'src/constants';
import ResponseDto from 'src/apis/response.dto';
import { GetAdminRentPageResponseDto} from 'src/apis/payment/dto/response';
import { getAdminRentPageRequest, getAdminSearchWordRequest, patchRentStatusRequest } from 'src/apis/payment';
import { useCookies } from 'react-cookie';
import { useUserStore } from 'src/stores';

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
    const [ cookies ] = useCookies();
    const [ selectedStatus, setSelectedStatus ] = useState(rentStatus);

    //                    effect                 //
    useEffect(() => {
        setSelectedStatus(rentStatus);
    }, [rentStatus]);

    //                    event handler                    //
    const onClickHandler = () => navigator(MYPAGE_DETAILS_ABSOLUTE_PATH(rentNumber));

    const mainName = name[0];
    const additionalCount = name.length - 1;
    const displayName = additionalCount > 0 ? `${mainName} 외 ${additionalCount}건` : mainName;

    const onStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

    const onStatusChangeHandler = async () => {
        if (!cookies.accessToken){
            return;
        }

        try {
            const requestBody = {
                rentStatus : selectedStatus,
            };
        
        const result = await patchRentStatusRequest(cookies.accessToken, rentNumber, requestBody);
        if (result && result.code === 'SU') {
            alert('상태가 변경되었습니다.');
            window.location.reload();
        } else {
            alert ('상태 변경에 실패하였습니다.');
                }
        } catch (error) {
            alert('상태 변경 중 오류가 발생했습니다.');
        }
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
            {rentStatus !== '대여 취소' && (
            <div className='admin-rent-list-status-change'>
                <select value={selectedStatus} onChange={onStatusChange}>
                    <option value = "결제 완료">결제 완료</option>
                    <option value = "대여 중">대여 중</option>
                    <option value = "반납 완료">반납 완료</option>
                    <option value = "대여 취소">대여 취소</option>
                </select>
                <button onClick={onStatusChangeHandler}>적용</button>
            </div>
            )}
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
}

//                    component                    //
export default function AdminRentList () {

    //                    state                    //
    const [cookies] = useCookies();
    const { loginUserRole } = useUserStore();
    
    const [adminRentList, setAdminRentList] = useState<AdminRentItem[]>([]);
    const [viewList, setViewList] = useState<AdminRentItem[]>([]);

    const [totalLength, setTotalLength] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageList, setPageList] = useState<number[]>([1]);
    const [currentSection, setCurrentSection] = useState<number>(1);
    const [totalSection, setTotalSection] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [word, setWord] = useState<string>('');

    //                    function                    //
    const navigator = useNavigate();

    const changePage = (rentList: AdminRentItem[], totalLength: number) => {
        if (!currentPage) return;
        const startIndex = (currentPage - 1) * ADMIN_RENT_LIST_COUNT_PER_PAGE;
        let endIndex = currentPage * ADMIN_RENT_LIST_COUNT_PER_PAGE;
        if (endIndex > totalLength - 1) endIndex = totalLength;
        const viewList = rentList.slice(startIndex, endIndex);
        setViewList(viewList);
    };

    const changeSection = (totalPage: number) => {
        if (!currentSection) return;
        const startPage = (currentSection * ADMIN_RENT_LIST_COUNT_PER_SECTION) - (ADMIN_RENT_LIST_COUNT_PER_SECTION - 1);
        let endPage = currentSection * ADMIN_RENT_LIST_COUNT_PER_SECTION;
        if (endPage > totalPage) endPage = totalPage;
        const pageList: number[] = [];
        for (let page = startPage; page <= endPage; page++) pageList.push(page);
        setPageList(pageList);
    };

    const changeRentList = (rentList: AdminRentItem[]) => {
        if (!rentList || rentList.length === 0) {
            alert('대여 목록을 찾을 수 없습니다.');
            return;
        }

        setAdminRentList(rentList);

        const totalLength = rentList.length;
        setTotalLength(totalLength);

        const totalPage = Math.floor((totalLength - 1) / ADMIN_RENT_LIST_COUNT_PER_PAGE) + 1;
        setTotalPage(totalPage);

        const totalSection = Math.floor((totalPage - 1) / ADMIN_RENT_LIST_COUNT_PER_SECTION) + 1;
        setTotalSection(totalSection);

        changePage(rentList, totalLength);

        changeSection(totalPage);
    };

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
    
    useEffect(() => {
        if (!adminRentList.length) return;
        changePage(adminRentList, totalLength);
    }, [currentPage, adminRentList, totalLength]);
        
    useEffect(() => {
        if (!adminRentList.length) return;
        changeSection(totalPage);
    }, [currentSection, adminRentList.length, totalPage]);

    //                    event handler                    //
    const onPreSectionClickHandler = () => {
        if (currentSection <= 1) return;
        setCurrentSection(currentSection - 1);
        setCurrentPage((currentSection - 1) * ADMIN_RENT_LIST_COUNT_PER_SECTION);
    };
    
    const onNextSectionClickHandler = () => {
        if (currentSection === totalSection) return;
        setCurrentSection(currentSection + 1);
        setCurrentPage(currentSection * ADMIN_RENT_LIST_COUNT_PER_SECTION + 1);
    };
    
    const onPrePageClickHandler = () => {
        if (currentPage <= 1) return;
        if ((currentPage - 1) % ADMIN_RENT_LIST_COUNT_PER_SECTION === 0) {
            setCurrentSection(currentSection - 1);
        }
        setCurrentPage(currentPage - 1);
    };
    
    const onNextPageClickHandler = () => {
        if (currentPage === totalPage) return;
        if (currentPage % ADMIN_RENT_LIST_COUNT_PER_SECTION === 0) {
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
    
        setAdminRentList([]);
        setViewList([]);
        setTotalLength(0);
        setCurrentPage(1);
        setCurrentSection(1);
        setPageList([1]);
        setTotalSection(1);
        setTotalPage(1);
    
        getAdminSearchWordRequest(word, cookies.accessToken).then((result) => {
            console.log("Search Word:", result);
            if (!result) {
                alert('서버에 문제가 있습니다.');
                return;
            }
    
            const { adminRentList } = result as GetAdminRentPageResponseDto;
            
            changeRentList(adminRentList);
    
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
}