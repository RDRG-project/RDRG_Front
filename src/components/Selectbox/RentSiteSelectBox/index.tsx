import React, { useEffect } from 'react';
import './style.css';
import { useRentStore } from 'src/stores';

const RentSiteListItem = [
    { name: '서울', value: '서울' },
    { name: '부산', value: '부산' }
];

//                    interface                    //
interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function RentSiteSelectBox({ value, onChange }: Prop) {

    //                    state                    //
    const { rentShow, setRentShow, rentSelectedItem, setRentSelectedItem, setRentSite } = useRentStore();

    //                    event handler                    //
    const onItemClickHandler = (itemValue: string) => {
        setRentSelectedItem(itemValue);
        setRentSite(itemValue);
        onChange(itemValue);
    };

    const onButtonClickHandler = () => {
        setRentShow(!rentShow);
    };

    //                    effect                    //
    useEffect(() => {
        setRentSelectedItem(value || '');
    }, [value]);

    //                    render                    //
    return (
        <div id='rent-select-wrapper'>
            <div className='select-box-container'>
                <div className='select-item-title'>대여지점</div>
                <div className={rentShow ? 'spot-close-button' : 'spot-open-button'} onClick={onButtonClickHandler}></div>
            </div>
            {rentShow &&
                <div className='select-list'>
                    {RentSiteListItem.map((item) =>
                        <div 
                            key={item.value}
                            className={rentSelectedItem === item.value ? 'select-list-item-selected' : 'select-list-item-box'}
                            onClick={() => onItemClickHandler(item.value)}>
                            <div className='select-item'>{item.name}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}
