import ModalView from '@/components/common/modal/template';
import { useModal } from '@/hooks/use-modal';
import useWarnIfUnsavedChanges from '@/hooks/use-warning';
import { useRef, useEffect, Fragment } from 'react';
import useSWR from 'swr';
import { useKnowledge } from '@/hooks/use-knowledge';
import Button from '../../common/button/basic';
import { useRouter } from 'next/router';
import axiosClient from '@/api/base/axios-cms';

const SkipPractice = ({
  countLimit,
  isShow,
  interaction,
  qt_id,
  detail_v2,
  setResultPractice,
  resultPractice,
  continutePractice
}) => {
  const { data: infomation } = useSWR(qt_id ? '/question_type_detail_v2/' + qt_id : null);
  const url = useRef();
  useEffect(() => {
    if (isShow) {
      setModal(true);
    }
  }, [isShow]);
  const [modal, toglleModal, setModal] = useModal();

  return (
    <ModalView
      preventHideClickOverlay
      open={modal}
      toggle={() => {
        setModal(false);
      }}
    >
      <SkipModal
        setResultPractice={setResultPractice}
        resultPractice={resultPractice}
        setModal={setModal}
        detail_v2={infomation}
        id={qt_id}
        interaction={interaction}
        countLimit={countLimit}
        continutePractice={continutePractice}
      />
    </ModalView>
  );
};
const SkipModal = ({
  countLimit,
  interaction,
  qt_id,
  detail_v2,
  setModal,
  setResultPractice,
  resultPractice,
  continutePractice,
}) => {
  const router = useRouter();
  const { knowledge, getStatus } = useKnowledge(qt_id);
  const { practice } = knowledge || {};
  const item = practice?.status?.find((element) => element.question_type === qt_id);
  const state = item ? getStatus(item, detail_v2?.difficulty_levels) : null;
  const { id } = router.query;
  const getLevel = id && id[1];

  const mapIndex = ['easy', 'medium', 'hard', 'veryhard'];
  const getLevelHight = mapIndex[detail_v2?.data?.difficulty_levels?.length - 1];
  const lastLevel = (getLevelHight && getLevelHight == getLevel) || getLevel == 'hard';

  const currentState = state?.knowledge || open.level;
  const nextState = state?.level;

  const returnLevelTitle = {
    easy: 'Dễ',
    medium: 'Vừa',
    hard: 'Khó',
    veryhard: 'Siêu khó'
  };
  const returnLevel = (level) => {
    switch (level) {
      case 'easy':
        return 1;
        break;
      case 'medium':
        return 2;
        break;
      case 'hard':
        return 3;
        break;
      default:
        return 'Vừa';
        break;
    }
  };
  return (
    <div>
      <div className="inline-block align-bottom rounded-lg text-left overflow-hidden transform transition-all w-full">
        <div className="items-center justify-center m-auto max-w-[626px] h-full rounded-lg">
          <div className="md:p-8 p-[20px] xl:grid-cols-2 bg-white rounded-lg md:mx-0">
            <div className="flex">
              <img
                width="80px"
                className="mr-[16px]"
                src={`/icons/${lastLevel ? 'party-popper.png' : 'smiling-face-with-hearts.png'}`}
              ></img>
              <div className="flex items-center justify-center">
                <div>
                  <span className="text-headline-1">{lastLevel ? 'Tuyệt vời' : 'Khá lắm'}</span>
                  <p className="text-body-2-highlight text-gray">
                    Đúng {interaction?.data.filter((el) => el.is_answer_correct === true).length}/{countLimit} câu
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[10px] md:flex">
              <div className="md:w-[60%] w-full flex self-end mr-[40px] md:mb-0 mb-[16px]">
                <div className="flex">
                  <div>
                    <span>Bạn đã hoàn thành mức độ {returnLevelTitle[getLevel]}</span>
                    {Array.apply(null, { length: returnLevel(getLevel) }).map(function (item, index) {
                      return <img className="ml-[4px] inline align-text-bottom" src="/icons/fire.png" width="24px" />;
                    })}
                    <p>
                      Bạn muốn xem luôn kết quả hay tiếp tục luyện tập {countLimit - interaction?.data?.length} câu còn
                      lại?
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:w-[40%] w-full">
                <Button
                  onClick={() => {
                    if (setModal) setModal(false);
                  }}
                  type="outline"
                  size="full"
                  className="border-solid border-2 ml-0 mb-[12px] py-2 px-4"
                >
                  Tiếp tục luyện tập
                </Button>
                <Button
                  size="full"
                  onClick={() => {
                    if (setResultPractice && setModal) {
                      continutePractice(true);
                      setResultPractice({
                        ...resultPractice,
                        isShow: true,
                        isReview: true
                      });
                    }
                  }}
                  className="border-solid border-2 ml-0 py-2 px-4"
                >
                  Xem kết quả
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SkipPractice;
