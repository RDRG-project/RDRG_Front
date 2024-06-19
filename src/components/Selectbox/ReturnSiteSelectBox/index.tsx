import { useEffect } from 'react';

import { useReturnStore } from 'src/stores';

import './style.css';

const RentSiteListItem = [
    { name: '서울', value: '서울' },
    { name: '부산', value: '부산' }
];

//                    interface                    //
interface Prop {
    value: string;
    onChange: (value: string) => void;
}

//                    component                    //
export default function ReturnSiteSelectBox({ value, onChange }: Prop) {

    //                    state                    //
    const { returnShow, setReturnShow, returnSelectedItem, setReturnSelectedItem, setReturnSite } = useReturnStore();

    //                    event handler                    //
    const onItemClickHandler = (value: string) => {
        
        onChange(value);
        setReturnShow(true);
        setReturnSite(value);
        setReturnSelectedItem(value);
    };
    
    const onButtonClickHandler = () => setReturnShow(!returnShow);

    //                    effect                    //
    useEffect(() => {
        setReturnSelectedItem(value || '');
    }, [value]);

    //                    render                    //
    return (
        <div id='rent-select-wrapper'>
            <div className='select-box-container'>
                <div className='select-item-title'>반납지점</div>
                <div className={returnShow ? 'spot-close-button' : 'spot-open-button'} onClick={onButtonClickHandler}></div>
            </div>
            {returnShow &&
                <div className='select-list'>
                    {RentSiteListItem.map((item) =>
                        <div 
                            key={item.value}
                            className={returnSelectedItem === item.value ? 'select-list-item-selected' : 'select-list-item-box'}
                            onClick={() => onItemClickHandler(item.value)}>
                            <div className='select-item'>{item.name}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}