import React, { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/locale"
import './style.css'
import { setHours, setMinutes } from 'date-fns';


type ExampleCustomInputProps = { value: string; onClick: () => void; };

const ExampleCustomInput = forwardRef<HTMLButtonElement, ExampleCustomInputProps>(
    ({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}> {value} </button>));

const datePickerProps = (selected: Date | null, startDate: Date | null, endDate: Date | null, onChange: (date: Date | null) => void) => ({
    local: ko,
    dateFormatCalendar:  "yyyy.MM.dd (eee)",
    selected,
    showPopperArrow: false,
    minDate: new Date(),
    dateFormat: "yyyy년 MM월 dd일 HH시 mm분",
    showTimeSelect: true,
    timeIntervals: 60,
    minTime: setHours(setMinutes(new Date(), 0), 8),
    maxTime: setHours(setMinutes(new Date(), 0), 18),
    customInput: <ExampleCustomInput value={startDate ? startDate.toLocaleDateString() : ''} onClick={() => {}} />,
    onChange,
    startDate,
    endDate
})

const ReactDatePicker = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const onStartChangeHandler = (date: Date | null) => {
        if (date !== null) setStartDate(date);
    }
    const onEndChangeHandler = (date: Date | null) => {
        if (date !== null) setEndDate(date);
    }

    return (
    <div className='date-picker-wrapper'>
        <DatePicker {...datePickerProps(startDate, startDate, endDate, onStartChangeHandler)} />
        <DatePicker {...datePickerProps(endDate, startDate, endDate, onEndChangeHandler)} />
    </ div>
    );
};

export default ReactDatePicker;
