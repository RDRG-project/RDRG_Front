import React, { ChangeEvent, useState } from 'react'
import InputBox from 'src/components/Inputbox'
import './style.css'

export default function MypageUnRegister() {

    //                    state                    //
    const [password, setPassword] = useState<string>('');
    
    const [message, setMessage] = useState<string>('');

    //                    event handler                    //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setMessage('');
    }

    //                    render                    //
    return (
        <div className='unregister-contents'>
            <div className='unregister-contents-title'>회원 탈퇴</div>
            <div className='unregister-contents-text'>
                <div><br/><ul><li> 회원탈퇴 전, 유의사항을 확인해주시기 바랍니다.</li></ul></div>
                <div className='unregister-contents-text-detail'> 
                - 회원탈퇴 시 회원전용 웹 서비스 이용이 불가합니다.<br/>
                - 상법 및 '전자상거래 등에서 소비자 보호에 관한 법률' 등 관련 법령의 규정에 의하여 다음과 같이 ‘거래 관련 관리의무 관계 확인’ 등을 이유로 일정 기간 보관됩니다.
                    <br/>- 계약 또는 청약 철회 등에 관한 기록 : 5년
                    <br/>- 대금결제 및 재화 등의 공급에 관한 기록 : 5년
                    <br/>- 소비자의 불만 또는 분쟁 처리에 관한 기록 : 3년<br/>
                - 이미 결제가 완료된 건은 탈퇴로 취소되지 않습니다.<br/>
                <br/>
                </div>
            </div>
            <div className='unregister-contents-password'>
            <InputBox label="현재 비밀번호" type="password" value={password} placeholder="계정을 삭제하려면 현재 비밀번호를 입력해주세요." onChangeHandler={onPasswordChangeHandler} />
            </div>
            <div className='unregister-contents-message'>계정삭제시 모든 게시물이 삭제되며 복구 불가능합니다.</div>
            <div className='checkbox-container'><input type="checkbox"/>동의합니다.</div>
            <button className='final-check-button'>탈 퇴 하 기</button>
        </div>
    )
}