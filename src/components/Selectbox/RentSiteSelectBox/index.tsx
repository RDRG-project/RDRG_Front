import React, { useEffect, useState } from 'react'
import './style.css'
import { useRentSiteStore, useReturnSiteStore } from 'src/stores';

//                    interface                    //
interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function RentSiteSelectBox({ value, onChange }: Prop) {
    const RentSiteListItem = [
        { name: '서울', value: 'SEOUL' },
        { name: '부산', value: 'BUSAN' }
    ];

    //                    state                    //
    const [show, setShow] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<string>('');

    const { setRentSite } = useRentSiteStore();

    const onButtonClickHandler = () => {
        setShow(!show);
    };

    //                    event handler                    //
    const onItemClickHandler = (itemValue: string) => {
        setSelectedItem(itemValue);
        setRentSite(itemValue);
        onChange(itemValue);
        setShow(true);
    };

    //                    render                    //
    return (
        <div className='select-box'>
            <div className='select-item-title'>대여지점</div>
            <div className={show ? 'select-close-button' : 'select-open-button'} onClick={onButtonClickHandler}></div>
            {show &&
                <div className='select-list'>
                    {RentSiteListItem.map((item) =>
                        <div
                            key={item.value}
                            className={selectedItem === item.value ? 'select-list-item-selected' : 'select-list-item-box'}
                            onClick={() => onItemClickHandler(item.value)}>
                            <div className='select-item'>{item.name}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}
