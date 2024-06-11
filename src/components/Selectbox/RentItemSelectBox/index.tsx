import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useBasketStore, useBatteryStore, useNoteBookStore, useRentDateStore, useRentItemStore, useRentListStore, useRentSiteStore, useTabletStore, useUserStore } from 'src/stores/index';
import { ItRentList } from 'src/types';
import { useNavigate } from 'react-router';
import { GetDeviceListResponseDto } from 'src/apis/device/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { useCookies } from 'react-cookie';
import { HOME_ABSOLUTE_PATH, RENT_ABSOLUTE_PATH, RENT_ADD_ABSOLUTE_PATH } from 'src/constants';
import { PostDeviceAddRequest, deleteDeviceRequest, getRentPossibilityListRequest } from 'src/apis/device';
import { dateFormat } from 'src/utils';
import useGameItStore from 'src/stores/gameIt.store';
import { DeviceAddRequestDto, DeviceDeleteRequestDto } from 'src/apis/device/dto/request';
import axios from 'axios';
import TypeSelectBox from './TypeSelectbox';

//                    component                    //
export function RentAdd() {
    //                    state                    //
    const contentsRef = useRef<HTMLTextAreaElement | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { loginUserRole } = useUserStore();
    const [cookies] = useCookies();
    const [serialNumber, setSerialNumber] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [deviceExplain, setDeviceExplain] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [price, setPrice] = useState<number>(0);

    const [fileUpload, setFileUpload] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<{ name: string, url: string }[]>([]);
    const [fileRevise, setFileRevise] = useState<number | null>(null);

    //                    function                    //
    const navigator = useNavigate();

    const postBoardResponse = (result: ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'VF' ? '내용을 모두 입력해주세요.' :
                    result.code === 'AF' ? '권한이 없습니다.' :
                        result.code === 'FUF' ? '파일 업로드에 실패했습니다.' :
                            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        navigator(RENT_ABSOLUTE_PATH);
    };

    //                    event handler                    //
    const onSerialNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const serialNumber = event.target.value;
        if (serialNumber.length > 50) return;
        setSerialNumber(serialNumber);
    };

    const onModelChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const model = event.target.value;
        if (model.length > 50) return;
        setModel(model);
    };

    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        if (name.length > 20) return;
        setName(name);
    };

    const onDeviceExplainChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const deviceExplain = event.target.value;
        if (deviceExplain.length > 1000) return;
        setDeviceExplain(deviceExplain);

        if (!contentsRef.current) return;
        contentsRef.current.style.height = 'auto';
        contentsRef.current.style.height = `${contentsRef.current.scrollHeight}px`;
    };

    const onBrandChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const brand = event.target.value;
        if (brand.length > 10) return;
        setBrand(brand);
    };

    const onPriceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const priceValue = parseFloat(event.target.value);
        if (isNaN(priceValue)) return;
        setPrice(priceValue);
    };

    const onPostButtonClickHandler = async () => {
        if (!serialNumber.trim() || !model.trim() || !name.trim() || !deviceExplain.trim() || !type.trim() || !brand.trim() || !price || !cookies.accessToken) return;

        const urlList: string[] = [];

        for (const file of fileUpload) {
            const data = new FormData();
            data.append('file', file);
            const url = await axios.post("http://localhost:4500/rdrg/file/upload", data, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(response => response.data as string)
                .catch(error => null);
            if (!url) continue;

            urlList.push(url);
        }

        const requestBody: DeviceAddRequestDto = { serialNumber, model, name, deviceExplain, type, brand, price, devicesImgUrl: urlList.join(",") };

        PostDeviceAddRequest(requestBody, cookies.accessToken).then(postBoardResponse);
    };

    const onFileUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        uploadedFile(Array.from(event.target.files));
    };

    const uploadedFile = (files: File[]) => {
        const filePreviewsToAdd = files.map(file => {
            return { name: file.name, url: URL.createObjectURL(file) };
        });

        if (fileRevise !== null) {
            const fileUpdate = [...fileUpload];
            const showFile = [...filePreviews];

            if (fileRevise < 3) {
                files.forEach((file, index) => {
                    fileUpdate[fileRevise + index] = file;
                    showFile[fileRevise + index] = filePreviewsToAdd[index];
                });

                setFileRevise(null);
                setFileUpload(fileUpdate);
                setFilePreviews(showFile);
            }
        } else {
            if (fileUpload.length + files.length <= 3) {
                setFileUpload([...fileUpload, ...files]);
                setFilePreviews([...filePreviews, ...filePreviewsToAdd]);
            }
        }
    };

    const onDragOverHandler = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const onDropHandler = (event: React.DragEvent) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        uploadedFile(files);
    };

    const onFileUploadButtonClickHandler = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onFileDeleteButtonClickHandler = (index: number) => {
        const fileUpdate = fileUpload.filter((_, i) => i !== index);
        const showFileUpdate = filePreviews.filter((_, i) => i !== index);
        setFileUpload(fileUpdate);
        setFilePreviews(showFileUpdate);
    };

    const onFileReviseButtonClickHandler = (index: number) => {
        setFileRevise(index);
        if (fileRef.current) {
            fileRef.current.click();
        }
    };

    const onCancelButtonClickHandler = () => {
        navigator(RENT_ABSOLUTE_PATH);
    };

    useEffect(() => {
        if (loginUserRole !== 'ROLE_ADMIN') {
            navigator(RENT_ABSOLUTE_PATH);
            return;
        }
    }, [loginUserRole]);

    //                    render                    //
    return (
        <div id='device-add-page-container'>
            <div className='device-add-page-image'>기기 등록</div>
            <div className="device-write-wrapper">
                <div className="device-write-container">
                    <div className='device-write-top'>
                        <div className='device-write-title'>serialNumber</div>
                        <div className='device-write-serialNumber-box'>
                            <input className='device-write-serialNumber-input' placeholder='시리얼 넘버를 입력해주세요' value={serialNumber} onChange={onSerialNumberChangeHandler} />
                        </div>
                    </div>
                    <div className='device-write-top'>
                        <div className='device-write-title'>model</div>
                        <div className='device-write-model-box'>
                            <input className='device-write-model-input' placeholder='모델을 입력해주세요' value={model} onChange={onModelChangeHandler} />
                        </div>
                    </div>
                    <div className='device-write-top'>
                        <div className='device-write-title'>name</div>
                        <div className='device-write-name-box'>
                            <input className='device-write-title-input' placeholder='제품명을 입력해주세요' value={name} onChange={onNameChangeHandler} />
                        </div>
                    </div>
                    <div className="device-write-middle">
                        <div className='device-write-middle-title'>deviceExplain</div>
                        <div className='device-write-contents-box'>
                            <textarea ref={contentsRef} className='device-write-contents-textarea' placeholder='내용을 입력해주세요 / 1000자' maxLength={1000} value={deviceExplain} onChange={onDeviceExplainChangeHandler} />
                        </div>
                    </div>
                    <div className='device-write-top'>
                        <div className='device-write-title'>type</div>
                        <div className='device-write-title-box'>
                            <TypeSelectBox type={type} onChange={setType} />
                        </div>
                    </div>
                    <div className='device-write-top'>
                        <div className='device-write-title'>brand</div>
                        <div className='device-write-title-box'>
                            <input className='device-write-title-input' placeholder='제조사를 입력해주세요' value={brand} onChange={onBrandChangeHandler} />
                        </div>
                    </div>
                    <div className='device-write-top'>
                        <div className='device-write-title'>price</div>
                        <div className='device-write-title-box'>
                            <input className='device-write-title-input' placeholder='시간당 대여 금액을 입력해주세요' value={price} onChange={onPriceChangeHandler} />
                        </div>
                    </div>
                    <div className="cs-write-bottom">
                        <div className='cs-write-bottom-title'>첨부파일</div>
                        <input ref={fileInputRef} style={{ display: 'none' }} type="file" multiple onChange={onFileUploadChangeHandler} />
                        <div
                            style={{ border: '2px dashed', padding: '10px', color: 'red', width: '88%' }}
                            onDrop={onDropHandler}
                            onDragOver={onDragOverHandler}
                            onClick={onFileUploadButtonClickHandler} >
                            드래그 앤 드롭으로 파일을 여기에 넣으세요.
                        </div>
                    </div>
                    <div>
                        {filePreviews.map((preview, index) => (
                            <div key={index} >
                                <img src={preview.url} alt={preview.name} width="70" height="50" />
                                <p>{preview.name}</p>
                                <button style={{ display: 'flex' }} onClick={() => onFileReviseButtonClickHandler(index)}>수정</button>
                                <button onClick={() => onFileDeleteButtonClickHandler(index)}>삭제</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="cs-write-button">
                    <div className='customer-support-button' onClick={onCancelButtonClickHandler}>취소</div>
                    <div className='customer-support-button' onClick={onPostButtonClickHandler}>올리기</div>
                </div>
            </div>
        </div>
    );
};

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
