import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import "./style.css";

import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { emailAuthCheckRequest, emailAuthRequest, idCheckRequest, signInRequest, signUpRequest } from 'src/apis/auth';
import { EmailAuthCheckRequestDto, EmailAuthRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto } from 'src/apis/auth/dto/request';
import { SignInResponseDto } from 'src/apis/auth/dto/response';
import ResponseDto from 'src/apis/response.dto';
import InputBox from 'src/components/Inputbox';
import { HOME_ABSOLUTE_PATH } from 'src/constants';
import useAuthenticationStore from 'src/stores/authentication.store';

//                    component                    //
export function Sns () {

    //                    state                    //
    const { accessToken, expires } = useParams();
    const [cookies, setCookie] = useCookies();

    //                    function                    //
    const navigator = useNavigate();

    //                    effect                    //
    useEffect(() => {
        if (!accessToken || !expires) return;
        const expiration = new Date(Date.now() + (Number(expires) * 1000));
        setCookie('accessToken', accessToken, { path: '/', expires: expiration });

        navigator(HOME_ABSOLUTE_PATH);

    }, []);

    //                    render                    //
    return <></>;
}

//                    type                    //
type AuthPage = 'sign-in' | 'sign-up';

//                    interface                    //
interface SnsContainerProps {
    title: string;
}

//                    component                    //
function SnsContainer({ title }: SnsContainerProps) {

    //                    state                    //
    const {authPage, setAuthPage} = useAuthenticationStore();

    //                    event handler                    //
    const onSnsButtonClickHandler = (type: 'kakao' | 'naver') => {
        window.location.href = 'http://localhost:4500/rdrg/auth/oauth2/' + type; 
        
    };

    //                    render                    //
    return (
        <div className="authentication-sns-container">
            {authPage === 'sign-in' ?
            <div className="sns-container-title">{title}</div> 
            :
            <div className='sns-container-divide'>
                <div className='guide-line'></div>
                <div className="sns-container-title">{title}</div>
                <div className='guide-line'></div>
            </div>
            }
            <div className="sns-button-container">
                <div className="sns-button kakao-button" onClick={() => onSnsButtonClickHandler('kakao')}></div>
                <div className="sns-button naver-button" onClick={() => onSnsButtonClickHandler('naver')}></div>
            </div>
        </div>
    );
}

//                    interface                    //
interface Props {
    onLinkClickHandler: () => void
}

//                    component                    //
function SignIn({ onLinkClickHandler }: Props) {

    //                    state                    //
    const [cookies, setCookie, removeCookie] = useCookies();
    const [id, setId] = useState<string>(cookies.savedId || '');
    const [password, setPassword] = useState<string>('');
    const [saveId, setSaveId] = useState<boolean>(!!cookies.savedId);
    const [message, setMessage] = useState<string>('');

    //                    function                    //
    const navigator = useNavigate();

    const signInResponse = (result: SignInResponseDto | ResponseDto | null) => {
    
    const message =
    !result ? '서버에 문제가 있습니다.' :
    result.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' :
    result.code === 'SF' ? '로그인 정보가 일치하지 않습니다.' :
    result.code === 'TF' ? '서버에 문제가 있습니다.' :
    result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    setMessage(message);
    
    const isSuccess = result && result.code === 'SU';
    if (!isSuccess) return;
    
    const { accessToken, expires } = result as SignInResponseDto;
    const expiration = new Date(Date.now() + (expires * 1000));
    setCookie('accessToken', accessToken, { path: '/', expires: expiration });
    
    if (saveId) {
        setCookie('savedId', id, { path: '/' });
    } else {
        removeCookie('savedId', { path: '/' });
    }

    navigator(HOME_ABSOLUTE_PATH);
};


    //                    event handler                    //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value);
        setMessage('');
    };

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setMessage('');
    };

    const onPasswordKeydownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        onSignInButtonClickHandler();
    }

    const onSignInButtonClickHandler = () => {
        
        if (!id || !password) {
            setMessage('아이디와 비밀번호를 모두 입력하세요.');
            return;
        }

        const requestBody: SignInRequestDto = {
            userId: id,
            userPassword: password
        }
        signInRequest(requestBody).then(signInResponse);
        
    };

    const onSaveIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setSaveId(event.target.checked);
    };

    //                    effect                    //
    useEffect(() => {
        if (cookies.savedId){
            setId(cookies.savedId);
            setSaveId(true);   
        }
    }, []);

    //                    render                    //
    return (
        <div className="authentication-contents">
            <div className="authentication-input-container">
                <InputBox label="아이디" type="text" value={id} placeholder="아이디를 입력해주세요" onChangeHandler={onIdChangeHandler} />
                <InputBox label="비밀번호" type="password" value={password} placeholder="비밀번호를 입력해주세요" onChangeHandler={onPasswordChangeHandler} onKeydownHandler={onPasswordKeydownHandler} message={message} error />
            </div>
            <div className="saveId">
                <input type="checkbox" className="saveId-cb" checked={saveId} onChange={onSaveIdChangeHandler} />
                <div className="saveId">아이디 저장</div>
            </div>
            <div className='authentication-button-container'>
                <button className="primary-button full-width" onClick={onSignInButtonClickHandler}>로그인</button>
            </div>
            <SnsContainer title="SNS로 간편하게 시작하기" />
        </div>
    );
}



//                    component                    //
export function SignUp({ onLinkClickHandler }: Props) {

    //                    state                    //
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');

    const [idButtonStatus, setIdButtonStatus] = useState<boolean>(false);
    const [emailButtonStatus, setEmailButtonStatus] = useState<boolean>(false);
    const [authNumberButtonStatus, setAuthNumberButtonStatus] = useState<boolean>(false);

    const [isIdCheck, setIdCheck] = useState<boolean>(false);
    const [isPasswordPattern, setPasswordPattern] = useState<boolean>(false);
    const [isEqualPassword, setEqualPassword] = useState<boolean>(false);
    const [isEmailCheck, setEmailCheck] = useState<boolean>(false);
    const [isAuthNumberCheck, setAuthNumberCheck] = useState<boolean>(false);

    const [idMessage, setIdMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

    const [isIdError, setIdError] = useState<boolean>(false);
    const [isEmailError, setEmailError] = useState<boolean>(false);
    const [isAuthNumberError, setAuthNumberError] = useState<boolean>(false);

    const isSignUpActive = isIdCheck && isEmailCheck && isAuthNumberCheck && isPasswordPattern && isEqualPassword;
    const signUpButtonClass = `${isSignUpActive ? 'primary' : 'disable'}-button full-width`;

    //                    function                    //
    const idCheckResponse = (result: ResponseDto | null) => {

        const idMessage = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '아이디 형식이 아닙니다.' :
            result.code === 'DI' ?  '이미 사용중인 아이디입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' :
            result.code === 'SU' ? '사용 가능한 아이디입니다.' : '';
        const idError = !(result && result.code === 'SU');
        const idCheck = !idError;

        setIdMessage(idMessage);
        setIdError(idError);
        setIdCheck(idCheck);

    };

    const emailAuthResponse = (result: ResponseDto | null) => {

        const emailMessage = 
            !result ? '서버에 문제가 있습니다.' : 
            result.code === 'VF' ? '이메일 형식이 아닙니다.' :
            result.code === 'DE' ? '중복된 이메일입니다.' :
            result.code === 'MF' ? '인증번호 전송에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : 
            result.code === 'SU' ? '인증번호가 전송되었습니다.' : '';
        const emailCheck = result !== null && result.code === 'SU';
        const emailError = !emailCheck;

        setEmailMessage(emailMessage);
        setEmailCheck(emailCheck);
        setEmailError(emailError);

    };

    const emailAuthCheckResponse = (result: ResponseDto | null) => {

        const authNumberMessage = 
            !result ? '서버에 문제가 있습니다.' : 
            result.code === 'VF' ? '인증번호를 입력해주세요.' : 
            result.code === 'AF' ? '인증번호가 일치하지 않습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' :
            result.code === 'SU' ? '인증번호가 확인되었습니다.' : '';
        const authNumberCheck = result !== null && result.code === 'SU';
        const authNumberError = !authNumberCheck;

        setAuthNumberMessage(authNumberMessage);
        setAuthNumberCheck(authNumberCheck);
        setAuthNumberError(authNumberError);

    };

    const signUpResponse = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '입력 형식이 맞지 않습니다.' : 
            result.code === 'DI' ? '이미 사용중인 아이디입니다.' :
            result.code === 'DE' ? '중복된 이메일입니다.' :
            result.code === 'AF' ? '인증번호가 일치하지 않습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

        const isSuccess = result && result.code === 'SU';
        if (!isSuccess) {
            alert(message);
            return;
        }
        onLinkClickHandler();

    };

    //                    event handler                    //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
        // @Pattern(regexp="^[a-zA-Z0-9]{4,12}$") -> back 패턴
        // const idPattern =    ;
        // const isIdPattern = idPattern.test(value);
        // setIdButtonStatus(isIdPattern);
        setIdButtonStatus(value !== '');
        setIdCheck(false);
        setIdMessage('');
    };

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=\[\]{}|\\;:‘“<>.,?\/]).{8,19}$/;
        const isPasswordPattern = passwordPattern.test(value);
        setPasswordPattern(isPasswordPattern);

        const passwordMessage = 
            isPasswordPattern ? '' : 
            value ? '영어 대소문자, 숫자, 특수문자(~.!@#$%^&*()_-=+[])를 각 1개씩 포함해서 9자 이상의 비밀번호를 입력하세요' : '';
        setPasswordMessage(passwordMessage);
        
        const isEqualPassword = passwordCheck === value;
        setEqualPassword(isEqualPassword);

        const passwordCheckMessage = 
            isEqualPassword ? '' : 
            passwordCheck ? '비밀번호가 일치하지 않습니다.' : '';
        setPasswordCheckMessage(passwordCheckMessage);
    };

    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPasswordCheck(value);

        const isEqualPassword = password === value;
        setEqualPassword(isEqualPassword);

        const passwordCheckMessage = 
            isEqualPassword ? '' : 
            value ? '비밀번호가 일치하지 않습니다.' : '';
        setPasswordCheckMessage(passwordCheckMessage);
    };

    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setEmail(value);
        setEmailButtonStatus(value !== '');
        setEmailCheck(false);
        setAuthNumberCheck(false);
        setEmailMessage('');
    };

    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAuthNumber(value);
        setAuthNumberButtonStatus(value !== '');
        setAuthNumberCheck(false);
        setAuthNumberMessage('');
    };

    const onIdButtonClickHandler = () => {
        if(!idButtonStatus) return;
        if(!id || !id.trim()) return;

        const idPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,}$/;
        const isIdPattern = idPattern.test(id);
        if (!isIdPattern) {
            setIdMessage('사용할 수 없는 아이디 형식 입니다.');
            setIdError(true);
            setIdCheck(false);
            return;
        }

        const requestBody: IdCheckRequestDto = { userId: id };
        idCheckRequest(requestBody).then(idCheckResponse);
    };

    const onEmailButtonClickHandler = () => {
        if(!emailButtonStatus) return;

        const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
        const isEmailPattern = emailPattern.test(email);
        if (!isEmailPattern) {
            setEmailMessage('이메일 형식이 아닙니다.');
            setEmailError(true);
            setEmailCheck(false);
            return;
        }

        const requestBody: EmailAuthRequestDto = { userEmail: email };
        emailAuthRequest(requestBody).then(emailAuthResponse);
    };

    const onAuthNumberButtonClickHandler = () => {
        if(!authNumberButtonStatus) return;
        if(!authNumber) return;

        const requestBody: EmailAuthCheckRequestDto = {
            userEmail: email,
            authNumber
        };
        emailAuthCheckRequest(requestBody).then(emailAuthCheckResponse);
    };

    const onSignUpButtonClickHandler = () => {
        if(!isSignUpActive) return;
        if(!id || !password || !passwordCheck || !email || !authNumber) {
            alert('모든 내용을 입력해주세요.');
            return;
        }

        const requestBody: SignUpRequestDto = {
            userId: id,
            userPassword: password,
            userEmail: email,
            authNumber
        }
        signUpRequest(requestBody).then(signUpResponse);
    };

    //                    render                    //
    return (
        <div className="authentication-contents">
            <div className="authentication-input-container">
                <InputBox label="아이디" type="text" value={id} placeholder="아이디를 입력해주세요" onChangeHandler={onIdChangeHandler} 
                buttonTitle="중복 확인" buttonStatus={idButtonStatus} onButtonClickHandler={onIdButtonClickHandler} message={idMessage} error={isIdError} />

                <InputBox  label="비밀번호" type="password" value={password} placeholder="비밀번호를 입력해주세요" 
                onChangeHandler={onPasswordChangeHandler} message={passwordMessage} error />

                <InputBox label="비밀번호 확인" type="password" value={passwordCheck} placeholder="비밀번호를 입력해주세요" 
                onChangeHandler={onPasswordCheckChangeHandler} message={passwordCheckMessage} error />

                <InputBox label="이메일" type="text" value={email} placeholder="이메일을 입력해주세요" 
                onChangeHandler={onEmailChangeHandler} buttonTitle="이메일 인증" buttonStatus={emailButtonStatus} 
                onButtonClickHandler={onEmailButtonClickHandler} message={emailMessage} error={isEmailError} />

                <InputBox label="인증번호" type="text" value={authNumber} placeholder="인증번호 4자리를 입력해주세요" 
                onChangeHandler={onAuthNumberChangeHandler} buttonTitle="인증 확인" buttonStatus={authNumberButtonStatus} 
                onButtonClickHandler={onAuthNumberButtonClickHandler} message={authNumberMessage} error={isAuthNumberError} />
            </div>
            <div className="authentication-button-container">
                <div className='primary-button full-width' onClick={onSignUpButtonClickHandler}>회원가입</div>
            </div>

        </div>
    );
}


//                    component                    //
export default function Authentication() {

    //                    state                    //
    const {authPage, setAuthPage} = useAuthenticationStore();

    //                    event handler                    //
    const onLinkClickHandler = () => {
        if (authPage === 'sign-in') setAuthPage('sign-up');
        else setAuthPage('sign-in');
    }; 

    //                    constant                   //
    const AuthenticationContents = 
        authPage === 'sign-in' ? 
            <SignIn onLinkClickHandler={onLinkClickHandler} /> : 
            <SignUp onLinkClickHandler={onLinkClickHandler} />;
    
    // const signUpButtonClass = `${AuthenticationContents ? 'disable' : 'primary'}-button full-width`;
    
    const authenticationTitle =
        authPage === 'sign-in' ? '로그인': '회원가입';
    
    //                    render                    //
    return (
        <div id="authentication-wrapper">
            <div className='circle'></div>
            <div className="authentication-container">
                <div className="authentication-title">
                    {authenticationTitle}
                </div>
                { AuthenticationContents }
            </div>
            <div className='authentication-guide-container'>
                {authPage === 'sign-in' ? 
                <div className='authentication-sign-in-container'>
                    <div className='authentication-guide-box'>
                        <div className='guide-line'></div>
                        <div className='guide-title'>아직 회원이 아니신가요?</div>
                        <div className='guide-line'></div>
                    </div>
                    <div className='disable-button full-width' onClick={onLinkClickHandler}>회원가입</div>
                </div>
                :
                <div className='authentication-sign-up-container'>
                    <SnsContainer title="SNS 회원가입" />
                    <div className='disable-button full-width' onClick={onLinkClickHandler}>로그인</div>
                </div>
                }
            </div>
        </div>
    );
}

