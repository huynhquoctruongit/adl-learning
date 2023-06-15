export const convertDataToMathchingData = (interaction, resource) => {
  const answerIndex = interaction.find((element) => element?.left?.answerIndex || element?.right?.answerIndex);
  const verson = answerIndex ? '1' : '2';
  if (verson === '1') return interaction;

  const temp = {};
  interaction.map((element, index) => {
    const { left, right } = element;
    temp['left' + left.id] = index + 1;
    temp['right' + right.id] = index + 1;
  });

  const reuslt = resource.map((element) => {
    const { left, right } = element;
    left.answerIndex = temp['left' + left.id];
    right.answerIndex = temp['right' + right.id];
    return element;
  });

  return reuslt;
};

const replaceTrash = (value = "") => {
  return value.replaceAll(/<p><\/p>/g, "")
}
export const mapData = (data) => {
  const answers = [];
  const drag = [];
  const correct = [] // danh sách câu trả lời đúng
  let count = 0; // xem bao nhiêu câu đúng
  let couple = 0;
  // đếm xem có bao nhiêu cặp, không quan trọng đúng sai
  data.forEach((element, index) => {
    const item = {
      ...element.list,
      question: replaceTrash(element?.list?.question),
      answer: replaceTrash(element?.list?.answer)
    };
    if (item.question && item.answer) {
      correct.push([item.id, item.id])
      count++;
    }
    if (item.question)
      answers.push({
        left: { text: item.question, id: item.id },
        correct: { text: item.answer, id: item.id },
        right: null
      });
    if (item.answer) drag.push({ text: item.answer, id: item.id, order: index });
  });
  const temp = drag.sort(() => Math.random() - 0.5);
  const length = answers.length > temp.length ? answers.length : temp.length



  for (let index = 0; index < length; index++) {
    if (answers[index] && temp[index]) couple++
    answers[index] = answers[index] || { left: { text: "" } };
    const right = temp[index]
    answers[index].right = right || { text: "" }
  }
  return { resource: answers, answerRight: temp, count, couple, correct };
};

export const orders = [1, 2, 3, 4, 5, 6];
export const getNextOrderResult = (correctAnwser) => {
  let nextIndex = 0;
  for (const key in orders) {
    if (Object.hasOwnProperty.call(orders, key)) {
      const order = orders[key];
      const exist = correctAnwser.find((item) => item.left.answerIndex === order);
      if (exist) continue;
      nextIndex = order;
      break;
    }
  }
  return nextIndex;
};

export const getNextOrder = (data) => {
  let nextIndex = 6;
  orders.every((order) => {
    let leftRight = false;
    let rightRight = false;
    data.forEach((item) => {
      if (item?.left?.answerIndex == order) leftRight = true;
      if (item?.right?.answerIndex == order) rightRight = true;
    });
    if (!leftRight || !rightRight) {
      nextIndex = order;
      return false;
    } else return true;
  });
  return nextIndex;
};
