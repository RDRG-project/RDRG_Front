import React, { useState } from 'react'
import './style.css'

interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function RentSiteSelectBox({ value, onChange }: Prop) {

    const RentSiteListItem = [
        { name : '서울', value: 'SEOUL'},
        { name : '부산', value: 'BUSAN'}
    ];

    //                    state                    //
    const [show, setShow] = useState<boolean>(false);
    const [name, setName] = useState<string>('');

    //                    event handler                    //
    const onButtonClickHandler = () => {
        setShow(!show);
    };
    // 요소를 선택하면 색깔이 바뀌고 db에 대여장소를 저장하게 해야함 아래코드는 수정해야함
    const onItemClickHandler = () => {
        RentSiteListItem.forEach(item => {
            if (item.value === value) setName(item.name);
        })
        onChange(value);
        setShow(true);
    };

    //                    render                    //
    const buttonClass = show ? 'select-close-button' : 'select-open-button';
    return (
        <div className='select-box'>
            <div className='select-item-title'>대여지점</div>
            <div className={buttonClass} onClick={onButtonClickHandler}></div>
            {show && 
            <div className='select-list'>
                {RentSiteListItem.map((item) => 
                <div className='select-list-item-box' onClick={onItemClickHandler}>
                    <div className='select-item'>{item.name}</div>
                </div>
                )}
            </div>
            }
        </div>
    );
}
