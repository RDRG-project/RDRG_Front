import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

import axios from "axios";

import TypeSelectBox from "src/components/Selectbox/RentItemSelectBox/addTypeSelectBox";
import PlaceSelectBox from "src/components/Selectbox/RentItemSelectBox/addPlaceSelectBox";

import { useUserStore } from "src/stores";

import ResponseDto from "src/apis/response.dto";
import { PostDeviceAddRequest } from "src/apis/device";
import { DeviceAddRequestDto } from "src/apis/device/dto/request";

import { RENT_ABSOLUTE_PATH } from "src/constants";

import './style.css';

//                    component                    //
export function RentAdd() {
    
    //                    state                    //
    const [cookies] = useCookies();

    const { loginUserRole } = useUserStore();

    const contentsRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [serialNumber, setSerialNumber] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [deviceExplain, setDeviceExplain] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [place, setPlace] = useState<string>('');
    const [fileUpload, setFileUpload] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<{ name: string, url: string }[]>([]);

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
        if (!serialNumber.trim() || !model.trim() || !name.trim() || !deviceExplain.trim() || !type.trim() || !brand.trim() || !price || !place || !cookies.accessToken) return;

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

        const requestBody: DeviceAddRequestDto = { serialNumber, model, name, deviceExplain, type, place, brand, price, devicesImgUrl: urlList.join(",") };

        PostDeviceAddRequest(requestBody, cookies.accessToken).then(postBoardResponse);
    };

    const onFileUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        uploadedFile(Array.from(event.target.files));
    };

    const uploadedFile = (files: File[]) => {
        if (files.length === 0) return;
        const filePreviewsToAdd = files.map(file => {
            return {name: file.name, url: URL.createObjectURL(file)};
        });

        const fileToAdd = files[0];
        const filePreviewToAdd = filePreviewsToAdd[0];

        setFileUpload([fileToAdd]);
        setFilePreviews([filePreviewToAdd]);
    };

    const onFileUploadButtonClickHandler = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onCancelButtonClickHandler = () => navigator(RENT_ABSOLUTE_PATH);

    useEffect(() => {
        if (loginUserRole !== 'ROLE_ADMIN') {
            navigator(RENT_ABSOLUTE_PATH);
            return;
        }
    }, [loginUserRole]);

    //                    render                    //
    return (
        <div id='device-add-page-wrapper'>
            <div className='device-add-page-title'>기기 등록</div>
            <div className="device-add-page-container">
                <div className="device-add-container">
                    <div className='device-add-box'>
                        <div className='device-add-title'>serialNumber</div>
                        <div className='device-add-input-box'>
                            <input className='device-add-input' placeholder='시리얼 넘버를 입력해주세요' value={serialNumber} onChange={onSerialNumberChangeHandler} />
                        </div>
                    </div>
                    <div className='device-add-box'>
                        <div className='device-add-title'>model</div>
                        <div className='device-add-input-box'>
                            <input className='device-add-input' placeholder='모델을 입력해주세요' value={model} onChange={onModelChangeHandler} />
                        </div>
                    </div>
                    <div className='device-add-box'>
                        <div className='device-add-title'>name</div>
                        <div className='device-add-input-box'>
                            <input className='device-add-input' placeholder='제품명을 입력해주세요' value={name} onChange={onNameChangeHandler} />
                        </div>
                    </div>
                    <div className="device-add-box">
                        <div className='device-add-title'>deviceExplain</div>
                        <div className='device-add-input-box'>
                            <textarea ref={contentsRef} className='device-add-input textarea' placeholder='내용을 입력해주세요 / 1000자' maxLength={1000} value={deviceExplain} onChange={onDeviceExplainChangeHandler} />
                        </div>
                    </div>
                    <div className='device-add-box'>
                        <div className='device-add-title'>type</div>
                        <div className='device-add-input-box'>
                            <TypeSelectBox type={type} onChange={setType} />
                        </div>
                    </div>
                    <div className='device-add-box'>
                        <div className='device-add-title'>place</div>
                        <div className='device-add-input-box'>
                            <PlaceSelectBox place={place} onChange={setPlace} />
                        </div>
                    </div>
                    <div className='device-add-box'>
                        <div className='device-add-title'>brand</div>
                        <div className='device-add-input-box'>
                            <input className='device-add-input' placeholder='제조사를 입력해주세요' value={brand} onChange={onBrandChangeHandler} />
                        </div>
                    </div>
                    <div className='device-add-box'>
                        <div className='device-add-title'>price</div>
                        <div className='device-add-input-box'>
                            <input className='device-add-input' placeholder='시간당 대여 금액을 입력해주세요' value={price} onChange={onPriceChangeHandler} />
                        </div>
                    </div>
                    <div className="device-write-bottom">
                        <div
                            className='device-write-bottom-title'
                            style={{ border: '1px dashed', padding: '10px', color: 'red', width: '580px', height: 'auto' }}
                            onClick={onFileUploadButtonClickHandler} >
                            {filePreviews.length === 0 && "이미지 추가"}
                            {filePreviews.map((preview, index) => (
                            <div key={index} style={{ flexDirection: 'column' }}>
                                <img src={preview.url} alt={preview.name} width="auto" height="300" />
                            </div>
                            ))}
                    </div>
                    <input ref={fileInputRef} type="file" onChange={onFileUploadChangeHandler} style={{ display: 'none' }} />
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