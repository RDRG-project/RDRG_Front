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

    //                    event handler                    //
    const onButtonClickHandler = () => {
        setShow(!show);
    };

    const onItemClickHandler = (itemValue: string) => {
        setSelectedItem(itemValue);
        setRentSite(itemValue);
        onChange(itemValue);
        setShow(true);
    };

    //                    effect                    //
    useEffect(() => {
    setSelectedItem(value || ''); // value 값이 존재하지 않을 때를 대비하여 빈 문자열("")을 사용합니다.
}, [value]);
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


