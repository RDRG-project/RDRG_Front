import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css'

import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { getBoardRequest, putBoardRequest } from 'src/apis/board';
import { GetBoardResponseDto } from 'src/apis/board/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { PutBoardRequestDto } from 'src/apis/board/dto/request';
import useUserStore from 'src/stores/user.store';
import { CUSTOMER_SUPPORT_ABSOLUTE_PATH, CUSTOMER_SUPPORT_DETAIL_ABSOLUTE_PATH } from 'src/constants';
import axios from 'axios';

//                    component                    //
export default function SupportUpdate() {

    //                    state                    //
    const fileRef = useRef<HTMLInputElement | null>(null);
    const contentsRef = useRef<HTMLTextAreaElement | null>(null);

    const { loginUserId, loginUserRole } = useUserStore();
    const { receptionNumber } = useParams();
    const [cookies] = useCookies();
    const [writerId, setWriterId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [contents, setContents] = useState<string>('');

    const [fileUpload , setFileUpload] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<{name: string, url: string}[]>([]);
    const [fileRevise, setFileRevise] = useState<number | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    //                    function                    //
    const navigator = useNavigate();

    const getBoardResponse = (result: GetBoardResponseDto | ResponseDto | null) => {
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

        const { writerId, title, contents, status, imageUrl } = result as GetBoardResponseDto;
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
        setWriterId(writerId);
        setImageUrls(imageUrl)
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

    const onPostButtonClickHandler = async () => {
        if (!title.trim() || !contents.trim()) return; 
        if (!cookies.accessToken || !receptionNumber) return;

        const urlList: string[] = [];

        for (const file of fileUpload) {
            const data = new FormData();
            data.append('file', file);
            const url = await axios.post("http://localhost:4500/rdrg/file/upload", data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(response => response.data as string).catch(error => null);
            if (!url) continue;
            
            urlList.push(url);
        }

        const requestBody: PutBoardRequestDto = { title, contents, urlList };

        putBoardRequest(receptionNumber, requestBody, cookies.accessToken).then(putBoardResponse);
    };


    const onFileUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];
        const name = file.name;
        const url = URL.createObjectURL(file);

        const uploadedFileCount = filePreviews.length + imageUrls.length;

        if (uploadedFileCount >= 3) {
            alert('파일은 최대 3개까지 업로드할 수 있습니다.');
            return;
        }

        if (fileRevise !== null) {
            const fileUpdate = [...fileUpload];
            const showFile = [...filePreviews];

            if (fileRevise < 3) {
                fileUpdate[fileRevise] = file;
                showFile[fileRevise] = { name, url };
                setFileRevise(null);
            }
                setFileUpload(fileUpdate);
                setFilePreviews(showFile);
        } else {
            if (fileUpload.length < 3) {
                setFileUpload([...fileUpload, file]);
                setFilePreviews([...filePreviews, {name, url}]);
            }
        } 
    };


    const onFileUploadButtonClickHandler = () => {
        if (!fileRef.current) return;
        fileRef.current.click();
    };

    const onFileReviseButtonClickHandler = (index: number) => {
        setFileRevise(index);
        if (fileRef.current) {
            fileRef.current.click();
        }
    };

    const onFileDeleteButtonClickHandler = (index: number) => {
        const fileUpdate = fileUpload.filter((_, i) => i !== index);
        const showFileUpdate = filePreviews.filter((_, i) => i !== index);
        setFileUpload(fileUpdate);
        setFilePreviews(showFileUpdate);
    };

    const onImageDeleteClickHandler = (index: number) => {
        // const updatedImageUrls = imageUrls.filter((_, idx) => idx !== index);
        const updatedImageUrls = [...imageUrls];
        updatedImageUrls.splice(index, 1);
        setImageUrls(updatedImageUrls);
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
                    <div>
                        <div>
                            {imageUrls.length ? imageUrls.map((url, index) => (
                            <div key={index}>
                                <img src={url} width="150px" height="auto" title="file-viewer" />
                                <button onClick={() => onImageDeleteClickHandler(index)}>삭제</button>
                            </div>
                            )) : (
                            <p style={{margin: '10px' , color: 'red'}}>첨부된 파일이 없습니다.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <input ref={fileRef} style={{ display: 'none' }} type="file" multiple className="fileUpload" onChange={onFileUploadChangeHandler}/>
                        <div style={{ margin: '5px 0px' ,padding: '10px', display: 'line-block' , color: 'white' , backgroundColor: 'green' }} onClick={onFileUploadButtonClickHandler}>클릭해서 추가로 파일을 첨부합니다.</div>
                        <div>
                        {filePreviews.map((preview, index) => (
                            <div key={index}>
                                <img src={preview.url} alt={preview.name} width="70" height="50"/>
                                <p>{preview.name}</p>
                                <button style={{display: 'flex'}} onClick={() => onFileReviseButtonClickHandler(index)}>수정</button>
                                <button onClick={() => onFileDeleteButtonClickHandler(index)}>삭제</button>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>               
                <div className="cs-write-button">
                    <div className='customer-support-button' onClick={onPostButtonClickHandler}>취소</div>
                    <div className='customer-support-button' onClick={onPostButtonClickHandler}>수정</div>
                </div>
            </div>
        </>
    );
}