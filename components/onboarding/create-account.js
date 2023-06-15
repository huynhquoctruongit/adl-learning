import { GLXDatePicker, Input, Label, Location, SelectSearch } from '@/components/forms';
import { useAuth } from '@/hooks/use-auth';
import { passValidate, phoneValidate, validateFullname, emailValidate, genderValidate } from '@/service/form';
import { debounce } from '@/service/helper';
import { genderList } from '@/service/map';
import { useEffect, useMemo, useRef, useState } from 'react';
import Tooltip from '../common/tooltip/index';
import ContentTooltip from '../common/tooltip/content.json';
import { useTracking } from '@/hooks/use-tracking';
import { Tracker } from '@/libs/tracking';

const CreateAnAccount = ({ updateAction, setDisabled, dataTracking, pushTracking }) => {
  const { profile, updateProfile } = useAuth();
  const value = useRef({ ...profile, dob: profile.dob || 1167584400 });
  const [errors, setErrors] = useState({});
  const validation = {
    full_name: { validate: validateFullname },
    dob: { isRequire: true },
    phone_number: {
      isRequire: true,
      validate: phoneValidate
    },
    email: {
      isRequire: true,
      validate: emailValidate
    },
    gender: {
      isRequire: true,
      validate: genderValidate
    }
  };
  const listValue = useMemo(() => {
    return Object.keys(validation);
  }, []);

  const getEror = async () => {
    const fields = value.current;
    const errors = {};
    const values = listValue.map(async (key) => {
      const { validate, isRequire } = validation[key] || {};
      return validate ? validate(fields[key], isRequire, profile[key] == value.current[key]) : null;
    });
    const data = await Promise.all(values);
    listValue.map((key, index) => {
      errors[key] = data[index];
    });
    return errors;
  };

  const onChange = (event) => {
    // tracking special address
    const { name, value: valueField, fieldLast } = event?.target;
    if (name === 'address' && fieldLast) {
      const now = new Date().getTime();
      const item = { info_fields: fieldLast, info_value: valueField[fieldLast].value, timeFill: now };
      Tracker.send({ action: 'filled', event: 'field', params: item });
    }

    if (name === 'dob') {
      const now = new Date().getTime();
      const item = { info_fields: name, info_value: valueField, timeFill: now };
      Tracker.send({ action: 'filled', event: 'field', params: item });
    }

    if (event.target.name === 'phone_number') (valueField + '').trim();
    value.current[event.target.name] = valueField;
    debounce(() => {
      const empty = getFieldEmpty();
      if (empty.length > 0) setDisabled(true);
      else setDisabled(false);
    }, 1000)();
  };

  const getFieldEmpty = () => {
    const values = value.current;
    return Object.keys(validation).filter((key) => {
      const item = validation[key];
      return item.isRequire && !values[key];
    });
  };

  useEffect(() => {
    const empty = getFieldEmpty();
    if (empty.length > 0) setDisabled(true);
  }, []);

  const checkError = async (name) => {
    const now = new Date().getTime();
    const item = { info_fields: name, info_value: value.current[name], timeFill: now };
    if (name === 'gender') item.info_value = value.current[name]?.value;
    Tracker.send({ action: 'filled', event: 'field', params: item });
    // replace space phone
    if (name === 'phone_number') {
      value.current[name] = (value.current[name] || '').replaceAll(/ /g, '');
    }
    const { validate, isRequire } = validation[name] || {};
    const message = validate
      ? await validate(value.current[name], isRequire, value.current[name] === profile[name])
      : '';
    if (message || (message === '' && errors[name] !== '')) {
      setErrors((error) => ({
        ...error,
        [name]: message
      }));
    }
    return message;
  };

  const onSubmit = async () => {
    const fields = value.current;
    const listError = await getEror();
    const pass = passValidate(listError);
    setErrors(listError);
    if (!pass) return false;
    const { district, province, school } = fields.address;
    const params = {
      full_name: fields.full_name,
      email: fields?.email || profile.email,
      phone_number: fields.phone_number,
      full_address: province && district ? province?.value + ', ' + district?.value : '',
      school_name: school?.value,
      province: province,
      district: district,
      school: school,
      dob: fields?.dob,
      current_step: 1,
      gender: fields.gender
    };

    await updateProfile(params);
    return true;
  };
  updateAction(onSubmit);
  return (
    <div className="flex flex-col">
      <h2 className="md:block hidden md:p-0 p-[20px] text-2xl font-bold md:mb-6">Thông tin cá nhân</h2>
      <div className="mb-4 flex relative z-100">
        <div className="w-7/12 mr-4">
          <Label required htmlFor="full_name">
            Họ và tên
          </Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile?.full_name}
            type={errors.full_name ? 'error' : ''}
            message={errors.full_name}
            placeholder="Họ và tên"
            onChange={onChange}
            className="min-w-full"
            validate={checkError}
          />
        </div>
        <div className="w-5/12">
          <Label required>Giới tính</Label>
          <SelectSearch
            options={genderList}
            defaultValue={profile.gender?.value}
            placeHolder="Vui lòng nhập giới tính"
            name="gender"
            className="min-w-full"
            message={errors.gender}
            validate={checkError}
            onChange={(name, item) => {
              const event = { target: { name: name, value: item } };
              onChange(event);
            }}
          />
        </div>
      </div>
      <div className="mb-4 flex relative z-[1]">
        <div className="mr-2">
          <div className="flex items-center">
            <Label required htmlFor="phone_number">
              Số điện thoại
            </Label>
            <Tooltip className="mb-2" content={ContentTooltip['phone'].content} />
          </div>
          <Input
            name="phone_number"
            defaultValue={profile.phone_number}
            type={errors.phone_number ? 'error' : ''}
            message={errors.phone_number}
            placeholder="Số điện thoại"
            onChange={onChange}
            className="min-w-full"
            validate={checkError}
          />
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <Label htmlFor="dob">Ngày sinh</Label>
            <Tooltip className="mb-2" content={ContentTooltip['dateOfBirth'].content} />
          </div>
          <GLXDatePicker
            defaultValue={profile.dob || 1167584400}
            name="dob"
            error={errors.dob}
            placeholder="Ngày sinh"
            onChange={onChange}
            // validate={checkError}
          />
        </div>
      </div>
      <div className="mb-4">
        <Label required htmlFor="email">
          Email
        </Label>
        <Input
          disabled={profile.email && !errors.email}
          id="email"
          name="email"
          type={errors.email ? 'error' : ''}
          message={errors.email}
          defaultValue={profile.email}
          placeholder="Email"
          onChange={onChange}
          validate={checkError}
        />
      </div>
      <div className="">
        <Location defaultValue={profile} name="address" error={errors.address} onChange={onChange} />
      </div>
    </div>
  );
};
export default CreateAnAccount;
