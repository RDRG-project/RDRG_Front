import React from 'react'
import './style.css'

export default function BranchInformation() {
  return (
    <div id='place-wrapper'>
      <div className='place-page'>
        <h1 className='title'><strong>지점안내</strong></h1>
        <div className='place-guide'>
          <div className='place'>
            <div className='place-seoul'>서울역 지점</div>
            <div className='place-seoul-image'></div>
          </div>
          <div className='place'>
            <div className='place-busan'>부산역 지점</div>
            <div className='place-busan-image'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
