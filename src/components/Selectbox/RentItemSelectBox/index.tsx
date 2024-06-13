import React, { useEffect, useState } from 'react';
import './style.css';
import {
    useBasketStore,
    useBatteryStore,
    useNoteBookStore,
    useRentItemStore,
    useRentListStore,
    useTabletStore,
    useUserStore
} from 'src/stores/index';
import { DeviceListItem } from 'src/types';
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import { HOME_ABSOLUTE_PATH, RENT_ADD_ABSOLUTE_PATH } from 'src/constants';
import { deleteDeviceRequest } from 'src/apis/device';
import useGameItStore from 'src/stores/gameIt.store';
import ResponseDto from 'src/apis/response.dto';

interface Prop {
    value: string;
    onChange: (value: string) => void;
    rentViewList: DeviceListItem[];
    setRentViewList: React.Dispatch<React.SetStateAction<DeviceListItem[]>>;
}

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
    const [isExplainFullVisible, setIsExplainFullVisible] = useState(false);
    const { loginUserRole } = useUserStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();

    const isItemInBasket = basketItems.some(item => item.serialNumber === serialNumber);
    const itemIndexInBasket = basketItems.findIndex(item => item.serialNumber === serialNumber);

    const handleExplainClick = () => {
        setIsExplainFullVisible(!isExplainFullVisible);
    };

    const explainCloseButtonClickHandler = () => {
        setIsExplainFullVisible(false);
    };

    const removeItemButtonClickHandler = (index: number) => {
        const itemToRemove = basketItems[index];
        setBasketItems(basketItems.filter((_, i) => i !== index));
        setTotalAmount(totalAmount - itemToRemove.price);
    };

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

export default function RentSelectBox({ value, onChange, rentViewList, setRentViewList }: Prop) {
    const navigator = useNavigate();
    const { loginUserRole } = useUserStore();
    const [cookies] = useCookies();
    const { selectListItItem, setSelectListItItem } = useRentListStore();
    const { notebookState, setNotebookState } = useNoteBookStore();
    const { tabletState, setTabletState } = useTabletStore();
    const { gameItState, setGameItState } = useGameItStore();
    const { externalBatteryState, setExternalBatteryState } = useBatteryStore();
    const { basketItems, setBasketItems } = useBasketStore();
    const { totalAmount, setTotalAmount } = useRentItemStore();
    const [selectedType, setSelectedType] = useState<string | null>(null);

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

    const onTypeButtonClickHandler = (type: string) => {
        setSelectedType(selectedType === type ? null : type);
    };

    const addItemButtonClickHandler = (item: DeviceListItem) => {
        setBasketItems([...basketItems, item]);
        setTotalAmount(totalAmount + item.price);
    };

    useEffect(() => {
        setSelectListItItem(true);
    }, [selectListItItem]);

    const renderDeviceList = (type: string) => {
        return rentViewList.filter(item => item.type === type).map(item =>
            <div key={item.serialNumber}>
                <RentItem {...item} onDeleteHandler={adminDeleteButtonClickHandler} addItemHandler={addItemButtonClickHandler} />
            </div>
        );
    };

    return (
        <div id='select-type-wrapper'>
            {loginUserRole === 'ROLE_ADMIN' ?
                <div className='rent-admin-button' onClick={adminAddButtonClickHandler}>기기 추가</div> :
                <div></div>
            }
            <div className='select-it-box'>
                {value === '' ?
                    <div className='select-it-none'>대여 기기 목록</div> :
                    <div className='select-it-item'>{value}</div>
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
