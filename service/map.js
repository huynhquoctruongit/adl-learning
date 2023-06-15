export const mapDifficulty = {
  VeryHard: 'Rất khó',
  Hard: 'Khó',
  Medium: 'Trung bình',
  Easy: 'Dễ'
};

export const mapRecurrenceUnit = {
  minute: 'phút',
  month: 'tháng',
  year: 'năm'
};

export const getNameMethod = {
  momo: 'Ví MoMo',
  googleplay: 'Google Play',
  apple: 'Intunes Apple ID',
  asiapay: 'Ví AsiaPay',
  payoo: 'Payoo',
  promotion: 'Mã kích hoạt',
  commercial: 'Hệ thống',
  'in-app-purchase': 'IN APP'
};

export const genderList = [
  { id: 'nam', value: 'Nam' },
  { id: 'nu', value: 'Nữ' },
  { id: 'khac', value: 'Khác' }
];

export const howToPass = {
  easy: { sequential: 4, non_sequential: [5, 6] },
  medium: { sequential: 3, non_sequential: [4, 6] },
  hard: { sequential: 2, non_sequential: [3, 5] }
};

const mapDifficultyIndex = {
  easy: 1,
  medium: 2,
  hard: 3,
  veryhard: 4
};

export const tagRole = {
  trial: {
    color: 'text-critical',
    text: 'DÙNG THỬ'
  },
  free: {
    color: 'text-gray',
    text: 'CƠ BẢN'
  },
  premium: {
    color: 'text-positive',
    text: 'NÂNG CAO'
  }
};

export const mapPathNameToCategory = {
  '/learning-path': 'home',
  '/practice/overview': 'practice',
  '/practice': 'practice',
  '/diagnose/overview': 'diagnose',
  '/diagnose': 'diagnose',
  '/onboarding': 'onboarding'
};
