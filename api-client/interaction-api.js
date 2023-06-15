import axiosInteraction from './base/axios-interaction';

let data = {
  event_type: '',
  lesson_id: '',
  click_on: Math.floor(Date.now() / 1000),
  question_id: '',
  is_answer_correct: '',
  answer_id: '',
  flow: '',
  status_answer: ''
};

const getKeyHasValue = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== '') {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

export const Interaction = {
  updateBody(body) {
    data = { ...data, ...body };
  },
  async send(params) {
    console.log('send ddddd');
    const body = { ...data, ...params, interact: true };
    await axiosInteraction.post('/interaction' + (params.end_session ? '?end_session=true' : ''), getKeyHasValue(body));
    data = { ...data, click_on: Math.floor(Date.now() / 1000) };
  }
};
