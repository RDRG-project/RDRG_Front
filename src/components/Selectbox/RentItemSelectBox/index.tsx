import React, { useEffect, useState } from 'react'
import './style.css'
import { useBasketStore, useRentDateStore, useRentItemStore } from 'src/stores/index';
import { DeviceListItem, ItRentList } from 'src/types';
import { useNavigate } from 'react-router';
import { GetDeviceListResponseDto } from 'src/apis/device/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { useCookies } from 'react-cookie';
import { AUTH_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH } from 'src/constants';
import { getRentPossibilityListRequest } from 'src/apis/device';
import { dateFormat } from 'src/utils';

// 예시 items
// const items: ItRentList[] = [
//     { serialNumber: '1', model: 'aaaaaa', type: '노트북',brand:'삼성전자', name: '삼성노트북', price: 100000, deviceExplain: '이것은 삼성 노트북', devicesImgUrl:'1231qweqweadasczx'},
//     { serialNumber: '2', model: 'bbbbbb', type: '노트북',brand:'애플', name: '맥북', price: 20000, deviceExplain: '이것은 애플 맥북', devicesImgUrl:'1231qweqweadasczx'},
//     { serialNumber: '3', model: 'cccccc', type: '노트북',brand:'LG전자', name: 'LG그램', price: 15000, deviceExplain: '이것은 LG그램', devicesImgUrl:'1231qweqweadasczx'},
//     { serialNumber: '4', model: 'dddddd', type: '태블릿',brand:'삼성전자', name: '갤럭시탭', price: 8000, deviceExplain: '이것은 삼성 갤럭시탭', devicesImgUrl:'1231qweqweadasczx'},
//     { serialNumber: '5', model: 'eeeeee', type: '태블릿',brand:'애플', name: '아이패드', price: 8000, deviceExplain: '이것은 애플 아이패드', devicesImgUrl:'1231qweqweadasczx'},
//     { serialNumber: '6', model: 'ffffff', type: '태블릿',brand:'레노버', name: '레노버머시기', price: 5000, deviceExplain: '이것은 레노버 태블릿', devicesImgUrl:'1231qweqweadasczx'},
//     { serialNumber: '7', model: 'gggggg', type: '게임기',brand:'닌텐도', name: '스위치', price: 10000, deviceExplain: '이것은 닌텐도 스위치', devicesImgUrl:'1231qweqweadasczx'},
//     { serialNumber: '8', model: 'hhhhhh', type: '게임기',brand:'소니', name: '플레이스테이션', price: 20000, deviceExplain: '이것은 플레이스테이션', devicesImgUrl:'1231qweqweadasczx'},
//     { serialNumber: '9', model: 'iiiiii', type: '게임기',brand:'MS', name: 'Xbox', price: 15000, deviceExplain: '이것은 Xbox', devicesImgUrl:'1231qweqweadasczx'}
// ];


//                    component                    //
function RentItem ({  
    model, 
    type, 
    brand, 
    name, 
    price,
    deviceExplain,
    devicesImgUrl
}: ItRentList) {

    //                    function                    //
    

    //                    event handler                    //

    //                    render                    //
    return (
        <div className='device-box' > 
            <div className='device-box-left'>
                {/* <div className='device-image'>{devicesImgUrl}</div> */}
                <div className='device-brand'>{brand}</div>
            </div>
            <div className='device-box-middle'>
                <div className='device-detail'>
                    <div className='device-detail-title'>{name}</div>
                    {/* <div className='device-detail-explain'>{deviceExplain}~</div> */}
                </div>
            </div>
            <div className='device-box-right'>
                <div className='device-price'>{price}</div>
            </div>
        </div>
    );
}


//                    interface                    //
interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function RentSelectBox({ value, onChange }: Prop) {
    const navigator = useNavigate();

    //                    state                    //

    const [cookies] = useCookies();
    const [selectListItItem, setSelectListItItem] = useState<boolean>(false);
    const [notebookState, setNotebookState] = useState<boolean>(false);
    const [tabletState, setTabletState] = useState<boolean>(false);
    const [gameItState, setGameItState] = useState<boolean>(false);
    const [externalBatteryState, setExternalBatteryState] = useState<boolean>(false);

    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();

    const { startDate, endDate } = useRentDateStore()

    const [selectNoteBook, setSelectNoteBook] = useState<string>('');
    const [selectTable, setSelectTablet] = useState<string>('');
    const [selectGame, setSelectGame] = useState<string>('');
    const [selectBattery, setSelectBattery] = useState<string>('');

    const [rentViewList, setRentViewList] = useState<ItRentList[]>([]);

    //                    function                    //

    const getDeviceListResponse = (result: GetDeviceListResponseDto | ResponseDto | null) => {

        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '유효하지 않은 정보입니다.' : 
            result.code === 'AF' ? '권한이 없습니다123.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(HOME_ABSOLUTE_PATH);
            return;
        }

        const { deviceList } = result as GetDeviceListResponseDto;
        setRentViewList(deviceList);


    };
    
    //                    event handler                    //
    const onButtonClickHandler = () => {
        setSelectListItItem(!selectListItItem);
    };

    const addItemButtonClickHandler = (item: DeviceListItem) => {
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

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken) return;
        if (!startDate || !endDate) return;
        const start = dateFormat(startDate);
        console.log(start);
        const end = dateFormat(endDate);
        getRentPossibilityListRequest(start, end, cookies.accessToken).then(getDeviceListResponse);
    }, [startDate, endDate]);


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
            <div className='type-notebook' onClick={onNotebookButtonClickHandler}>노트북</div>
            {notebookState &&
            <div className='type-notebook-detail'>
                {rentViewList.filter(item => item.type === '노트북').map(item => <RentItem {...item} />)}
            </div>
            }
            <div className='type-tablet' onClick={onTabletButtonClickHandler}>태블릿</div>
            {/* {tabletState &&
            <div>
                {items.filter(item => item.type === '태블릿').map(item => 
                    <div key={item.serialNumber}>
                        {item.name} - {item.price.toLocaleString()}원
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                )}
            </div>
            } */}
            <div className='type-game' onClick={onGameItButtonClickHandler}>게임기</div>
            {gameItState &&
            <div>
                {/* {items.filter(item => item.type === '게임기').map(item => 
                    <div key={item.serialNumber}>
                        {item.name} - {item.price.toLocaleString()}원
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                )} */}
            </div>
            }
            <div className='type-external-battery' onClick={onExternalBatteryButtonClickHandler}>보조배터리</div>
            {externalBatteryState &&
            <div>
                
                {/* {items.filter(item => item.type === '보조배터리').map(item => 
                    <div key={item.serialNumber}>
                        {item.name} - {item.price.toLocaleString()}원
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                )} */}
            </div>
            }
            </>
            }
        </div>
    );
}