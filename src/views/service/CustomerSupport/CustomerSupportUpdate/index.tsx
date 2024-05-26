import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css'

import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { getBoardRequest, postBoardRequest, putBoardRequest } from 'src/apis/board';
import { GetBoardResponseDto } from 'src/apis/board/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { PostBoardRequestDto, PutBoardRequestDto } from 'src/apis/board/dto/request';
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

        const { writerId, title, contents, status } = result as GetBoardResponseDto;
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

    const onUpdateButtonClickHandler = () => {
        if (!cookies.accessToken || !receptionNumber) return;
        if (!title.trim() || !contents.trim()) return;

        const requestBody: PutBoardRequestDto = { title, contents };
        putBoardRequest(receptionNumber, requestBody, cookies.accessToken).then(putBoardResponse);
    };

    const onPostButtonClickHandler = async () => {
        if (!title.trim() || !contents.trim()) return; 
        if (!cookies.accessToken) return;

        const urlList: string[] = [];

        for (const file of fileUpload) {
            const data = new FormData();
            data.append('file', file);
            const url = await axios.post("http://localhost:4500/rdrg/file/upload", data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(response => response.data as string).catch(error => null);
            if (!url) continue;
            
            urlList.push(url);
        }

        const requestBody: PostBoardRequestDto = { title, contents, urlList };

        postBoardRequest(requestBody, cookies.accessToken).then(putBoardResponse);
    };

    // const onFileUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    //     const fileUpload = event.target.files;
    //     setFileUpload(fileUpload);
    // };

    const onFileUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];
        // setFileUpload([...fileUpload, file]);
        const name = file.name;
        const url = URL.createObjectURL(file);
        // setFilePreviews([...filePreviews, {name, url}]);

        if (fileRevise !== null) {
            const fileUpdate = [...fileUpload];
            fileUpdate[fileRevise] = file;
            const showFile = [...filePreviews];
            showFile[fileRevise] = { name, url };

            setFileUpload(fileUpdate)
            setFilePreviews(showFile)
            setFileRevise(null);
        } else {
            setFileUpload([...fileUpload, file]);
            setFilePreviews([...filePreviews, {name, url}]);
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
    }

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
                        <input ref={fileRef} style={{ display: 'none' }} type="file" multiple className="fileUpload" onChange={onFileUploadChangeHandler}/>
                        <div style={{ padding: '12px', display: 'line-block', width: 'fit-content' }} onClick={onFileUploadButtonClickHandler}>파일 첨부</div>
                        <div>
                        {filePreviews.map((preview, index) => (
                            <div key={index}>
                                <img src={preview.url} alt={preview.name} width="70" height="50"/>
                                <p>{preview.name}</p>
                                <button style={{display: 'flex'}} onClick={() => onFileReviseButtonClickHandler(index)}>파일 수정</button>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                
                <div className="cs-write-button">
                    <div className='customer-support-button' onClick={onUpdateButtonClickHandler}>수정</div>
                </div>
            </div>
        </>
    );
}