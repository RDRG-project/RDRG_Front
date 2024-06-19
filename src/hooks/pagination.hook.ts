import { useEffect, useState } from "react";

const usePagination = <T>(countPerPage : number, countPerSection : number) => {

    //                    state                    //
    const [boardList, setBoardList] = useState<T[]>([]);
    const [viewList, setViewList] = useState<T[]>([]);
    const [totalLength, setTotalLength] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageList, setPageList] = useState<number[]>([1]);
    const [totalSection, setTotalSection] = useState<number>(1);
    const [currentSection, setCurrentSection] = useState<number>(1);

    //                    function                    //
    const changePage = (boardList: T[], totalLength: number) => {
        if (!currentPage) return;
        const startIndex = (currentPage - 1) * countPerPage;
        let endIndex = currentPage * countPerPage;
        if (endIndex > totalLength - 1) endIndex = totalLength;
        const viewList = boardList.slice(startIndex, endIndex);
        setViewList(viewList);
    };

    const changeSection = (totalPage: number) => {
        if (!currentSection) return;
        const startPage = (currentSection * countPerSection) - (countPerSection - 1);
        let endPage = currentSection * countPerSection;
        if (endPage > totalPage) endPage = totalPage;
        const pageList: number[] = [];
        for (let page = startPage; page <= endPage; page++) pageList.push(page);
        setPageList(pageList);
    };

    const changeBoardList = (boardList: T[], isToggleOn?: boolean) => {
        if (isToggleOn) boardList = boardList.filter((board:any) => {
            if ('status' in board) return !board.status;
            return false;
        });
        setBoardList(boardList);

        const totalLength = boardList.length;
        setTotalLength(totalLength);

        const totalPage = Math.floor((totalLength - 1) / countPerPage) + 1;
        setTotalPage(totalPage);

        const totalSection = Math.floor((totalPage - 1) / countPerSection) + 1;
        setTotalSection(totalSection);

        changePage(boardList, totalLength);

        changeSection(totalPage);
    };

    //                    event handler                    //
    const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    };

    const onPreSectionClickHandler = () => {
        if (currentSection <= 1) return;
        setCurrentSection(currentSection - 1);
        setCurrentPage((currentSection - 1) * countPerSection);
    };

    const onNextSectionClickHandler = () => {
        if (currentSection === totalSection) return;
        setCurrentSection(currentSection + 1);
        setCurrentPage(currentSection * countPerSection + 1);
    };

    const onNextPageClickHandler = () => {
        if (currentPage === totalPage) return;
        if (currentPage % countPerSection === 0) {
            setCurrentSection(currentSection + 1);
        }
        setCurrentPage(currentPage + 1);
    }

    const onPrePageClickHandler = () => {
        if (currentPage <= 1) return;
        if ((currentPage - 1) % countPerSection === 0) {
            setCurrentSection(currentSection - 1);
        }
        setCurrentPage(currentPage - 1);
    }

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
    return{
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
    }
};

export default usePagination;