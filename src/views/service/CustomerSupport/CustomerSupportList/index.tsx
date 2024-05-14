import React, { useState } from 'react'
import './style.css'

//                    component                    //
export default function CustomerSupportList() {
    //                    state                    //

    const [isToggleOn, setToggleOn] = useState<boolean>(false);

    //                    render                    //
    const toggleClass = isToggleOn ? 'toggle-active' : 'toggle';
    return (
        <div id= 'cs-list-wrapper'>
            <div className='cs-list-top'>
                <div className='cs-list-size-text'>전체 <span className='emphasis'>건</span> | 페이지 <span className='emphasis'>/</span></div>
                <div className='cs-list-top-right'>
                    <div className='primary-button'>글쓰기</div> :
                    <>
                    <div className={toggleClass} ></div>
                    <div className='cs-list-top-admin-text'>미완료 보기</div>
                    </>
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
            </div>
            
            <div className='cs-list-bottom'>
                <div></div>
                <div className='cs-list-pagination'>
                    <div className='cs-list-page-left'></div>
                    <div className='cs-list-page-box'></div>
                    <div className='cs-list-page-right'></div>
                </div>
            </div>

        </div>
    );
}
