import React, { useEffect, useState } from 'react'
import './style.css'
import { BoardListItem } from 'src/types';
import { useNavigate } from 'react-router';
import { COUNT_PER_PAGE, COUNT_PER_SECTION, CUSTOMER_SUPPORT_DETAIL_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH } from 'src/constants';
import useUserStore from 'src/stores/user.store';
import { useCookies } from 'react-cookie';
import { GetSearchBoardListResponseDto } from 'src/apis/board/dto/response';
import ResponseDto from 'src/apis/response.dto';

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
                <div className='disable-badge'>완료</div> :
                <div className='primary-badge'>접수</div>
                }
            </div>
            <div className='cs-list-table-title' style={{ textAlign: 'left' }}>{title}</div>
            <div className='cs-list-table-writer-id'>{writerId}</div>
            <div className='cs-list-table-write-date'>{writeDatetime}</div>
        </div>
    );
}


//                    component                    //
export default function CustomerSupportList() {
    //                    state                    //
    const {loginUserRole} = useUserStore();

    const [cookies] = useCookies();

    const [boardList, setBoardList] = useState<BoardListItem[]>([]);
    const [viewList, setViewList] = useState<BoardListItem[]>([]);
    const [totalLength, setTotalLength] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageList, setPageList] = useState<number[]>([1]);
    const [totalSection, setTotalSection] = useState<number>(1);
    const [currentSection, setCurrentSection] = useState<number>(1);
    const [isToggleOn, setToggleOn] = useState<boolean>(false);

    const [searchWord, setSearchWord] = useState<string>('');

    //                    function                    //
    const navigator = useNavigate();

    const changePage = (boardList: BoardListItem[], totalLength: number) => {
        if (!currentPage) return;
        const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
        let endIndex = currentPage * COUNT_PER_PAGE;
        if (endIndex > totalLength - 1) endIndex = totalLength;
        const viewList = boardList.slice(startIndex,endIndex);
        setViewList(viewList);
    }

    const changeSection = (totalPage: number) => {
        if (!currentSection) return;
        const startPage = (currentSection * COUNT_PER_SECTION) - (COUNT_PER_SECTION - 1);
        let endPage = currentSection * COUNT_PER_SECTION;
        if (endPage > totalPage) endPage = totalPage;
        const pageList: number[] = [];
        for (let page = startPage; page <= endPage; page++) pageList.push(page);
        setPageList(pageList);
    };

    const changeBoardList = (boardList: BoardListItem[]) => {
        if (isToggleOn) boardList = boardList.filter(board => !board.status);
        setBoardList(boardList);

        const totalLength = boardList.length;
        setTotalLength(totalLength);

        const totalPage = Math.floor((totalLength - 1) / COUNT_PER_PAGE) + 1;
        setTotalPage(totalPage);

        const totalSection = Math.floor((totalPage - 1) / COUNT_PER_SECTION) + 1;
        setTotalSection(totalSection);

        changePage(boardList, totalLength);

        changeSection(totalPage);
    };

    const getSearchBoardListResponse = (result: GetSearchBoardListResponseDto | ResponseDto | null) => {

        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '검색어를 입력하세요.' : 
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(HOME_ABSOLUTE_PATH);
            return;
        }

        const { boardList } = result as GetSearchBoardListResponseDto;
        changeBoardList(boardList);
        
        setCurrentPage(!boardList.length ? 0 : 1);
        setCurrentSection(!boardList.length ? 0 : 1);
    };
    //                    event handler                    //
    const onWriteButtonClickHandler = () => {
        if (loginUserRole !== 'ROLE_USER') return alert('로그인 해주세요');
        navigator(HOME_ABSOLUTE_PATH);
    };
    
    const onToggleClickHandler = () => {
        if (loginUserRole !== 'ROLE_ADMIN') return alert('권한이 없습니다.');
        setToggleOn(!isToggleOn);
    };

    const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    } 
    
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

    //                    effect                    //
    useEffect(() => {
        if (!boardList.length) return;
        changePage(boardList, totalLength);
    }, [currentPage]);

    useEffect(() => {
        if (!boardList.length) return;
        changeSection(totalPage);
    }, [currentSection]);

    //                    render                    //
    const toggleClass = isToggleOn ? 'toggle-active' : 'toggle';
    return (
        <div id= 'cs-list-wrapper'>
            <div className='cs-list-top'>
                <div className='cs-list-size-text'>전체 <span className='emphasis'>건</span> | 페이지 <span className='emphasis'>/</span></div>
                <div className='cs-list-top-right'>
                    {loginUserRole === 'ROLE_USER' ?
                    <div className='primary-button' onClick={onWriteButtonClickHandler}>글쓰기</div> :
                    <>
                    <div className={toggleClass} onClick={onToggleClickHandler}></div>
                    <div className='cs-list-top-admin-text'>미완료 보기</div>
                    </>
                    }
                </div>
            </div>
            <div className='cs-list-table'>
                <div className='cs-list-table-th'>
                    <div className='cs-list-table-reception-number'>접수번호</div>
                    <div className='cs-list-table-status'>상태</div>
                    <div className='cs-list-table-title'>제목</div>
                    <div className='cs-list-table-writer-id'>작성자</div>
                    <div className='cs-list-table-write-date'>작성일</div>
                </div>
                {viewList.map(item => <ListItem {...item} />)}
            </div>
            <div className='cs-list-bottom'>
                <div></div>
                <div className='cs-list-pagination'>
                    <div className='cs-list-page-left' onClick={onPreSectionClickHandler}></div>
                    <div className='cs-list-page-box'>
                        {pageList.map(page => page === currentPage ? <div className='cs-list-page-active'>{page}</div> : 
                        <div className='cs-list-page' onClick={() => onPageClickHandler(page)}>{page}</div>
                        )}
                    </div>
                    <div className='cs-list-page-right' onClick={onNextSectionClickHandler}></div>
                </div>
            </div>

        </div>
    );
}
