import { useEffect, useState } from 'react';
import axiosInteraction from '@/api/base/axios-interaction';

export const UploadImageProfile = ({ onChange = () => {}, name, defaultValue }) => {
  const [file, setFile] = useState(defaultValue);
  const [error, setErrors] = useState();
  const uploadAvatar = async (event) => {
    if (event.target.files.length > 0) {
      var formdata = new FormData();
      formdata.append('file', event.target.files[0]);
      setErrors('');
      try {
        const result = await axiosInteraction.post('/user_storage/s3/upload', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        onChange({ target: { name, value: result.url } });
        setFile(result.url);
      } catch (error) {
        setErrors('Không thể upload hình ảnh');
      }
    }
  };
  return (
    <div className="m-auto md:m-0 avatar md:ml-10 relative">
      {/* <span
        className={
          (file === '/images/avatar-icon.png' || !file ? 'hidden' : '') +
          'hidden absolute right-0 font-bold text-gray text-xl -top-1 opacity-80 hover:cursor-pointer hover:opacity-100'
        }
        onClick={() => {
          onChange({ target: { name, value: '' } });
          setFile('/images/avatar-icon.png');
        }}
      >
        x
      </span> */}
      <p className="hidden md:block">Ảnh đại diện</p>
      <label className="mt-2 block cursor-pointer border-silver border-[2px] rounded-[50%] p-1 p-[6px]" htmlFor="upload">
        <div className="relative overflow-hidden rounded-[50%]">
          <img
            className="w-[104px] h-[104px] md:w-40 md:h-40 rounded-full object-cover"
            src={file || '/images/interface-user-avatar-glad.png'}
          />
          <div className="absolute bg-black opacity-[0.5] h-[28px] bottom-0 w-full"></div>
          <span className="absolute bottom-0 w-full text-center text-caption-1-highlight text-white mb-[4px]">Sửa</span>
        </div>
      </label>
      <label
        htmlFor="upload"
        className="hidden md:block hover:cursor-pointer text-purple text-center w-full block mt-2"
      >
        Tải ảnh lên
      </label>
      <input className="hidden" type="file" onChange={uploadAvatar} id="upload" accept="image/*" />
      <div className="text-xs mt-2 text-gray hidden md:block">
        <p>Kích thước tối đa: 1.5 MB </p>
        <p>Định dạng hỗ trợ: .jpg .png</p>
      </div>

      {error && <div className="text-negative text-xs mt-4 text-center">{error}</div>}
    </div>
  );
};
