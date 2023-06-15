import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Checked } from '../icons';
import { motion, AnimatePresence } from 'framer-motion';
import { variantsOpacity } from '@/service/config';
import useSWR from 'swr';
import { useAuth } from '@/hooks/use-auth';
import { Tracker } from '@/libs/tracking';

const classButton = {
  disabled: 'bg-silver text-white',
  active: 'border-purple',
  default: 'border-purple'
};

const CheckedCom = () => {
  return (
    <motion.div
      variants={variantsOpacity}
      animate="enter"
      transition={{ duration: 0.15 }}
      className="absolute  bottom-[-1px] right-[-1px] flex w-6 h-6 items-center justify-center bg-purple"
      style={{ borderRadius: '8px 0px' }}
    >
      <Checked className="z-10" />
    </motion.div>
  );
};

const ButtonClass = ({ children, disabled, active, onClick }) => {
  const clx = disabled ? 'disabled' : active ? 'active' : 'default';
  return (
    <div
      onClick={onClick}
      className={
        'relative w-[6.25rem] cursor-pointer h-10 border-[2px] rounded-xl md:mr-4 flex items-center justify-center  ' +
        classButton[clx]
      }
    >
      {children}
      <AnimatePresence>{active && <CheckedCom />}</AnimatePresence>
    </div>
  );
};

const tabs = [
  { name: '10', id: 'lop-10', disable: false },
  { name: '11', id: 'lop-11', disable: true },
  { name: '12', id: 'lop-12', disable: true }
];
const StudyProgram = ({ updateAction, notUpdateStep, setDisabled = () => {}, hasTracking }) => {
  const { updateProfile, profile } = useAuth();
  const defaultGrade = tabs.findIndex((element) => element.id === profile.grade);
  const [grade, setGrade] = useState(defaultGrade >= 0 ? defaultGrade : 0);
  const [select, setSelect] = useState();
  const gradeClass = tabs[grade];
  const { data } = useSWR('/programes?filters[subject]=toan&filters[grade]=' + gradeClass?.id + '&populate=avatar');
  const choose = (item, disable) => {
    return () => {
      if (disable) return;
      setSelect(item);
      // return if not is onboarding flow

      if (!hasTracking) return;
      const now = new Date().getTime();
      const params = {
        info_fields: 'program',
        info_value: item.attributes.name,
        timeFill: now
      };
      Tracker.send({ action: 'info', event: 'field', params });
    };
  };

  useEffect(() => {
    const { program } = profile;
    if (program && data?.data) {
      const item = (data?.data || []).find((element) => element.id === program.id);
      setSelect(item);
    }
    if (!program && data?.data) {
      setSelect(data?.data[0]);
    }
  }, [data]);

  useEffect(() => {
    const isChange = profile?.grade !== gradeClass?.id || profile?.program?.id != select?.id;
    setDisabled(!isChange);
  }, [select, gradeClass]);

  const onSubmit = async () => {
    const params = {
      grade: gradeClass?.id,
      program: { id: select.id, name: select.attributes.name, uuid: select.attributes.program_uuid }
    };
    if (!notUpdateStep) params.current_step = 2;
    const result = await updateProfile(params);
    setDisabled(true);
    return result ? true : false;
  };
  updateAction(onSubmit);

  if (!data?.data) return null;
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-[20px] hidden md:block">Chương trình học</h2>
      <h3 className="text-sm mb-3 text-caption-1-highlight">Khối lớp</h3>
      <div className="flex justify-between items-center">
        {tabs.map((item, index) => (
          <ButtonClass
            key={item.id}
            active={item.id == gradeClass?.id}
            type="default"
            disabled={item.disable}
            className="min-w-[6.25rem] ml-0"
            onClick={() => {
              if (item.disable) return;
              setGrade(index);
            }}
          >
            {item.name}
          </ButtonClass>
        ))}
      </div>
      <h3 className="text-sm mt-[16px] mb-[8px] text-caption-1-highlight">Khối lớp</h3>
      <div className="flex md:flex-wrap justify-between program">
        {data?.data.map((element, index) => {
          const cla = element.id === select?.id ? 'border-[2px] border-purple' : 'border-white';
          const item = element.attributes;
          return (
            <div
              key={element.id}
              onClick={choose(element, item.disable)}
              className={`max-w-[250px] w-fit cursor-pointer rounded md:mr-2`}
              style={{ flex: '0 0 30%' }}
            >
              <div className={`w-fi	relative border-[2px] duration-150 rounded-lg overflow-hidden bg-smoke p-1 ${cla}`}>
                <img src={item.avatar?.data[0].attributes.formats.thumbnail.url} alt="" />
                <AnimatePresence>{element.id === select?.id && <CheckedCom />}</AnimatePresence>
              </div>
              <div className="py-2">
                <h4 className="text-xs text-center">{item.name}</h4>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .program:after {
          /* content: ''; */
          /* flex: auto; */
        }
      `}</style>
    </div>
  );
};
export default StudyProgram;
StudyProgram.isHeader = true;
