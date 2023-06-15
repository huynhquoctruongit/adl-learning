import { useEffect, useRef, useState } from 'react';
import { SelectSearch, Label } from '@/components/forms';
import useSWR from 'swr';
import Tooltip from '../../common/tooltip/index';
import ContentTooltip from '../../common/tooltip/content.json';

export const Location = ({ onChange = () => {}, name, defaultValue = {} }) => {
  const { province, district, school } = defaultValue;
  const lastChange = useRef();
  const [state, setState] = useState({
    province: province,
    district: district,
    school: school
  });
  const { data } = useSWR('/provinces?pagination[pageSize]=1000');

  const updateState = (name, value) => {
    lastChange.current = name;
    if (state[name]?.id === value?.id) return;
    const newState = { ...state };
    newState[name] = value;
    if (name === 'province') {
      newState.district = null;
      newState.school = null;
    }
    if (name === 'district') {
      newState.school = null;
    }
    setState(newState);
  };
  const provinces = data?.data.map((element) => ({ id: element.id, value: element?.attributes?.name })) || [];
  const { data: districtsData } = useSWR(
    state.province?.id ? `/districts?filters[province][id][$eq]=${state.province?.id}&populate=province` : ''
  );
  const districts = districtsData?.data.map((element) => ({ id: element.id, value: element?.attributes?.name })) || [];

  const { data: schoolData } = useSWR(
    state.district?.id ? `/schools?filters[district][id][$eq]=${state.district?.id}` : ''
  );
  const schools = schoolData?.data.map((element) => ({ id: element.id, value: element?.attributes?.name })) || [];
  useEffect(() => {
    const event = { target: { name: name, value: state, fieldLast: lastChange.current } };
    onChange(event);
  }, [state]);

  return (
    <div>
      <div className="flex items-center">
        <Label>Nơi sống</Label>
        <Tooltip className="mb-2" content={ContentTooltip['address'].content} />
      </div>
      <SelectSearch
        options={provinces.sort((a, b) => a.value.localeCompare(b.value))}
        placeHolder="Vui lòng chọn tỉnh/thành phố"
        name="province"
        value={state.province}
        onChange={updateState}
      />
      <SelectSearch
        placeHolder="Vui lòng chọn quận/huyện"
        options={districts.sort((a, b) => a.value.localeCompare(b.value))}
        name="district"
        value={state.district}
        onChange={updateState}
        className="mb-4"
      />
      <div className="flex items-center">
        <Label>Trường bạn đang học</Label>
        <Tooltip className="mb-2" content={ContentTooltip['school'].content} />
      </div>
      <SelectSearch
        placeHolder="Vui lòng chọn trường"
        options={schools.sort((a, b) => a.value.localeCompare(b.value))}
        name="school"
        value={state.school}
        onChange={updateState}
        isAdd
        className="mb-0"
        // disabled
      />
    </div>
  );
};
