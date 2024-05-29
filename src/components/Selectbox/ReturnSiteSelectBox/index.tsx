import { useState } from 'react';
import './style.css';
import { useReturnSiteStore, useSiteShowStore } from 'src/stores';

interface Prop {
    value: string;
    onChange: (value: string) => void;
}

export default function ReturnSiteSelectBox({ value, onChange }: Prop) {
    const RentSiteListItem = [
        { name: '서울', value: 'SEOUL' },
        { name: '부산', value: 'BUSAN' }
    ];

    const { show, setShow } = useSiteShowStore();
    const [selectedItem, setSelectedItem] = useState<string>('');
    const { setReturnSite } = useReturnSiteStore();

    const onButtonClickHandler = () => {
        setShow(!show);
    };

    const onItemClickHandler = (value: string) => {
        setSelectedItem(value);
        onChange(value);
        setReturnSite(value);
        setShow(true);
    };

    return (
        <div className='select-box'>
            <div className='select-item-title'>반납지점</div>
            <div className={show ? 'select-close-button' : 'select-open-button'} onClick={onButtonClickHandler}></div>
            {show &&
                <div className='select-list'>
                    {RentSiteListItem.map((item) =>
                        <div
                            key={item.value}
                            className={selectedItem === item.value ? 'select-list-item-selected' : 'select-list-item-box'}
                            onClick={() => onItemClickHandler(item.value)}>
                            <div className='select-item'>{item.name}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}