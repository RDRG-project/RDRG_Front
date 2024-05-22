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
    const [selectListItItem, setSelectListItItem] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [deviceList, setDeviceList] = useState<DeviceListItem[]>([]);
    const [notebookState, setNotebookState] = useState<boolean>(false);
    const [tabletState, setTabletState] = useState<boolean>(false);
    const [gameItState, setGameItState] = useState<boolean>(false);
    const [externalBatteryState, setExternalBatteryState] = useState<boolean>(false);

    //                    function                    //
    

    //                    event handler                    //
    const onButtonClickHandler = () => {
        setSelectListItItem(!selectListItItem);
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

    //                    render                    //
    const buttonClass = selectListItItem ? 'select-close-button' : 'select-open-button';
    return (
        <div id='select-type-wrapper'>
            <div className='select-it-box'>
                { value === '' ? 
                <div className='select-it-none'>Device Type</div> :
                <div className='select-it-item'>{name}</div>
                }
                <div className={buttonClass} onClick={onButtonClickHandler}></div>
            </div>
            {selectListItItem &&
            <>
            <div className='type-notebook' onClick={onNotebookButtonClickHandler}>Note Book</div>
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
            
            <div className='type-tablet' onClick={onTabletButtonClickHandler}>Tablet</div>
            {tabletState &&
            <div>
                <div>테블릿1</div>
                <div>테블릿2</div>
                <div>테블릿3</div>
                <div>테블릿4</div>
                {deviceList.filter(item => item.type === 'tablet').map(item => 
                    <div>{item.name}</div>
                )}
            </div>
            }
            <div className='type-game' onClick={onGameItButtonClickHandler}>Game</div>
            {gameItState &&
            <div>
                <div>게임기1</div>
                <div>게임기2</div>
                <div>게임기3</div>
                <div>게임기4</div>
                {deviceList.filter(item => item.type === 'gameIt').map(item => 
                    <div>{item.name}</div>
                )}
            </div>
            }
            <div className='type-external-battery' onClick={onExternalBatteryButtonClickHandler}>Battery</div>
            {externalBatteryState &&
            <div>
                <div>보조배터리1</div>
                <div>보조배터리2</div>
                <div>보조배터리3</div>
                <div>보조배터리4</div>
                {deviceList.filter(item => item.type === 'externalBattery').map(item => 
                    <div>{item.name}</div>
                )}
            </div>
            }
            </>
            }
        </div>
    );
}