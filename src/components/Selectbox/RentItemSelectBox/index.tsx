import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

import {useBasketStore, useRentDateStore, useRentListStore,useUserStore} from 'src/stores/index';

import { DeviceListItem } from 'src/types';

import ResponseDto from 'src/apis/response.dto';
import { deleteDeviceRequest, getAdminRentListRequest } from 'src/apis/device';
import { GetDeviceListResponseDto } from 'src/apis/device/dto/response';

import { HOME_ABSOLUTE_PATH, RENT_ADD_ABSOLUTE_PATH } from 'src/constants';

import './style.css';

//                    interface                    //
interface Prop {
    value: string;
    onChange: (value: string) => void;
    rentViewList: DeviceListItem[];
    setRentViewList: React.Dispatch<React.SetStateAction<DeviceListItem[]>>;
}

//                    component                    //
function RentItem({
    serialNumber,
    model,
    name,
    deviceExplain,
    type,
    brand,
    price,
    devicesImgUrl,
    place,
    onDeleteHandler,
    addItemHandler
}: DeviceListItem & { onDeleteHandler: (serialNumber: string) => void } & { addItemHandler: (item: DeviceListItem) => void }) {

    //                    state                    //
    const { loginUserRole } = useUserStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentDateStore();

    const [isExplainFullVisible, setIsExplainFullVisible] = useState(false);
    const isItemInBasket = basketItems.some(item => item.serialNumber === serialNumber);
    const itemIndexInBasket = basketItems.findIndex(item => item.serialNumber === serialNumber);

    //                    event handler                    //
    const handleExplainClick = () => setIsExplainFullVisible(!isExplainFullVisible);

    const explainCloseButtonClickHandler = () => setIsExplainFullVisible(false);

    const removeItemButtonClickHandler = (index: number) => {
        const itemToRemove = basketItems[index];
        setBasketItems(basketItems.filter((_, i) => i !== index));
        setTotalAmount(totalAmount - itemToRemove.price);
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
                            <div className='explain-close-button' onClick={explainCloseButtonClickHandler}>X</div>
                            <div>{deviceExplain}</div>
                        </div>
                    )}
                </div>
            </div>
            <div className='device-box-right'>
                <div className='device-price'>{price.toLocaleString()}원</div>
                <div className='device-put-box'>
                    {loginUserRole === 'ROLE_ADMIN' ?
                        <div className='delete-button' onClick={() => onDeleteHandler(serialNumber)}>삭제</div> :
                        isItemInBasket ?
                            <div className='device-out-button' onClick={() => removeItemButtonClickHandler(itemIndexInBasket)}>해제</div> :
                            <div className='device-put-button' onClick={() => addItemHandler({ serialNumber, model, name, deviceExplain, type, brand, price, devicesImgUrl, place })}>담기</div>
                    }
                </div>
            </div>
        </div>
    );
}

//                    component                    //
export default function RentSelectBox({ rentViewList, setRentViewList }: Prop) {

    //                    state                    //
    const [cookies] = useCookies();

    const { loginUserRole } = useUserStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentDateStore();
    const { selectListItItem, setSelectListItItem } = useRentListStore();
    
    const [selectedType, setSelectedType] = useState<string | null>(null);

    //                    function                    //
    const navigator = useNavigate();

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
    };

    const getAdminDeviceListResponse = (result: GetDeviceListResponseDto | ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '유효하지 않은 정보입니다.' :
            result.code === 'AF' ? '관리자가 아닙니다.' :
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
        if (loginUserRole !== 'ROLE_ADMIN' || !cookies.accessToken) return;
        navigator(RENT_ADD_ABSOLUTE_PATH);
    };

    const adminDeleteButtonClickHandler = (serialNumber: string | number) => {
        if (loginUserRole !== 'ROLE_ADMIN' || !cookies.accessToken) return;
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        deleteDeviceRequest(serialNumber, cookies.accessToken).then(result => deleteDeviceResponse(result, serialNumber));
    };

    const onTypeButtonClickHandler = (type: string) => setSelectedType(selectedType === type ? null : type);

    const addItemButtonClickHandler = (item: DeviceListItem) => {
        setBasketItems([...basketItems, item]);
        setTotalAmount(totalAmount + item.price);
    };

    //                    effect                    //
    useEffect(() => {
        setSelectListItItem(true);
    }, [selectListItItem]);

    useEffect(() => {
        if (loginUserRole === 'ROLE_ADMIN') {
            getAdminRentListRequest(cookies.accessToken).then(getAdminDeviceListResponse);
        }
    }, [cookies.accessToken, loginUserRole]);

    //                    render                    //
    const renderDeviceList = (type: string) => {
        return rentViewList.filter(item => item.type === type).map(item =>
            <div key={item.serialNumber}>
                <RentItem {...item} onDeleteHandler={adminDeleteButtonClickHandler} addItemHandler={addItemButtonClickHandler} />
            </div>
        );
    };
    
    return (
        <div id='select-type-wrapper'>
            <div className='select-it-box' style={{ display: 'flex', alignItems: 'center' }}>
                <div className='select-it-none' style={{ flexGrow: 1, textAlign: 'center' }}>대여 기기 목록</div>
                {loginUserRole === 'ROLE_ADMIN' ?
                <div className='rent-admin-button' onClick={adminAddButtonClickHandler} style={{ marginLeft: 'auto' }}>기기 추가</div> :
                <div style={{ marginLeft: 'auto' }}></div>
                }               
                <div className={selectListItItem ? 'select-close-button' : 'select-open-button'} onClick={() => setSelectListItItem(!selectListItItem)}></div>
            </div>
            {selectListItItem && (
                <div className="device-list-container">
                    <div className="device-buttons">
                        <div className='type-item' onClick={() => onTypeButtonClickHandler('노트북')}>노트북</div>
                        <div className='type-item' onClick={() => onTypeButtonClickHandler('태블릿')}>태블릿</div>
                        <div className='type-item' onClick={() => onTypeButtonClickHandler('게임기')}>게임기</div>
                        <div className='type-item' onClick={() => onTypeButtonClickHandler('보조배터리')}>보조배터리</div>
                    </div>
                    <div className="device-list">
                        {selectedType && (
                            <div className='type-item-detail'>{renderDeviceList(selectedType)}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
