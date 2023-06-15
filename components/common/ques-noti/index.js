import React from 'react';
export default function QuesNoti({ interact, status, id }) {
  const is_answer_correct = interact?.is_answer_correct;
  const status_answer = interact?.status_answer;
  if (is_answer_correct === undefined) return null;
  if (is_answer_correct === false && interact?.state && Object.keys(interact?.state).length !== 0)
    return <div className="caption-01-highlight text-negative">U LÀ TRỜI SAI RỒI 😢</div>;
  if (is_answer_correct === true)
    return <div className="caption-01-highlight text-positive">TUYỆT VỜI, NHẤT BẠN RỒI 🎉</div>;
  if (status === 'timeout' || status_answer === 'timeout') {
    return <div className="caption-01-highlight text-negative">HẾT GIỜ ⏰</div>;
  } else if (status === 'cancel' || status_answer === 'cancel') {
    return <div className="caption-01-highlight text-negative">CHỊU THUA 😜</div>;
  }
  return null;
}
