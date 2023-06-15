import { useEffect, useRef, useState } from 'react';
import DatePicker, { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { CalendarIcon } from '@/components/icons/index';

const myCustomLocale = {
  // months list by order
  months: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ],

  // week days by order
  weekDays: [
    {
      name: 'Chủ nhật', // used for accessibility
      short: 'CN', // displayed at the top of days' rows
      isWeekend: true // is it a formal weekend or not?
    },
    {
      name: 'Thứ 2',
      short: 'T.2'
    },
    {
      name: 'Tuesday',
      short: 'T.3'
    },
    {
      name: 'Wednesday',
      short: 'T.4'
    },
    {
      name: 'Thursday',
      short: 'T.5'
    },
    {
      name: 'Friday',
      short: 'T.6'
    },
    {
      name: 'Saturday',
      short: 'T.7',
      isWeekend: true
    }
  ],
  weekStartingIndex: 0,

  // return a { year: number, month: number, day: number } object
  getToday(gregorainTodayObject) {
    return gregorainTodayObject;
  },

  // return a native JavaScript date here
  toNativeDate(date) {
    return new Date(date.year, date.month - 1, date.day);
  },

  // return a number for date's month length
  getMonthLength(date) {
    return new Date(date.year, date.month, 0).getDate();
  },

  // return a transformed digit to your locale
  transformDigit(digit) {
    return digit;
  },

  // texts in the date picker
  nextMonth: 'Next Month',
  previousMonth: 'Previous Month',
  openMonthSelector: 'Open Month Selector',
  openYearSelector: 'Open Year Selector',
  closeMonthSelector: 'Close Month Selector',
  closeYearSelector: 'Close Year Selector',
  defaultPlaceholder: 'Select...',

  // for input range value
  from: 'from',
  to: 'to',

  // used for input value when multi dates are selected
  digitSeparator: ',',

  // if your provide -2 for example, year will be 2 digited
  yearLetterSkip: 0,

  // is your language rtl or ltr?
  isRtl: false
};

export const GLXDatePicker = ({ defaultValue, placeholder, name, label, onChange = () => {}, minimumDate }) => {
  const firsLoad = useRef(false);
  const time = new Date(defaultValue * 1000);
  const defaultTime = defaultValue
    ? { year: time.getFullYear(), month: time.getMonth() + 1, day: time.getDate() }
    : null;
  const [selectedDay, setSelectedDay] = useState(defaultValue ? defaultTime : null);
  const value = selectedDay ? selectedDay.day + '/' + selectedDay.month + '/' + selectedDay.year : '';
  useEffect(() => {
    if (!firsLoad.current) {
      firsLoad.current = true;
      return;
    }
    const time = selectedDay ? new Date(selectedDay.year, selectedDay.month - 1, selectedDay.day).getTime() / 1000 : '';
    const event = { target: { name: name, value: time } };
    onChange(event);
  }, [selectedDay]);

  const nowDay = utils().getToday();
  return (
    <div>
      {label && (
        <label className="mb-4" htmlFor={name}>
          {label}
        </label>
      )}
      <DatePicker
        minimumDate={minimumDate ? { ...nowDay, day: nowDay.day + 1 } : null}
        renderInput={({ ref }) => (
          <div className="text-sm max-w-[400px] min-w-[160px]">
            <input
              placeholder={placeholder}
              type="text"
              id={name}
              ref={ref}
              value={value}
              onChange={() => {}}
              name={name}
              // autoComplete={false}
              className="focus:outline-none text-caption-1 text-gray duration-200 p-3 py-2.5  border-silver focus:border-purple border-[1px] rounded-lg w-full flex items-center relative"
            />
            <div
              className="w-6 h-6 ml-auto absolute top-[50%] right-[10px] translate-y-[-50%] flex items-center action"
              style={{ pointerEvents: 'none' }}
            >
              <CalendarIcon />
            </div>
          </div>
        )}
        value={selectedDay}
        onChange={setSelectedDay}
        colorPrimary="#5551FF"
        locale={myCustomLocale}
      />
      {/* <Calendar /> */}
    </div>
  );
};
