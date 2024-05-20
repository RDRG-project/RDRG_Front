import React, { useState } from 'react'
import './style.css'

interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function RentItSelectBox({ value }: Prop) {

    const RentItemListItem = [
        { name : '노트북', value: 'noteBook'},
        { name : '태블릿', value: 'tablet'},
        { name : '게임기', value: 'game'},
        { name : '보조배터리', value: 'externalBattery'}
    ];


    //                    state                    //
    const [selectItItem, setSelectItItem] = useState<boolean>(false);
    const [name, setName] = useState<string>('');

    //                    event handler                    //
    const onButtonClickHandler = () => {
        setSelectItItem(!selectItItem);
    };
    

    //                    render                    //
    const buttonClass = selectItItem ? 'select-close-button' : 'select-open-button';
    return (
        <div className='select-it-box'>
            { value === '' ? 
            <div className='select-it-none'>기기선택</div> :
            <div className='select-it-item'>{name}</div>
            }
            <div className='select-it-variety' onClick={onButtonClickHandler}></div>
            <div className='select-it-list'></div>
        </div>
    );
}