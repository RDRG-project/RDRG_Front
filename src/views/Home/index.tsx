import "../../layouts/HomeContainer/index"

import './style.css'

//                    component                    //
export default function Home() {

    //                    render                    //
    return (
        <div id='home-wrapper'>
            <div className='main-image'></div>
            <div className='main-rent'></div>
            <div className='main-guideline'></div>
        </div>
    );
};