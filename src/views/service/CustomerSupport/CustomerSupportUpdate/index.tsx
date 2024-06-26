import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';

import useUserStore from 'src/stores/user.store';

import { BoardFileItem } from 'src/types';

import { convertUrlToFile } from 'src/utils';

import ResponseDto from 'src/apis/response.dto';
import { getBoardRequest, putBoardRequest } from 'src/apis/board';
import { imageUploadRequest } from 'src/apis/fileUpload';
import { BoardRequestDto } from 'src/apis/board/dto/request';
import { GetBoardResponseDto } from 'src/apis/board/dto/response';

import { CUSTOMER_SUPPORT_ABSOLUTE_PATH, CUSTOMER_SUPPORT_DETAIL_ABSOLUTE_PATH } from 'src/constants';

import './style.css'

//                   interface                    //
interface UploadFile {
    file: File;
    originalFileName: string;
}

//                    component                    //
export default function SupportUpdate() {

    //                    state                    //
    const [cookies] = useCookies();
    
    const { loginUserId, loginUserRole } = useUserStore();

    const { receptionNumber } = useParams();
    const fileRef = useRef<HTMLInputElement | null>(null);
    const contentsRef = useRef<HTMLTextAreaElement | null>(null);
    const [title, setTitle] = useState<string>('');
    const [contents, setContents] = useState<string>('');
    const [fileUpload , setFileUpload] = useState<UploadFile[]>([]);
    const [filePreviews, setFilePreviews] = useState<{name: string, url: string}[]>([]);
    const [fileRevise, setFileRevise] = useState<number | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    //                    function                    //
    const navigator = useNavigate();

    const getBoardResponse = async (result: GetBoardResponseDto | ResponseDto | null) => {

        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '올바르지 않은 접수 번호입니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'NB' ? '존재하지 않는 접수 번호입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
            return;
        }

        const { writerId, title, contents, status, imageUrl,  originalFileName } = result as GetBoardResponseDto;

        if (writerId !== loginUserId) {
            alert('권한이 없습니다.');
            navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
            return;
        }

        if (status) {
            alert('답변이 완료된 게시물입니다.');
            navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
            return;
        }

        setTitle(title);
        setContents(contents);
        setImageUrls(imageUrl);

        const fileUpload = [];

        for (let index = 0; index < imageUrl.length; index++) {
            const file = await convertUrlToFile(imageUrl[index]);
            fileUpload.push({file, originalFileName: originalFileName[index]});
        }

        setFileUpload(fileUpload);
        
        const filePreviews = originalFileName.map((name, index) => ({
            name,
            url: imageUrl[index]
        }));

        setFilePreviews(filePreviews);
    };

    const putBoardResponse = (result: ResponseDto | null) => {

        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'VF' ? '모든 값을 입력해주세요.' :
            result.code === 'NB' ? '존재하지 않는 접수 번호입니다.' :
            result.code === 'WC' ? '이미 답글이 작성되어 있습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        if (!receptionNumber) return;

        navigator(CUSTOMER_SUPPORT_DETAIL_ABSOLUTE_PATH(receptionNumber))
    };


    //                    event handler                    //
    const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value;
        setTitle(title);
    };

    const onContentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const contents = event.target.value;
        if (contents.length >1000) return;
        setContents(contents);

        if (!contentsRef.current) return;
        contentsRef.current.style.height = 'auto';
        contentsRef.current.style.height = `${contentsRef.current.scrollHeight}px`;
    };

    const onPutButtonClickHandler = async () => {
        if (!title.trim() || !contents.trim()) return; 
        if (!cookies.accessToken || !receptionNumber) return;

        const urlList: BoardFileItem[] = [];

        for (const fileItem of fileUpload) {
            const data = new FormData();
            data.append('file', fileItem.file);
            const url: string | null = await imageUploadRequest(data, cookies.accessToken);
            
            if (!url) continue;

            urlList.push({ url, originalFileName: fileItem.originalFileName });
        }

        const requestBody: BoardRequestDto = { title, contents, fileList: urlList };

        putBoardRequest(receptionNumber, requestBody, cookies.accessToken).then(putBoardResponse);
    };


    const onFileUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

        const files = event.target.files;
        if (!files || !files.length) return;

        const uploadedFileCount = fileUpload.length + files.length;

        if (fileRevise === null && uploadedFileCount > 3 ) {
            alert('파일은 최대 3개까지 업로드할 수 있습니다.');
            return;
        }

        if (fileRevise !== null && uploadedFileCount > 4) {
            alert('파일은 최대 3개까지 업로드할 수 있습니다.');
            return;
        }

        const fileList = Array.from(files);

        const newPreviewList = [];

        for (const file of fileList) {
            const name = file.name;
            const url = URL.createObjectURL(file);
            newPreviewList.push({name, url})
        }

        if (fileRevise !== null) {
            let updatedFiles = fileUpload.filter((item, index) => index !== fileRevise);
            const uploadFileList = fileList.map(file => ({file, originalFileName: file.name}));
            updatedFiles = [...updatedFiles, ...uploadFileList];
            setFileUpload(updatedFiles);

            let updatedPreviews = filePreviews.filter((item, index) => index !== fileRevise);
            updatedPreviews = [...updatedPreviews, ...newPreviewList];
            setFilePreviews(updatedPreviews);

            setFileRevise(null);
        } else {
            const uploadFileList = fileList.map(file => ({file, originalFileName: file.name}));
            setFileUpload([...fileUpload, ...uploadFileList]);
            setFilePreviews([...filePreviews, ...newPreviewList]);
        }
        if (fileRef.current) {
            fileRef.current.value = "";
        } 
    };

    const onFileUploadButtonClickHandler = () => {
        if (!fileRef.current) return;
        fileRef.current.click();
    };

    const onFileDeleteButtonClickHandler = (index: number) => {
        const fileUpdate = fileUpload.filter((_, i) => i !== index);
        const showFileUpdate = filePreviews.filter((_, i) => i !== index);
        setFileUpload(fileUpdate);
        setFilePreviews(showFileUpdate);
    };

    const onDragOverHandler = (event: React.DragEvent) => event.preventDefault();
    
    const onDropHandler = (event: React.DragEvent) => {
        event.preventDefault();
        if (!event.dataTransfer || !event.dataTransfer.files.length) return;
    
        const files = Array.from(event.dataTransfer.files);
        const uploadedFileCount = filePreviews.length + imageUrls.length;
    
        if (uploadedFileCount + files.length > 3) {
            alert('파일은 최대 3개까지 업로드할 수 있습니다.');
            return;
        }
    
        const newFilePreviews = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        }));

        const uploadFileList = files.map(file => ({file, originalFileName: file.name}));

        setFileUpload([...fileUpload, ...uploadFileList]);
        setFilePreviews([...filePreviews, ...newFilePreviews]);
    };

    const onCancelButtonClickHandler = () => {
        if (receptionNumber) {
            const path = CUSTOMER_SUPPORT_DETAIL_ABSOLUTE_PATH(receptionNumber);
            navigator(path);
        } else {
            navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
        }
    };

    //                    effect                    //
    let effectFlag = false;

    useEffect(() => {
        if (!receptionNumber || !cookies.accessToken) return;
        if (!loginUserRole) return;
        if (effectFlag) return;
        effectFlag = true;
        if (loginUserRole !== 'ROLE_USER' ) {
            navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
            return;
        }
        getBoardRequest(receptionNumber, cookies.accessToken).then(getBoardResponse);
    }, [loginUserRole]);    
    
    //                    render                    //
    return( 
        <>
            <div className='cs-image'>문의게시판</div>
            <div id="cs-write-wrapper">
                <div className="cs-write-container">
                    <div className='cs-write-top'>
                        <div className='cs-write-title'>제목</div>
                        <div className='cs-write-title-box'>
                            <input className='cs-write-title-input' placeholder='제목을 입력해주세요.' value={title} onChange={onTitleChangeHandler}/>
                        </div>
                    </div>                    
                    <div className="cs-write-middle">
                        <div className='cs-write-middle-title'>내용</div>
                        <div className='cs-write-contents-box'>
                            <textarea ref={contentsRef} className='cs-write-contents-textarea' placeholder='내용을 입력해주세요. / 1000자' maxLength={1000} value={contents} onChange={onContentsChangeHandler}/>
                        </div>
                    </div>
                    <div className="cs-write-bottom">
                        <div className='cs-write-bottom-title'>첨부파일</div>
                        <div className='cs-write-file-box'>                            
                            <input ref={fileRef} style={{ display: 'none' }} type="file" multiple onChange={onFileUploadChangeHandler} />
                            <div className='cs-file-upload-button' onClick={onFileUploadButtonClickHandler} >내 PC</div>
                            <div>
                                <div className="file-arrangement" onDrop={onDropHandler} onDragOver={onDragOverHandler} >
                                {filePreviews.length === 0 && <strong>파일 첨부는 최대 3개까지 가능합니다.</strong>}
                                {filePreviews.map((preview, index) => (
                                    <div key={index} className="file-preview">
                                    <button className="image-delete-button" onClick={() => onFileDeleteButtonClickHandler(index)}>X</button>
                                    <img src={preview.url} alt={preview.name} className="file-preview-name" width="auto" height="50" />
                                    <div>{preview.name}</div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>               
                <div className="cs-write-button">
                    <div className='customer-support-button' onClick={onCancelButtonClickHandler}>취소</div>
                    <div className='customer-support-button' onClick={onPutButtonClickHandler}>수정</div>
                </div>
            </div>
        </>
    );
};