import React from 'react'
import "../../layouts/HomeContainer/index"
import './style.css'

export default function Home() {
  return (
    <div id='wrapper'>
      <div className='main-top'>
        <div className='main-top-content'>당신의 일상에 편리함을 제공합니다.</div>
        <div className='main-top-image'></div>
      </div>
      <div className='main-body'>대여방법</div>
      <div className='main-foot'>파손 면책 안내</div>
    </div>
  );
}
