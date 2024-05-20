import React from 'react';
import useAuthenticationStore from 'src/stores/AuthenticationStore';

const AuthComponent = () => {
  const { signIn, setSignIn, signUp, setSignUp } = useAuthenticationStore();

  // 예제 핸들러
  const handleSignIn = () => {
    const signInData = { /* 로그인 데이터 */ };
    setSignIn(signIn);
    console.log('로그인:', signIn);
  };

  const handleSignUp = () => {
    const signUpData = { /* 회원가입 데이터 */ };
    setSignUp(signUp);
    console.log('회원가입:', signUp);
  };

  return (
    <div>
      <button onClick={handleSignIn}>로그인</button>
      <button onClick={handleSignUp}>회원가입</button>
      <div>
        <p>현재 로그인 데이터: {JSON.stringify(signIn)}</p>
        <p>현재 회원가입 데이터: {JSON.stringify(signUp)}</p>
      </div>
    </div>
  );
};

export default AuthComponent;
