import { useState } from "react";
import './style.css'
import { useBasketStore } from "src/stores/idex";

interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function ReturnSiteSelectBox({ value, onChange }: Prop) {

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
            <div className='select-item'>반납지점</div>
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