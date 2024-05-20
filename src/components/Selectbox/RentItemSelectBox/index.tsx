import React, { useState } from 'react'
import './style.css'
import { DeviceListItem } from 'src/types';

interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function RentSelectBox({ value, onChange }: Prop) {

    const RentItemListItem = [
        { name : '노트북', value: 'noteBook'},
        { name : '태블릿', value: 'tablet'},
        { name : '게임기', value: 'gameIt'},
        { name : '보조배터리', value: 'externalBattery'}
    ];

    //                    state                    //
    const [selectItItem, setSelectItItem] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [deviceList, setDeviceList] = useState<DeviceListItem[]>([]);
    const [notebookState, setNotebookState] = useState<boolean>(false);
    const [tabletState, setTabletState] = useState<boolean>(false);
    const [gameItState, setGameItState] = useState<boolean>(false);
    const [externalBatteryState, setExternalBatteryState] = useState<boolean>(false);

    //                    function                    //
    

    //                    event handler                    //
    const onButtonClickHandler = () => {
        setSelectItItem(!selectItItem);
    };

    const onDeviceButtonClickHandler = () => {
        setDeviceList(deviceList);
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
        <div>
            <div className='select-box'>
                { value === '' ? 
                <div className='select-it-none'>기기 종류</div> :
                <div className='select-it-item'>{name}</div>
                }
                <div className={buttonClass} onClick={onButtonClickHandler}></div>
            </div>
            {selectItItem &&
            <>
            <div>노트북 <button onClick={onNotebookButtonClickHandler}>버튼1</button></div>
            {notebookState &&
            <div>
                <div>노트북1</div>
                <div>노트북2</div>
                <div>노트북3</div>
                <div>노트북4</div>
                {deviceList.filter(item => item.type === 'notebook').map(item => 
                    <div>{item.name}</div>
                )}
            </div>
            }
            
            <div>태블릿 <button onClick={onTabletButtonClickHandler}>버튼2</button></div>
            {tabletState &&
            <div>
                <div>테블릿1</div>
                <div>테블릿2</div>
                <div>테블릿3</div>
                <div>테블릿4</div>
            {deviceList.filter(item => item.type === 'tab').map(item => 
                    <div>{item.name}</div>
                )}
            </div>
            }
            <div>게임기 <button onClick={onGameItButtonClickHandler}>버튼3</button></div>
            {gameItState &&
            <div>
                <div>게임기1</div>
                <div>게임기2</div>
                <div>게임기3</div>
                <div>게임기4</div>
            {deviceList.filter(item => item.type === 'tab').map(item => 
                    <div>{item.name}</div>
                )}
            </div>
            }
            <div>보조배터리 <button onClick={onExternalBatteryButtonClickHandler}>버튼</button></div>
            {externalBatteryState &&
            <div>
                <div>보조배터리1</div>
                <div>보조배터리2</div>
                <div>보조배터리3</div>
                <div>보조배터리4</div>
            {deviceList.filter(item => item.type === 'tab').map(item => 
                    <div>{item.name}</div>
                )}
            </div>
            }
            </>
            }
        </div>
    );
}