import { ChangeEvent, useEffect, useRef, useState } from "react";
import './style.css'
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { postBoardRequest } from "src/apis/board";
import { PostBoardRequestDto } from "src/apis/board/dto/request";
import ResponseDto from "src/apis/response.dto";
import { CUSTOMER_SUPPORT_ABSOLUTE_PATH } from "src/constants";
import useUserStore from "src/stores/user.store";
import axios from "axios";

//                    component                    //
export default function SupportWrite() {
    //                    state                    //
    const contentsRef = useRef<HTMLTextAreaElement | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const { loginUserRole } = useUserStore();
    const [cookies] = useCookies();
    const [title, setTitle] = useState<string>('');
    const [contents, setContents] = useState<string>('');

    const [fileUpload , setFileUpload] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<{name: string, url: string}[]>([]);

    //                    function                    //
    const navigator = useNavigate();

    const postBoardResponse = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '제목과 내용을 모두 입력해주세요.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);

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

        postBoardRequest(requestBody, cookies.accessToken).then(postBoardResponse);
    };

    // const onFileUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    //     const fileUpload = event.target.files;
    //     setFileUpload(fileUpload);
    // };

    const onFileUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];
        setFileUpload([...fileUpload, file]);
        const name = file.name;
        const url = URL.createObjectURL(file);
        setFilePreviews([...filePreviews, {name, url}]);
    };

    const onFileUploadButtonClickHandler = () => {
        if (!fileRef.current) return;
        fileRef.current.click();
    };

    //                    effect                    //
    useEffect(() => {
        if (loginUserRole === 'ROLE_ADMIN') {
            navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
            return;
        }
    },[loginUserRole]);
    
    //                    render                    //
    return( 
        <div id="cs-write-wrapper">
            <div className='cs-write-top'>
                <div className='cs-write-title-box'>
                    <input className='cs-write-title-input' placeholder='제목을 입력해주세요.' value={title} onChange={onTitleChangeHandler}/>
                    
                </div>
                <div className='primary-button' onClick={onPostButtonClickHandler}>올리기</div>
            </div>
            <div className='cs-write-contents-box'>
                <textarea ref={contentsRef} className='cs-write-contents-textarea' placeholder='내용을 입력해주세요. / 1000자' maxLength={1000} value={contents} onChange={onContentsChangeHandler}/>
                
            </div>
            <div></div>
            <input ref={fileRef} style={{ display: 'none' }} type="file" multiple className="fileUpload" onChange={onFileUploadChangeHandler}/>
            <div style={{ padding: '12px', display: 'line-block', backgroundColor: 'rgba(0, 255, 0, 0.3)', width: 'fit-content' }} onClick={onFileUploadButtonClickHandler}>파일 첨부</div>
            {filePreviews.map(url => <div><span>{url.name}</span><img style={{ width: '80px' }} src={url.url} /></div>)}
        </div>
        );
};