import moment from 'moment';

export function removeAccents(str) {
  if (!str) return '';
  var AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ'
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str.toLowerCase();
}

export function getLatexBlocks(content) {
  const index = [];
  const blocks = [];

  for (let i = 0; i < content.length; i++) {
    if (content[i] === '$') {
      index.push(i);
    }
  }

  for (let i = 0; i < index.length; i += 2) {
    const current = index[i];
    const next = index[i + 1];
    if (current && next) {
      let latextStr = '';
      for (let j = current; j <= next; j++) {
        latextStr += content[j];
      }
      if (latextStr) blocks.push(latextStr);
    }
  }

  return blocks;
}

export function convertLatex(rawContent = '') {
  rawContent = rawContent.replaceAll('$$', '$');
  const latexBlocks = getLatexBlocks(rawContent);
  let content = rawContent;
  for (const block of latexBlocks) {
    const newContent = block
      .replace(/<\/p><p>/g, '\\\\')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/<\/p>/g, '')
      .replace(/<p>/g, '')
      .replace(/<br>/g, '\\\\');

    content = content.replace(block, newContent);
  }
  return content;
}

export const findInteract = (list = [], id) => {
  return list.find((element) => id === element.question_id && element.event_type === 'answer_question');
};

export const fillArray = (value, length) => {
  const list = [];
  list.fill(value, 0, length - 1);
  return list;
};

export function unique(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    const isExist = newArr.find((element) => {
      return element.id === arr[i].id;
    });
    if (!isExist) newArr.push(arr[i]);
  }
  return newArr;
}

export function uniqueChapter(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    const isExist = newArr.find((element) => {
      return element.attributes.chapter?.data?.id === arr[i].attributes.chapter?.data?.id;
    });
    if (!isExist) newArr.push(arr[i]);
  }
  const composed = newArr.map((d) => {
    return {
      unit: arr.filter((dataId) => d.attributes.chapter?.data?.id === dataId.attributes.chapter?.data?.id),
      chapter: d.attributes.chapter
    };
  });
  return composed;
}

export const convertTime = (str = '00:00') => {
  // str format: mm:ss: 0 < value < 59
  const paths = str.split(':');

  if (paths.length === 2) {
    const minute = Number(paths[0]);
    const second = Number(paths[1]);
    if (isNaN(minute) || isNaN(second) || 0 > minute || minute > 59 || 0 > second || second > 59) return 0;
    return minute * 60 + second;
  } else if (paths.length === 3) {
    const hour = Number(paths[0]);
    const minute = Number(paths[1]);
    const second = Number(paths[2]);

    if (isNaN(hour) || isNaN(minute) || isNaN(second) || 0 > minute || minute > 59 || 0 > second || second > 59)
      return 0;
    return hour * 60 * 60 + minute * 60 + second;
  }

  return 0;
};
export const checkArrays = (arrA, arrB) => {
  if (arrA.length !== arrB.length) return false;
  var cA = arrA.slice().sort().join(',');
  var cB = arrB.slice().sort().join(',');
  return cA === cB;
};
export const convertQueyToObject = () => {
  const params = new URLSearchParams(location.search);
  const result = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result
};
let timer;
export function debounce(func, timeout = 300) {
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
export const convertArrayToObject = (arrays = [], name = '') => {
  const diagnose = {};
  for (const item of arrays) {
    diagnose[item[name]] = item;
  }
  return diagnose;
};
export const firstLetterCapitalize = (_string) => {
  if (_string) {
    return _string.charAt(0).toUpperCase() + _string.slice(1);
  }
};

export const compareValue = (a, b) => {
  if (typeof a === 'string' || typeof a === 'number') return a == b;
  if (typeof a !== typeof b) return false;
  if (typeof a === Object) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
};

export function currencyFormat(num) {
  num = parseInt(num);
  if (num) return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  else return 0;
}

export function parseDateTime(payload) {
  const ago = moment(payload).format('DD/MM/YYYY');
  if (ago === 'Invalid date') return '';
  return ago;
}

export function funcSort(a, b) {
  return a.attributes.order - b.attributes.order;
}

export function checkTickedOverviewPractice(diagnose, practice, getQuestionType) {
  var mergeToArray = {};
  if (diagnose && practice && getQuestionType) {
    var merge = {};
    diagnose[getQuestionType] &&
      Object.keys(diagnose[getQuestionType]).map((key) => {
        practice[getQuestionType] &&
          Object.keys(practice[getQuestionType]).map((data) => {
            if (data == key) {
              if (diagnose[getQuestionType][key] === 'pass') {
                merge = {
                  ...merge,
                  [key]: diagnose[getQuestionType][key]
                };
              } else {
                merge = {
                  ...merge,
                  [key]: practice[getQuestionType][key]
                };
              }
            }
          });
      });
    mergeToArray = merge;
    Object.keys(merge).map((key, index) => {
      if (key == 'medium' && merge[key] == 'pass') {
        mergeToArray = {
          ...mergeToArray,
          easy: 'pass',
          medium: 'pass'
        };
      }
      if (key == 'hard' && merge[key] == 'pass') {
        mergeToArray = {
          ...mergeToArray,
          easy: 'pass',
          medium: 'pass',
          hard: 'pass'
        };
      }
    });
  }
  return mergeToArray;
}
export function removeFailStatus(params) {
  var array = params;
  if (params) {
    Object.keys(params).map((key, index) => {
      if (params[key] === 'fail') {
        array = {
          ...array,
          [key]: 'unknown'
        };
      }
    });
    return array;
  }
}
