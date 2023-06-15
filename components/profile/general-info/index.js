import Button from '@/components/common/button/basic';
import { GLXDatePicker, Input, Label, Location, SelectSearch } from '@/components/forms';
import { UploadImageProfile } from '@/components/forms/upload';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@/context/toast';
import {
  compareValue,
  genderList,
  genderValidate,
  passValidate,
  phoneValidate,
  validateFullname
} from '@/service/index';
import useWarnIfUnsavedChanges from '@/hooks/use-warning';
import ModalView from '@/components/common/modal/template';
import { Warning } from '@/components/common/modal';
import { useModal } from '@/hooks/use-modal';
import { useRouter } from 'next/router';
import Tooltip from '../../common/tooltip/index';
import ContentTooltip from '../../common/tooltip/content.json';

let url = '';
const Profile = () => {
  const router = useRouter();
  const disable = useRef();

  const { toggleToast } = useToast();
  const { profile, updateProfile } = useAuth();

  const value = useRef({ ...profile });

  const [errors, setErrors] = useState({});
  const [isChange, setIsChange] = useState(false);

  const [modal, toglleModal, setModal] = useModal();
  const callback = (payload) => {
    toglleModal();
    url = payload;
  };
  disable.current = setIsChange;
  useWarnIfUnsavedChanges(isChange, callback);
  const validation = {
    full_name: { isRequire: true, validate: validateFullname },
    dob: { isRequire: true },
    phone_number: {
      isRequire: true,
      validate: phoneValidate
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

  const checkError = async (name) => {
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

  const onChange = (event) => {
    if (!(event.target.name === 'address' && !value.current.address)) {
      const isDifferent = !compareValue(event.target.value, value.current[event.target.name]);
      if (isDifferent) setIsChange(true);
    }
    value.current[event.target.name] = event.target.value;
  };
  const onSubmit = async () => {
    const errors = await getEror();
    setErrors(errors);
    if (!passValidate(errors)) return;
    const fields = value.current;
    const { district, province, school } = fields.address;
    const params = {
      full_name: fields.full_name,
      email: fields?.email,
      phone_number: fields.phone_number,
      full_address: province && district ? province?.value + ', ' + district?.value : '',
      school_name: school?.value,
      province: province,
      district: district,
      school: school,
      dob: fields?.dob,
      avatar: fields.avatar,
      gender: fields.gender
    };
    const is_pass = passValidate(errors) ? true : false;
    if (!is_pass) return false;
    try {
      await updateProfile(params);
      setIsChange(false);
      toggleToast({
        show: true,
        status: 'success',
        message: 'Cập nhật thành công',
        time: 5000
      });
    } catch (error) {}
    return true;
  };

  const actionConfirm = async () => {
    setModal(false);
    const result = await onSubmit();
    if (result) router.push(url);
  };

  const actionCancel = async () => {
    setModal(false);
    setIsChange(false);
    setTimeout(() => {
      router.push(url);
    }, 500);
  };

  return (
    <>
      <p className="title-tab text-2xl font-bold hidden md:block">Thông tin cá nhân</p>
      <div className="flex md:mt-6 flex-col-reverse md:flex-row md:p-0 p-[20px]">
        <div className="form-profile max-w-[400px]">
          <div className="mb-4 flex relative z-100">
            <div className="w-7/12 mr-4 ">
              <Label required htmlFor="full_name">
                Họ và tên
              </Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name}
                message={errors.full_name}
                type={errors.full_name ? 'error' : ''}
                placeholder="Họ và tên"
                onChange={onChange}
                validate={checkError}
              />
            </div>
            <div className="w-5/12">
              <Label required>Giới tính</Label>
              <SelectSearch
                options={genderList}
                className="min-w-[50px]"
                defaultValue={profile.gender?.value}
                placeHolder="Vui lòng nhập giới tính"
                message={errors.gender}
                name="gender"
                onChange={(name, item) => {
                  const event = { target: { name: name, value: item } };
                  onChange(event);
                }}
                validate={checkError}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between z-[1] relative">
            <div className="phone mr-4">
              <div className="flex items-center">
                <Label required htmlFor="phone">
                  Số điện thoại
                </Label>
                <Tooltip className="mb-2" content={ContentTooltip['phone'].content} />
              </div>
              <Input
                id="phone_number"
                name="phone_number"
                message={errors.phone_number}
                type={errors.phone_number ? 'error' : ''}
                defaultValue={profile.phone_number}
                placeholder="Số điện thoại"
                onChange={onChange}
                validate={checkError}
              />
            </div>
            <div className="bday">
              <div className="flex items-center">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Tooltip className="mb-2" content={ContentTooltip['dateOfBirth'].content} />
              </div>
              <GLXDatePicker
                defaultValue={profile.dob || 1167584400}
                name="dob"
                onChange={onChange}
                error={errors.dob}
                placeholder="Ngày sinh"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={profile.email}
              id="email"
              name="email"
              defaultValue={profile.email}
              placeholder="Email"
              onChange={onChange}
            />
          </div>
          <div className="mt-4">
            <Location defaultValue={profile} name="address" error={errors.address} onChange={onChange} />
          </div>
          <div className="flex mt-6 justify-end w-full">
            <Button type="default" className="hidden md:block min-w-[180px]" disabled={!isChange} onClick={onSubmit}>
              Cập nhật
            </Button>
          </div>
        </div>
        <UploadImageProfile defaultValue={profile.avatar} name="avatar" error={errors.address} onChange={onChange} />
        <ModalView
          open={modal}
          toggle={() => {
            setModal(false);
          }}
        >
          <Warning
            title="Úi, quên lưu rồi kìa!"
            subTitle="Bạn có muốn lưu lại các thay đổi?"
            type="question"
            buttonConfirm={{ text: 'Lưu thay đổi', action: actionConfirm }}
            buttonCancel={{ text: 'Không lưu', action: actionCancel }}
          />
        </ModalView>
      </div>
      <div className="md:hidden block flex justify-end w-full px-[20px] py-[12px] sticky bottom-0 bg-white border-b-[1px] border-t-[1px] border-silver">
        <Button type="default" className="w-full md:min-w-[180px] ml-[0]" disabled={!isChange} onClick={onSubmit}>
          Cập nhật
        </Button>
      </div>
    </>
  );
};
export default Profile;
