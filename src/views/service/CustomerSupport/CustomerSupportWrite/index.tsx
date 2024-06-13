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
    const [fileRevise, setFileRevise] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    //                    function                    //
    const navigator = useNavigate();

    const postBoardResponse = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '제목과 내용을 모두 입력해주세요.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'FUF' ? '파일 업로드에 실패했습니다.' :
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
        if(title.length > 100) return;
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
            const url = await axios.post("http://localhost:4500/rdrg/file/upload", data, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(response => response.data as string)
                .catch(error => null);
            if (!url) continue;
            
            urlList.push(url);
        }

        const requestBody: PostBoardRequestDto = { title, contents, urlList };

        postBoardRequest(requestBody, cookies.accessToken).then(postBoardResponse);
    };

    // 첨부파일 업로드에 관힌 Handler
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
        
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onFileReviseButtonClickHandler = (index: number) => {
        setFileRevise(index);
        if (fileRef.current) {
            fileRef.current.click();
        }
    }

    const onCancelButtonClickHandler = () => {
        navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
    }

    //                    effect                    //
    useEffect(() => {
        if (loginUserRole === 'ROLE_ADMIN') {
            navigator(CUSTOMER_SUPPORT_ABSOLUTE_PATH);
            return;
        }
    },[loginUserRole]);
    
    //                    render                    //
    return( 
        <>
            <div className='cs-image'>문의게시판</div>
            <div id="cs-write-wrapper">
                <div className="cs-write-container">
                    <div className='cs-write-top'>
                        <div className='cs-write-title'>제목</div>
                        <div className='cs-write-title-box'>
                            <input className='cs-write-title-input' placeholder='제목을 입력해주세요' value={title} onChange={onTitleChangeHandler}/>
                        </div>
                    </div>

                    <div className="cs-write-middle">
                        <div className='cs-write-middle-title'>내용</div>
                        <div className='cs-write-contents-box'>
                            <textarea ref={contentsRef} className='cs-write-contents-textarea' placeholder='내용을 입력해주세요 / 1000자' maxLength={1000} value={contents} onChange={onContentsChangeHandler}/>
                        </div>
                    </div>

                    <div className='cs-write-bottom'>
                        <div className='cs-write-bottom-title'>파일첨부</div>
                        <div className='cs-write-file-box'>
                            <input ref={fileInputRef} style={{ display: 'none' }} type="file" multiple onChange={onFileUploadChangeHandler} />
                        <div className='cs-file-upload-button' onClick={onFileUploadButtonClickHandler} >사진 추가</div>
                        <div>
                        <div className="file-arrangement" onDrop={onDropHandler} onDragOver={onDragOverHandler} >
                            {filePreviews.length === 0 && "파일을 여기에 넣으세요. 단, 파일 첨부는 최대 3개까지 가능합니다."}                            
                            {filePreviews.map((preview, index) => (
                            <div key={index} className="file-preview">
                                <button className="image-delete-button" onClick={() => onFileDeleteButtonClickHandler(index)}>X</button>
                                <img src={preview.url} alt={preview.name} className="file-preview-name" />
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
                    <div className='customer-support-button' onClick={onPostButtonClickHandler}>올리기</div>
                </div>
            </div>
        </>
    );
};