//  Ý tưởng
//  Solution 1: Nếu từng record thì thời gian gian gọi lên nhiều hơn
//  Solution 2: Ngược lại lưu array thì chỉ cần gọi 1 lần và gọi lại lúc update,
//  vấn đề là nếu đăng nhập 2 - 3 device thì sẽ không còn chính xác thông tin nữa

//  Giải pháp:
//    Lưu bằng record, với key="29323-2323123-12312313"
//  Schema:

const diagnoseSchema = {
  current_list: null,
  level: 'medium',
  list_diagnose: null
};

import useSWR, { mutate } from 'swr';
import axiosInteraction from '@/api/base/axios-interaction';
import axiosClient from '@/api/base/axios-cms';
import { useEffect, useState } from 'react';

export function useDiagnoseList(id) {
  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState({});
  const initList = async () => {
    try {
      const diagnose_log = await axiosInteraction.get('/user_storage/' + id + '_diagnose');
      const { current_list, list_diagnose, level } = diagnose_log.value || {};
      const list_diagnoses = list_diagnose
        ? {
            easy: list_diagnose.easy,
            medium: list_diagnose.medium,
            hard: list_diagnose.hard
          }
        : null;
      const string_list_id = list_diagnoses
        ? '&ids=[' + [...list_diagnoses.easy, ...list_diagnoses.medium, ...list_diagnoses.hard].join(',') + ']'
        : '';
      const questionRes = await axiosClient.get(
        `/get_question_exams?type=Diagnose&question_type=${id}` + string_list_id
      );
      let question_list = questionRes.data;
      question_list = {
        easy: sortFollow(list_diagnoses?.easy, question_list?.Easy),
        medium: sortFollow(list_diagnoses?.medium, question_list?.Medium),
        hard: sortFollow(list_diagnoses?.hard, question_list?.Hard)
      };

      if (!string_list_id) {
        const list_diagnose_current = {
          easy: ArrayId(question_list.easy),
          medium: ArrayId(question_list.medium),
          hard: ArrayId(question_list.hard)
        };
        updateDiagnose({
          list_diagnose: list_diagnose_current
        });
      } else {
        question_list = {
          easy: sortFollow(list_diagnoses?.easy, question_list?.easy),
          medium: sortFollow(list_diagnoses?.medium, question_list?.medium),
          hard: sortFollow(list_diagnoses?.hard, question_list?.hard)
        };
      }
      setData({ question_list, list_diagnose: list_diagnoses, current_list, level });
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) initList();
  }, [id]);

  const updateDiagnose = async (payload) => {
    const value = data?.diagnose || diagnoseSchema;
    const record = { ...value, ...payload };
    try {
      await axiosInteraction.post('/user_storage/' + id + '_diagnose', { value: record });
      await mutate();
    } catch (error) {}
  };

  const updateDiagnoseQuestionList = async (current_list = []) => {
    setData({ ...data, current_list });
    await mutate();
  };

  return {
    updateDiagnose,
    updateDiagnoseQuestionList,
    isLoaded,
    ...data
  };
}

const ArrayId = (array) => {
  return array.map((element) => element.id);
};

const sortFollow = (soft, array) => {
  if (!soft || soft?.length === 0) return array;
  const result = soft.map((id) => {
    return array.find((element) => element && element.id === id);
  });
  return result;
};
