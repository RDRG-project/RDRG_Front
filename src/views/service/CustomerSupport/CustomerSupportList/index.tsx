import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

import useUserStore from 'src/stores/user.store';

import { usePagination } from 'src/hooks';

import { BoardListItem } from 'src/types';

import ResponseDto from 'src/apis/response.dto';
import { getBoardListRequest } from 'src/apis/board';
import { GetBoardListResponseDto } from 'src/apis/board/dto/response';

import { AUTH_ABSOLUTE_PATH, COUNT_PER_PAGE, COUNT_PER_SECTION, CUSTOMER_SUPPORT_DETAIL_ABSOLUTE_PATH, CUSTOMER_SUPPORT_WRITE_ABSOLUTE_PATH } from 'src/constants';

import './style.css'

//                    component                    //
function ListItem ({ 
    receptionNumber, 
    status, 
    title, 
    writerId, 
    writeDatetime,  
}: BoardListItem) {

    //                    function                    //
    const navigator = useNavigate();

    //                    event handler                    //
    const onClickHandler = () => navigator(CUSTOMER_SUPPORT_DETAIL_ABSOLUTE_PATH(receptionNumber));

    //                    render                    //
    return (
        <div className='cs-list-table-tr' onClick={onClickHandler}>
            <div className='cs-list-table-reception-number'>{receptionNumber}</div>
            <div className='cs-list-table-status'>
                {status ? 
                <div className='cs-status-disable-button'>완료</div> :
                <div className='cs-status-primary-button'>접수</div>
                }
            </div>
            <div className='cs-list-table-title' style={{ textAlign: 'left' }}>{title}</div>
            <div className='cs-list-table-writer-id'>{writerId}</div>
            <div className='cs-list-table-write-date'>{writeDatetime}</div>
        </div>
    );
};


//                    component                    //
export default function CustomerSupportList() {

    //                    state                    //
    const [cookies] = useCookies();

    const {loginUserRole} = useUserStore();

    const [isToggleOn, setToggleOn] = useState<boolean>(false);
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
    } = usePagination<BoardListItem>(COUNT_PER_PAGE, COUNT_PER_SECTION);

    //                    function                    //
    const navigator = useNavigate();

    const getBoardListResponse = (result: GetBoardListResponseDto | ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' : 
            result.code === 'AF' ? '권한이 없습니다.' : 
            result.code === 'FUF' ? '파일 업로드에 실패했습니다.' : 
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(AUTH_ABSOLUTE_PATH);
            return;
        }

        const { boardList } = result as GetBoardListResponseDto;

        changeBoardList(boardList, isToggleOn);
        setCurrentPage(!boardList.length ? 0 : 1);
        setCurrentSection(!boardList.length ? 0 : 1);
    };

    //                    event handler                    //
    const onWriteButtonClickHandler = () => {
        if (loginUserRole !== 'ROLE_USER') return;
        navigator(CUSTOMER_SUPPORT_WRITE_ABSOLUTE_PATH);
    };

    const onToggleClickHandler = () => {
        if (loginUserRole !== 'ROLE_ADMIN') return;
        setToggleOn(!isToggleOn);
    };

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken) return;
        getBoardListRequest(cookies.accessToken).then(getBoardListResponse);
    }, [isToggleOn]);

    //                    render                    //
    const toggleClass = isToggleOn ? 'toggle-active' : 'toggle';

    return (
        <div id='cs-wrapper'>
            <div className='cs-image'>문의게시판</div>
            <div className= 'cs-list-wrapper'>
                <div className='cs-list-top'>
                    {loginUserRole === 'ROLE_USER' ?
                    <div className='customer-support-button' onClick={onWriteButtonClickHandler}>글쓰기</div> :
                    <div className='cs-list-top-admin-container'>
                        <div className={toggleClass} onClick={onToggleClickHandler}></div>
                        <div className='cs-list-top-admin-text'>미완료 보기</div>
                    </div>
                    }
                </div>
                <div className='cs-list-table'>
                    <div className='cs-list-table-th'>
                        <div className='cs-list-table-reception-number'>접수번호</div>
                        <div className='cs-list-table-status'>상태</div>
                        <div className='cs-list-title'>제목</div>
                        <div className='cs-list-table-writer-id'>작성자</div>
                        <div className='cs-list-table-write-date'>작성일</div>
                    </div>
                    {viewList.map(item => <ListItem {...item} />)}
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
        </div>
    );
};