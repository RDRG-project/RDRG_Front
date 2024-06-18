import React, { useState } from 'react'
import './style.css'

//                    interface                    //
interface Prop {
    place: string;
    onChange: (type: string) => void;
}

//                    component                    //
export default function PlaceSelectBox({ place, onChange }: Prop) {

    const placeList = [
        { name : '서울', place: '서울' },
        { name : '부산', place: '부산' }
    ];
    
    //                    state                    //
    const [show, setShow] = useState<boolean>(false);
    const [name, setName] = useState<string>('');

    //                    event handler                    //
    const onBoxClickHandler = () => {
        setShow(!show);
    };

    const onItemClickHandler = (place: string) => {
        placeList.forEach(item => {
            if (item.place === place) setName(item.name);
        })
        onChange(place);
        setShow(false);
    };

    //                    render                    //
    return (
        <div className='type-select-box'>
            <div className='type-select-none' onClick={onBoxClickHandler}>
                {place === '' ? '장소' : name}
            </div>
            {show &&
                <div className='type-select-list'>
                    {placeList.map((item) =>
                        <div key={item.place} className='type-select-list-item-box' onClick={() => onItemClickHandler(item.place)}>
                            <div className='type-select-item'>{item.name}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}
