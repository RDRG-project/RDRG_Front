import React, {  useEffect, useState } from 'react';
import './style.css';
import { useBasketStore, useBatteryStore, useNoteBookStore, useRentDateStore, useRentItemStore, useRentListStore, useRentSiteStore, useTabletStore, useUserStore } from 'src/stores/index';
import { ItRentList } from 'src/types';
import { useNavigate } from 'react-router';
import { GetDeviceListResponseDto } from 'src/apis/device/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { useCookies } from 'react-cookie';
import { HOME_ABSOLUTE_PATH, RENT_ADD_ABSOLUTE_PATH } from 'src/constants';
import { deleteDeviceRequest, getRentPossibilityListRequest } from 'src/apis/device';
import { dateFormat } from 'src/utils';
import useGameItStore from 'src/stores/gameIt.store';


//                    interface                    //
interface RentItemProps extends ItRentList {
    loginUserRole: string;
    onDelete: (serialNumber: string | number) => void;
    onAdd: (item: ItRentList) => void;
    onRemove: (serialNumber: string | number) => void;
}

//                    component                    //
function RentItem({
    model,
    type,
    brand,
    name,
    price,
    deviceExplain,
    devicesImgUrl,
    serialNumber,
    loginUserRole,
    onDelete,
    onAdd,
    onRemove
}: RentItemProps) {

    //                    function                    //
    const [isExplainFullVisible, setIsExplainFullVisible] = useState(false);
    const { basketItems } = useBasketStore();
    const isItemInBasket = basketItems.some(item => item.serialNumber === serialNumber);

    //                    event handler                    //
    const handleExplainClick = () => {
        setIsExplainFullVisible(!isExplainFullVisible);
    };

    const closeButtonClickHandler = () => {
        setIsExplainFullVisible(false);
    };

    const onAddClick = () => {
        onAdd({
            serialNumber,
            model,
            type,
            brand,
            name,
            price,
            deviceExplain,
            devicesImgUrl
        });
    };

    const onRemoveClick = () => {
        onRemove(serialNumber);
    };

    //                    render                    //
    return (
        <div className='device-box'>
            <div className='device-box-left'>
                <img className='device-image' src={devicesImgUrl} alt={`${name} 이미지`} />
            </div>
            <div className='device-box-middle'>
                <div className='device-detail-title'>{name}{model}</div>
                <div className='device-detail'>
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
                <div className='device-put-box'>
                {loginUserRole === 'ROLE_ADMIN' ?
                    <div className='delete-button' onClick={() => onDelete(serialNumber)}>삭제</div> :
                    isItemInBasket ?
                        <div className='device-out-button' onClick={onRemoveClick}>해제</div> :
                        <div className='device-put-button' onClick={onAddClick}>담기</div>
                }
                </div>
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
    const { loginUserRole } = useUserStore();
    const [cookies] = useCookies();
    const { selectListItItem, setSelectListItItem } = useRentListStore();
    const { notebookState, setNotebookState } = useNoteBookStore();
    const { tabletState, setTabletState } = useTabletStore();
    const { gameItState, setGameItState } = useGameItStore();
    const { externalBatteryState, setExternalBatteryState } = useBatteryStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();
    const { rentSite, setRentSite } = useRentSiteStore();
    const [ place, setPlace ] = useState<string>('');
    const { startDate, endDate } = useRentDateStore();
    const [rentViewList, setRentViewList] = useState<ItRentList[]>([]);

    //                    function                    //
    const getDeviceListResponse = (result: GetDeviceListResponseDto | ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.ljnmljokj' :
            result.code === 'VF' ? '유효하지 않은 정보입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(HOME_ABSOLUTE_PATH);
            return;
        }

        const { deviceList } = result as GetDeviceListResponseDto;
        setPlace(place);
        setRentViewList(deviceList);
    };

    const deleteDeviceResponse = (result: ResponseDto | null, serialNumber: string | number) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '유효하지 않은 기기 입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(HOME_ABSOLUTE_PATH);
            return;
        }

        setRentViewList(prevList => prevList.filter(device => device.serialNumber !== serialNumber));
    }

    //                   event handler                    //
    const adminAddButtonClickHandler = () => {
        if (loginUserRole !== 'ROLE_ADMIN' || !cookies.accessToken) return;
        navigator(RENT_ADD_ABSOLUTE_PATH);
    };
    const adminDeleteButtonClickHandler = (serialNumber: string | number) => {
        if (loginUserRole !== 'ROLE_ADMIN' || !cookies.accessToken) return;
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        deleteDeviceRequest(serialNumber, cookies.accessToken).then(result => deleteDeviceResponse(result, serialNumber));
    };

    const onItemSelectButtonClickHandler = () => {
        setSelectListItItem(!selectListItItem);
    };

    const addItemButtonClickHandler = (item: ItRentList) => {
        setBasketItems([...basketItems, item]);
        setTotalAmount(totalAmount + item.price);
    };

    const removeItemButtonClickHandler = (serialNumber: string | number) => {
        const updatedBasketItems = basketItems.filter(item => item.serialNumber !== serialNumber);
        const removedItem = basketItems.find(item => item.serialNumber === serialNumber);
        setBasketItems(updatedBasketItems);
        if (removedItem) {
            setTotalAmount(totalAmount - removedItem.price);
        }
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
        getRentPossibilityListRequest(start, end, place, cookies.accessToken).then(getDeviceListResponse);
    }, [startDate, endDate, place]);

    //                    render                    //
    const buttonClass = selectListItItem ? 'select-close-button' : 'select-open-button';
    return (
        <div id='select-type-wrapper'>
            {loginUserRole === 'ROLE_ADMIN' ?
            <div className='rent-admin-button' onClick={adminAddButtonClickHandler}>기기 추가
            </div> : <div></div>
            }
            <div className='select-it-box'>
            {value === '' ?
                <div className='select-it-none'>대여 기기 목록</div> :
                <div className='select-it-item'>{value}</div>
            }
                <div className={buttonClass} onClick={onItemSelectButtonClickHandler}></div>
            </div>
            {selectListItItem &&
            <>
                <div className='type-notebook' onClick={onNotebookButtonClickHandler}>노트북</div>
                {notebookState &&
                    <div className='type-notebook-detail'>
                        {rentViewList && rentViewList.filter(item => item.type === '노트북').map(item =>
                        <div key={item.serialNumber}>
                            <RentItem 
                                {...item} 
                                loginUserRole={loginUserRole}
                                onDelete={adminDeleteButtonClickHandler}
                                onAdd={addItemButtonClickHandler}
                                onRemove={removeItemButtonClickHandler}
                            />
                        </div>)}
                    </div>
                }
                <div className='type-tablet' onClick={onTabletButtonClickHandler}>태블릿</div>
                {tabletState &&
                    <div className='type-tablet-detail'>
                        {rentViewList && rentViewList.filter(item => item.type === '태블릿').map(item =>
                        <div key={item.serialNumber}>
                            <RentItem 
                                {...item} 
                                loginUserRole={loginUserRole}
                                onDelete={adminDeleteButtonClickHandler}
                                onAdd={addItemButtonClickHandler}
                                onRemove={removeItemButtonClickHandler}
                            />
                        </div>)}
                    </div>
                }
                <div className='type-game' onClick={onGameItButtonClickHandler}>게임기</div>
                {gameItState &&
                    <div className='type-game-detail'>
                        {rentViewList && rentViewList.filter(item => item.type === '게임기').map(item =>
                        <div key={item.serialNumber}>
                            <RentItem 
                                {...item} 
                                loginUserRole={loginUserRole}
                                onDelete={adminDeleteButtonClickHandler}
                                onAdd={addItemButtonClickHandler}
                                onRemove={removeItemButtonClickHandler}
                            />
                        </div>)}
                    </div>
                }
                <div className='type-external-battery' onClick={onExternalBatteryButtonClickHandler}>보조배터리</div>
                {externalBatteryState &&
                    <div className='type-tablet-detail'>
                        {rentViewList && rentViewList.filter(item => item.type === '보조배터리').map(item =>
                        <div key={item.serialNumber}>
                            <RentItem 
                                {...item} 
                                loginUserRole={loginUserRole}
                                onDelete={adminDeleteButtonClickHandler}
                                onAdd={addItemButtonClickHandler}
                                onRemove={removeItemButtonClickHandler}
                            />
                        </div>)}
                    </div>
                }
            </>
            }
        </div>
    );
}
