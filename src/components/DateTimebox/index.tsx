import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/locale";
import './style.css';
import { setHours, setMinutes, addHours, isAfter, isBefore, differenceInDays, differenceInHours } from 'date-fns';
import { useRentDateStore, useTotalRentTimeStore } from 'src/stores';

const ExampleCustomInput = forwardRef<HTMLButtonElement, { value: string; onClick: () => void }>(
    ({ value, onClick }, ref) => (
        <button className="example-custom-input" onClick={onClick} ref={ref}>
            {value}
        </button>
    )
);

const datePickerProps = (selected: Date | null, startDate: Date | null, endDate: Date | null, onChange: (date: Date | null) => void) => ({
    locale: ko,
    dateFormatCalendar: "yyyy.MM.dd (eee)",
    selected,
    showPopperArrow: false,
    minDate: new Date(),
    dateFormat: "yyyy년 MM월 dd일 HH시",
    showTimeSelect: true,
    timeIntervals: 60,
    timeFormat: "HH:mm",
    minTime: setHours(setMinutes(new Date(), 0), 8),
    maxTime: setHours(setMinutes(new Date(), 0), 18),
    customInput: <ExampleCustomInput value={startDate ? startDate.toLocaleDateString() : ''} onClick={() => {}} />,
    onChange,
    startDate,
    endDate
});

const ReactDatePicker = () => {
    const { startDate, setStartDate, endDate, setEndDate } = useRentDateStore();
    const { totalRentTime, setTotalRentTime } = useTotalRentTimeStore();

    const onStartChangeHandler = (date: Date | null) => {
        if (date !== null) {
            setStartDate(date);
            const newEndDate = addHours(date, 1); // 대여 날짜 이후로 한 시간 추가
            setEndDate(newEndDate);
            calculateTotalRentTime(date, newEndDate);
        }
    }
    
    const onEndChangeHandler = (date: Date | null) => {
        if (date !== null && (!startDate || isAfter(date, startDate))) {
            setEndDate(date);
            if (startDate) {
                calculateTotalRentTime(startDate, date);
            }
        }
    }

    const calculateTotalRentTime = (start: Date, end: Date) => {
        if (isBefore(start, end)) {
            const days = differenceInDays(end, start);
            const hours = differenceInHours(end, start) % 24;
            setTotalRentTime(`${days}일 ${hours}시간`);
        } else {
            setTotalRentTime(null);
        }
    }

    return (
        <div className='date-picker-wrapper'>
            <div className="rental-date">대여 날짜 및 시간</div>
            <DatePicker {...datePickerProps(startDate, startDate, endDate, onStartChangeHandler)} />
            <div className="return-date">반납 날짜 및 시간</div>
            <DatePicker {...datePickerProps(endDate, startDate, endDate, onEndChangeHandler)} />
            {totalRentTime !== null && (
                <div className="total-rent-time">총 대여시간: {totalRentTime}</div>
            )}
        </div>
    );
};

export default ReactDatePicker;
