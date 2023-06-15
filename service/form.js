import axiosInteraction from '@/api/base/axios-interaction';

export const validateFunc = (validation, fields) => {
  const listValue = Object.keys(validation);
  const errors = {};
  listValue.map((key) => {
    if (validation[key].isRequire && !fields[key] && fields[key] !== 0) errors[key] = 'Vui lòng điền thông tin';
    else {
      const validate = validation[key]?.validate;
      if (validate) errors[key] = validate(fields[key]);
    }
  });
  return errors;
};

export const passValidate = (obj) => {
  let error = false;
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (element) error = true;
    }
  }
  return !error;
};

let last = { phone: '', exist: false };
export const phoneValidate = async (value, required, isEqua) => {
  if (value === last.phone && last.exitst === true) return 'Số điện thoại đã tồn tại';

  if (required && !value) return 'Vui lòng nhập số điện thoại';
  const result = value.match(/^(0[3|5|7|8|9])+([0-9]{8})$\b/) || value.match(/^(\+84|84)+([0-9]{9})$\b/);
  if (!result) return 'Số điện thoại không hợp lệ';
  const phone = value.replaceAll('+84', '0').replaceAll('84', 0);
  if (isEqua) return '';
  try {
    await axiosInteraction.get('/user/check_phone?phone_number=' + phone);
    last.exitst = false;
    last.phone = value;
    return '';
  } catch (error) {
    last.exitst = true;
    return 'Số điện thoại đã tồn tại';
  }
};

export const scopeValidate = (scope, required) => {
  let value = Number((scope + '').replaceAll(',', '.'));
  if (required && !value) return 'Vui lòng nhập số điểm hợp lệ';
  const stringValue = value + '';
  const listDot = stringValue.split('.');
  const listComma = stringValue.split(',');
  if (listDot[1]?.length > 2 || listComma[1]?.length > 2) return 'Số điểm không quá 2 số thập phân';
  if (value.length > 4) return '';
  const isFloat = (value + '').match(/^[+-]?\d+(\.\d+)?$/);
  if ((value > 10 || value < 0) && isFloat) return 'Số điểm không hợp lệ';
  return '';
};

export const validateFullname = (value = '', required) => {
  const valueNotSpace = value.replaceAll(/ /g, '');
  const isNumber = valueNotSpace.match(/^[0-9]{4,40}$/);
  if (isNumber) return 'Họ và tên không hợp lệ';
  if ((required && !valueNotSpace) || valueNotSpace.length < 4) return 'Vui lòng nhập họ và tên ít nhất 4 ký tự';
  const match = value
    .toLowerCase()
    .match(/^[a-z0-9ỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ ]{4,40}$/);
  return match ? '' : 'Họ và tên không hợp lệ';
};

export const emailValidate = (value = '', required) => {
  if (required && !value) return 'Vui lòng nhập email';
  const isEmail = value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  return isEmail ? '' : 'Email không hợp lệ';
};

export const genderValidate = (value, required) => {
  if (required && !value) return 'Vui lòng chọn giới tính';
  return '';
};
