import { GLXDatePicker, Input, Label, SelectSearch } from '@/components/forms';
import { useEffect, useRef, useState } from 'react';
import Ranger from '../common/ranger';
import { passValidate, scopeValidate } from '@/service/form';
import { useAuth } from '@/hooks/use-auth';
import { debounce } from '@/service/helper';
import InputGpa from '../forms/input/gpa';
import { Tracker } from '@/libs/tracking';

const validateFunc = (validation, fields) => {
  const listValue = Object.keys(validation);
  const errors = {};
  listValue.map((key) => {
    if (validation[key].isRequire && !fields[key] && fields[key] !== 0) errors[key] = 'Vui lòng điền thông tin';
    else {
      const validate = validation[key]?.validate;
      if (validate) errors[key] = validate(fields[key], validation[key].isRequire);
    }
  });
  return errors;
};

const validation = {
  estimated_date: {
    isRequire: true
  },
  target_score: {
    isRequire: true
  },
  last_ranked_academic: {
    isRequire: true,
    validate: (value = '') => {
      if (!value && value !== 0) return 'Vui lòng chọn';
      return '';
    }
  },
  last_gpa: {
    isRequire: true,
    validate: scopeValidate
  }
};

const Target = ({ updateAction, setDisabled, notUpdateStep, hasTracking }) => {
  const defaultDate = new Date('01/16/2023').getTime() / 1000;
  const { profile, updateProfile } = useAuth();
  const value = useRef({
    ...profile,
    estimated_date: profile.estimated_date || defaultDate,
    last_ranked_academic: profile.last_ranked_academic || 4
  });
  const [errors, setErrors] = useState({});
  const onChange = (event) => {
    const { name, value: newvalue } = event.target;
    if (!name) return;
    const oldvalue = value.current[name];
    if (newvalue === oldvalue) {
      return;
    }
    value.current[name] = newvalue;
    if (name !== 'last_gpa' && hasTracking) {
      const params = { info_fields: name, info_value: newvalue, timeFill: new Date().getTime() };
      Tracker.send({ action: 'info', event: 'field', params: params });
    }
    debounce(() => {
      const errors = validateFunc(validation, value.current);
      const pass = passValidate(errors);
      setDisabled(!pass && oldvalue !== newvalue);
    }, 0)();
  };

  const listAbility = [
    { id: 1, value: 'Yếu' },
    { id: 2, value: 'Trung bình' },
    { id: 3, value: 'Khá' },
    { id: 4, value: 'Giỏi' }
  ];

  const getAvility = (id) => {
    return listAbility.find((item) => item.id == id);
  };

  const onSubmit = async () => {
    const fields = value.current;
    const errors = validateFunc(validation, fields);
    const pass = passValidate(errors);
    setErrors(errors);
    if (!pass) return false;
    const final_profile = { ...fields };
    if (!notUpdateStep) final_profile.current_step = 3;
    if (!final_profile.target_score) final_profile.target_score = 8;
    final_profile.last_gpa = (final_profile?.last_gpa + '').replaceAll(',', '.');
    await updateProfile(final_profile);
    return true;
  };

  const checkError = (name) => {
    const { validate, isRequire } = validation[name] || {};
    const message = validate ? validate(value.current[name], isRequire) : '';

    if (message || (!message && errors[name] !== '')) {
      setErrors((error) => ({
        ...error,
        [name]: message
      }));
    }
    if (name === 'last_gpa' && hasTracking) {
      const params = { info_fields: name, info_value: value.current[name], timeFill: new Date().getTime() };
      Tracker.send({ action: 'info', event: 'field', params: params });
    }

    return message;
  };
  useEffect(() => {
    // const errors = validateFunc(validation, value.current);
    // const pass = passValidate(errors);
    // setDisabled(!pass);
    // return () => {
    //   setDisabled(true);
    // };
  }, []);
  updateAction(onSubmit);
  return (
    <div className="flex flex-col md:p-0">
      <h2 className="text-2xl font-bold mb-6 hidden md:block">Đặt mục tiêu</h2>
      <div className="mb-4">
        <Ranger min={5} max={10} defaultValue={profile.target_score || 8} name="target_score" onChange={onChange} />
      </div>
      <div className="mb-4 flex flex-col">
        <Label htmlFor="estimated_date">Ngày thi dự kiến</Label>
        <GLXDatePicker
          defaultValue={profile.estimated_date || defaultDate}
          minimumDate
          name="estimated_date"
          error={errors.date}
          placeholder="16-01-2023"
          onChange={onChange}
        />
      </div>
      <Label>Học lực học kỳ gần nhất</Label>

      {/* nếu chưa chọn thì mặc định là 4 Giỏi  */}
      <SelectSearch
        options={listAbility}
        defaultValue={
          profile.last_ranked_academic ? getAvility(profile.last_ranked_academic).value : getAvility(4).value
        }
        placeHolder="Chọn học lực"
        name="last_ranked_academic"
        type={errors.last_ranked_academic ? 'error' : ''}
        message={errors.last_ranked_academic}
        validate={checkError}
        onChange={(name, item) => {
          const event = { target: { name: name, value: item.id } };
          onChange(event);
        }}
      />
      <div className="mb-4 flex flex-col">
        <Label required htmlFor="last_gpa">
          Điểm trung bình Toán học kỳ gần nhất
        </Label>
        <InputGpa
          defaultValue={profile.last_gpa == 0 ? '' : profile.last_gpa}
          name="last_gpa"
          type={errors.last_gpa ? 'error' : ''}
          message={errors.last_gpa}
          placeholder="Nhập số điểm"
          onChange={onChange}
          validate={checkError}
        />
      </div>
    </div>
  );
};
export default Target;
