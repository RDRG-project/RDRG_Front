import React, { useState } from 'react'
import './style.css'

interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function RentSelectBox({ value, onChange }: Prop) {

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
    const onItemClickHandler = (value: string) => {
        RentItemListItem.forEach(item => {
            if (item.value === value) setName(item.name);
        })
        onChange(value);
        setSelectItItem(false);
    };

    //                    render                    //
    const buttonClass = selectItItem ? 'select-close-button' : 'select-open-button';
    return (
        <div className='select-box'>
            { value === '' ? 
            <div className='select-none'></div> :
            <div className='select-item'>{name}</div>
            }
            <div className={buttonClass} onClick={onButtonClickHandler}></div>
            {selectItItem && 
            <div className='select-list'>
                {RentItemListItem.map((item) => 
                <div className='select-list-item-box' onClick={() => onItemClickHandler(item.value)}>
                    <div className='select-item'>{item.name}</div>
                </div>
                )}
            </div>
            }
        </div>
    );
}
