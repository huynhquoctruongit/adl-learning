import React, { useEffect, useState } from 'react';

const Ranger = ({ min, max, onChange, name, defaultValue }) => {
  const [state, setState] = useState({ target: defaultValue || min, data: null });
  useEffect(() => {
    if (defaultValue) {
      const slider = document.getElementById('myRange');
      const min = slider.min;
      const max = slider.max;
      const valueSlide = slider.value;
      slider.style.background = `linear-gradient(to right, #5551ff 0%, #5551ff ${
        ((valueSlide - min) / (max - min)) * 100
      }%, #DEE2E6 ${((valueSlide - min) / (max - min)) * 100}%, #DEE2E6 100%)`;
      slider.oninput = function () {
        this.style.background = `linear-gradient(to right, #5551ff 0%, #5551ff ${
          ((this.valueSlide - this.min) / (this.max - this.min)) * 100
        }%, #DEE2E6 ${((this.valueSlide - this.min) / (this.max - this.min)) * 100}%, #DEE2E6 100%)`;
      };
    }
    onChange(state);
  }, []);
  const onChangeInref = (event) => {
    if (onChange) onChange(event);
    const name = event.target.name;
    let value = '';
    if (name === 'target') value = event.target.value;
    if (name === 'date') value = event.target.value;
    const newState = { ...state };
    newState[name] = value;
    const newValue = Number(((event.target.value - min) * 100) / (max - min));
    const newPosition = max - newValue * 0.2;
    document.getElementById('tag-range').innerHTML = event.target.value + ' điểm';
    document.getElementById('tag-range').style.left = `calc(${newValue}% + (${newPosition - min}px))`;
    const slider = document.getElementById('myRange');
    const min = slider.min;
    const max = slider.max;
    const valueSlide = slider.value;
    slider.style.background = `linear-gradient(to right, #5551ff 0%, #5551ff ${
      ((valueSlide - min) / (max - min)) * 100
    }%, #DEE2E6 ${((valueSlide - min) / (max - min)) * 100}%, #DEE2E6 100%)`;
    slider.oninput = function () {
      this.style.background = `linear-gradient(to right, #5551ff 0%, #5551ff ${
        ((this.valueSlide - this.min) / (this.max - this.min)) * 100
      }%, #DEE2E6 ${((this.valueSlide - this.min) / (this.max - this.min)) * 100}%, #DEE2E6 100%)`;
    };
  };
  return (
    <div className="relative">
      <p className="mb-2 text-caption-1">
        Bài kiểm tra học kỳ I được
        <span className="ml-2 text-purple" id="tag-range">
          {state.target} điểm
        </span>
      </p>
      <input
        type="range"
        min={min}
        max={max}
        step="0.5"
        onChange={onChangeInref}
        name={name}
        defaultValue={state.target}
        className="w-full"
        id="myRange"
      />
      <div className="flex justify-between mt-2 ml-1 mr-1">
        {[5, 6, 7, 8, 9, 10].map((item, index) => (
          <div className="text-gray text-caption-2" key={index}>
            {item}
          </div>
        ))}
      </div>
      <style jsx>{`
        input[type='range'] {
          -webkit-appearance: none;
          height: 6px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 5px;
          background-image: linear-gradient(#e8e8e8, #e8e8e8);
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #5551ff;
          cursor: ew-resize;
          box-shadow: 0 0 2px 0 #555;
          transition: background 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};
export default Ranger;
