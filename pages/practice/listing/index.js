import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axiosInteraction from '@/api/base/axios-interaction';

function Listing() {
  const [listing, setListing] = useState();
  const [listLO, setListLO] = useState([]);
  const url_listing =
    'units?populate=learning_outcomes.question_types&populate=questions&populate=chapter&program_uuid=4a0fde72-7ada-418b-a8db-2288923b00f7';
  const { data, error } = useSWR(url_listing);
  const infoQuestion = data?.data?.[0]?.attributes;
  const chapter = infoQuestion?.chapter?.data?.attributes;
  const [headName, setHeadName] = useState({
    name: '',
    title: ''
  });

  const pushData = (data) => {
    if (data !== undefined) {
      setListing(data.data[0].attributes.learning_outcomes.data);
      setHeadName({
        name: data.data[0].attributes.name,
        title: data.data[0].attributes.title
      });
    }
  };
  useEffect(() => {
    const arr = [];
    listing?.map((item) => {
      item.attributes.question_types.data.map((data) => {
        arr.push(data.attributes);
      });
    });
    setListLO(arr);
  }, [listing]);
  const [dataKnowledgeState, setDataKnowledgeState] = useState({});
  useEffect(() => {
    axiosInteraction
      .get('/user/question-knowledge-state')
      .then((data) => {
        setDataKnowledgeState(data.question_type_uuid);
      })
      .catch((errorMessage) => {
        console.error(errorMessage);
      });
  }, []);
  useEffect(() => {
    pushData(data);
  }, [data]);
  const router = useRouter();
  return (
    <div className="bg-smoke mx-0 my-0 flex justify-center h-[100vh]">
      <div className="listing w-[1160px] px-6 pt-10">
        <div className="text-2xl font-bold mb-5">Toán 10 - Học kỳ I</div>
        <div className="list-card grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-6">
          {listLO.map((item, index) => {
            const { name, total_question, question_type_uuid } = item;
            return (
              <div key={index} className="card bg-white p-5 rounded-lg flex flex-col justify-between shadow">
                <div>
                  <p className="w-fit bg-smoke rounded-xl px-4 py-1 text-sm flex items-center mb-2 mr-3">
                    {chapter?.name.slice(0, 9)} - {headName.name}
                    <div className="relative flex  items-center group ml-2">
                      <img src="/images/icon/info.png" className="w-[14px]" alt="Adaptive Learning" />
                      <div className="absolute bottom-0 flex items-center top-1/2 left-1/2 -translate-y-1/2 -mb-2 ml-5 hidden group-hover:flex min-w-[300px] z-50">
                        <p className="w-fit z-10 p-4 text-xs leading-none text-white whitespace-no-wrap bg-gray shadow-lg rounded-md">
                          <p>
                            {chapter?.name.slice(0, 9)} : {chapter?.title}
                          </p>
                          <p className="mt-2">
                            {infoQuestion.name} : {infoQuestion.title}
                          </p>
                        </p>
                      </div>
                    </div>
                  </p>
                  <p className="font-semibold text-lg">{name}</p>
                </div>
                <div>
                  <div className="group-time flex items-center justify-end mt-8">
                    <img src="/images/time.png" className="w-[20px]" alt="Adaptive Learning" />
                    <span className="text-sm font-normal ml-1">{total_question * 3} phút</span>
                  </div>
                  {(dataKnowledgeState && dataKnowledgeState[question_type_uuid] === total_question && (
                    <button
                      className="border-purple border-2 mt-3 w-full py-2 rounded-lg text-purple hover:bg-purple-medium hover:text-white"
                      onClick={() => {
                        router.push({
                          pathname: `/practice/overview/${question_type_uuid}`
                        });
                      }}
                    >
                      Xem lại
                    </button>
                  )) || (
                    <button
                      className=" bg-purple mt-3 w-full py-2 px-12 rounded-lg text-white hover:bg-purple-medium"
                      onClick={() => {
                        router.push(`/practice/overview/${question_type_uuid}`);
                      }}
                    >
                      Luyện tập ngay
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Listing;
