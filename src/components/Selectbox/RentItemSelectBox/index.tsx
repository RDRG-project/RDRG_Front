import React, { useEffect, useState } from 'react';
import './style.css';
import { useBasketStore, useBatteryStore, useNoteBookStore, useRentDateStore, useRentItemStore, useRentListStore, useRentSiteStore, useReturnSiteStore, useTabletStore, useUserStore } from 'src/stores/index';
import { DeviceListItem, ItRentList } from 'src/types';
import { useNavigate } from 'react-router';
import { GetDeviceListResponseDto } from 'src/apis/device/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { useCookies } from 'react-cookie';
import { AUTH_ABSOLUTE_PATH, HOME_ABSOLUTE_PATH } from 'src/constants';
import { getRentPossibilityListRequest } from 'src/apis/device';
import { dateFormat } from 'src/utils';
import useGameItStore from 'src/stores/gameIt.store';

interface Prop {
    value: string;
    onChange: (value: string) => void;
}

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
    const [isExplainFullVisible, setIsExplainFullVisible] = useState(false);

    //                    event handler                    //
    const handleExplainClick = () => {
        setIsExplainFullVisible(!isExplainFullVisible);
    };

    //                    render                    //
    return (
        <div className='device-box'>
            <div className='device-box-left'>
                <img className='device-image' src={devicesImgUrl} alt={`${name} 이미지`} />
            </div>
            <div className='device-box-middle'>
                <div className='device-detail'>
                    <div className='device-detail-title'>{name}</div>
                    <div className='device-detail-explain' onClick={handleExplainClick}>
                        {deviceExplain}
                    </div>
                    {isExplainFullVisible && (
                        <div className='device-detail-explain-full'>
                            <div className='explain-title'>상품정보</div>
                            <div>{deviceExplain}</div>
                        </div>
                    )}
                </div>
            </div>
            <div className='device-box-right'>
                <div className='device-price'>{price.toLocaleString()}원</div>
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
    const {loginUserRole} = useUserStore();
    const [cookies] = useCookies();
    const { selectListItItem, setSelectListItItem } = useRentListStore();
    const { notebookState, setNotebookState } = useNoteBookStore();
    const { tabletState, setTabletState } = useTabletStore();
    const { gameItState, setGameItState } = useGameItStore();
    const { externalBatteryState, setExternalBatteryState } = useBatteryStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();
    const { rentSite, setRentSite } = useRentSiteStore();
    const { startDate, endDate } = useRentDateStore();
    const [rentViewList, setRentViewList] = useState<ItRentList[]>([]);

    //                    function                    //
    const getDeviceListResponse = (result: GetDeviceListResponseDto | ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '유효하지 않은 정보입니다.' : 
            result.code === 'AF' ? '권한이 없습니다.' :
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
    const adminAddButtonClickHandler = () => {
        if (loginUserRole !== 'ROLE_ADMIN') return;
    }
    const adminDeleteButtonClickHandler = () => {
        if (loginUserRole !== 'ROLE_ADMIN') return;
    }

    const onItemSelectButtonClickHandler = () => {
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

    //                    effect                    //
    useEffect(() => {
        if (!cookies.accessToken) return;
        if (!startDate || !endDate) return;
        const start = dateFormat(startDate);
        const end = dateFormat(endDate);
        getRentPossibilityListRequest(start, end, cookies.accessToken).then(getDeviceListResponse);
    }, [startDate, endDate]);

    //                    render                    //
    const buttonClass = selectListItItem ? 'select-close-button' : 'select-open-button';
    return (
        <div id='select-type-wrapper'>
            {loginUserRole === 'ROLE_ADMIN' ? 
            <div className='rent-admin-button'>
                <div className='add-button' onClick={adminAddButtonClickHandler}>추가</div>
            </div> :
            <div></div>
            }
            <div className='select-it-box'>
                {value === '' ? 
                    <div className='select-it-none'>Device Type</div> :
                    <div className='select-it-item'>{value}</div>
                }
                <div className={buttonClass} onClick={onItemSelectButtonClickHandler}></div>
            </div>
            {selectListItItem &&
            <>
            <div className='type-notebook' onClick={onNotebookButtonClickHandler}>노트북</div>
            {notebookState &&
            <div className='type-notebook-detail'>
                {rentViewList.filter(item => item.type === '노트북').map(item => 
                <div key={item.serialNumber}>
                    {item.name} {item.model}
                    <RentItem {...item} />
                    <div className='device-put-box'>
                    {loginUserRole === 'ROLE_ADMIN' ? 
                    <div className='rent-admin-button'>
                        <div className='delete-button' onClick={adminDeleteButtonClickHandler}>삭제</div>
                    </div> :
                    <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    }
                    </div>
                </div>)}
            </div>
            }
            <div className='type-tablet' onClick={onTabletButtonClickHandler}>태블릿</div>
            {tabletState &&
            <div className='type-tablet-detail'>
                {rentViewList.filter(item => item.type === '태블릿').map(item => 
                <div key={item.serialNumber}>
                    {item.name} {item.model}
                    <RentItem {...item} />
                    <div className='device-put-box'>
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                </div>)}
            </div>
            }
            <div className='type-game' onClick={onGameItButtonClickHandler}>게임기</div>
            {gameItState &&
            <div className='type-game-detail'>
                {rentViewList.filter(item => item.type === '게임기').map(item => 
                <div key={item.serialNumber}>
                    {item.name} {item.model}
                    <RentItem {...item} />
                    <div className='device-put-box'>
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                </div>)}
            </div>
            }
            <div className='type-external-battery' onClick={onExternalBatteryButtonClickHandler}>보조배터리</div>
            {externalBatteryState &&
            <div className='type-tablet-detail'>
                {rentViewList.filter(item => item.type === '보조배터리').map(item => 
                <div key={item.serialNumber}>
                    {item.name} {item.model}
                    <RentItem {...item} />
                    <div className='device-put-box'>
                        <button onClick={() => addItemButtonClickHandler(item)}>담기</button>
                    </div>
                </div>)}
            </div>
            }
            </>
            }
        </div>
    );
}
