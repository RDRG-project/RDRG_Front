import React, { useState } from 'react'
import './style.css'

const typeList = [
    { name : '노트북', type: '노트북' },
    { name : '태블릿', type: '태블릿' },
    { name : '게임기', type: '게임기' },
    { name : '보조배터리', type: '보조배터리' }
];

//                    interface                    //
interface Prop {
    type: string;
    onChange: (type: string) => void;
}

//                    component                    //
export default function TypeSelectBox({ type, onChange }: Prop) {
    
    //                    state                    //
    const [show, setShow] = useState<boolean>(false);
    const [name, setName] = useState<string>('');

    //                    event handler                    //
    const onBoxClickHandler = () => {
        setShow(!show);
    };

    const onItemClickHandler = (type: string) => {
        typeList.forEach(item => {
            if (item.type === type) setName(item.name);
        })
        onChange(type);
        setShow(false);
    };

    //                    render                    //
    return (
        <div className='type-select-box'>
            <div className='type-select-none' onClick={onBoxClickHandler}>
                {type === '' ? '기기 종류' : name}
            </div>
            {show &&
                <div className='type-select-list'>
                    {typeList.map((item) =>
                        <div key={item.type} className='type-select-list-item-box' onClick={() => onItemClickHandler(item.type)}>
                            <div className='type-select-item'>{item.name}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}
