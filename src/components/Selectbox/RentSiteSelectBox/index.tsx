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
    const onItemClickHandler = (value: string) => {
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
            {/* { value === '' ?  */}
            {/* <div className='select-none'></div> : */}
            <div className='select-item'>{name}</div>
            {/* }   */}
            <div className={buttonClass} onClick={onButtonClickHandler}></div>
            {show && 
            <div className='select-list'>
                {RentSiteListItem.map((item) => 
                <div className='select-list-item-box' onClick={() => onItemClickHandler(item.value)}>
                    <div className='select-item'>{item.name}</div>
                </div>
                )}
            </div>
            }
        </div>
    );
}
