import React, { useState } from 'react'
import './style.css'
import { useBasketStore, useRentItemStore } from 'src/stores/index';
import { ItRentList } from 'src/types';


// 예시 items
const items: ItRentList[] = [
    { serialNumber: 'qwer1', type: '노트북', name: '삼성노트북', price: 500000 },
    { serialNumber: 'qwer2', type: '노트북', name: 'LG노트북', price: 500000 },
    { serialNumber: 'qwer3', type: '노트북', name: '맥프로', price: 500000 },
    { serialNumber: 'asdf1', type: '태블릿', name: '아이패드', price: 300000 },
    { serialNumber: 'asdf2', type: '태블릿', name: '갤럭시탭', price: 300000 },
    { serialNumber: 'asdf3', type: '태블릿', name: '레노버', price: 300000 },
    { serialNumber: 'zxc1', type: '게임기', name: '스위치', price: 200000 },
    { serialNumber: 'zxc2', type: '게임기', name: '플레이스테이션', price: 200000 },
    { serialNumber: 'zxc3', type: '게임기', name: '디지몬 벽돌', price: 200000 },
    { serialNumber: 'poi1', type: '보조배터리', name: '샤오미배터리',price: 100000 },
    { serialNumber: 'poi2', type: '보조배터리', name: '삼성보조배터리',price: 100000 }
];


//                    interface                    //
interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function RentSelectBox({ value, onChange }: Prop) {

    //                    state                    //
    const [selectListItItem, setSelectListItItem] = useState<boolean>(false);
    const [notebookState, setNotebookState] = useState<boolean>(false);
    const [tabletState, setTabletState] = useState<boolean>(false);
    const [gameItState, setGameItState] = useState<boolean>(false);
    const [externalBatteryState, setExternalBatteryState] = useState<boolean>(false);

    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();

    //                    event handler                    //
    const onButtonClickHandler = () => {
        setSelectListItItem(!selectListItItem);
    };

    const addItemButtonClickHandler = (item: ItRentList) => {
        setBasketItems([...basketItems, item]);
        setTotalAmount(totalAmount + item.price);
    };

    const onNotebookButtonClickHandler = () => {
        setNotebookState(!notebookState);
    };

    const onTabletButtonClickHandler = () => {
        setTabletState(!tabletState);
    };

    const onGameItButtonClickHandler = () => {
        setGameItState(!gameItState);
    };

    const onExternalBatteryButtonClickHandler = () => {
        setExternalBatteryState(!externalBatteryState);
    };

    //                    render                    //
    const buttonClass = selectListItItem ? 'select-close-button' : 'select-open-button';
    return (
        <div id='select-type-wrapper'>
            <div className='select-it-box'>
                {value === '' ? 
                    <div className='select-it-none'>Device Type</div> :
                    <div className='select-it-item'>{value}</div>
                }
                <div className={buttonClass} onClick={onButtonClickHandler}></div>
            </div>
            {selectListItItem &&
            <>
            <div className='type-notebook' onClick={onNotebookButtonClickHandler}>Note Book</div>
            {notebookState &&
            <div>
                {items.filter(item => item.type === '노트북').map(item => 
                    <div key={item.serialNumber}>
                        {item.name} - {item.price.toLocaleString()}원
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                )}
            </div>
            }
            <div className='type-tablet' onClick={onTabletButtonClickHandler}>Tablet</div>
            {tabletState &&
            <div>
                {items.filter(item => item.type === '태블릿').map(item => 
                    <div key={item.serialNumber}>
                        {item.name} - {item.price.toLocaleString()}원
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                )}
            </div>
            }
            <div className='type-game' onClick={onGameItButtonClickHandler}>Game</div>
            {gameItState &&
            <div>
                {items.filter(item => item.type === '게임기').map(item => 
                    <div key={item.serialNumber}>
                        {item.name} - {item.price.toLocaleString()}원
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                )}
            </div>
            }
            <div className='type-external-battery' onClick={onExternalBatteryButtonClickHandler}>Battery</div>
            {externalBatteryState &&
            <div>
                {items.filter(item => item.type === '보조배터리').map(item => 
                    <div key={item.serialNumber}>
                        {item.name} - {item.price.toLocaleString()}원
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                )}
            </div>
            }
            </>
            }
        </div>
    );
}