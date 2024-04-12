import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import { useNavigate } from "react-router-dom";

const videoConstraints = {
  width: 1024,
  height: 720,
  facingMode: "user",
};

const questions = [
  "แนะนำตัวสั้นๆ ทำอะไรมาบ้าง อยากให้เรารู้จักอะไร เล่ามาได้เลย",
  "กำลังมองหางานแบบไหน ลักษณะไหน ท้ังในมุมรูปแบบองค์กร การทำงาน และทักษะหรือภาษาที่ใช้",
  "คุณมีจุดเด่นอะไร ที่ทำให้คุณแตกต่างจาก Candidate คนอื่นๆ",
  "ถ้าให้คนอื่นพูดถึงตัวเรา เขาจะพูดถึงเรื่องอะไร",
];

const Interview = () => {
  const navigate = useNavigate();
  const [questionCurrent, setQuestionCurrent] = useState(0);
  const webcamRef = useRef(null);
  const [recording, setRecording] = useState(true);
  const mediaRecorderRef = useRef(null);
  const [isStandBy, setIsStandBy] = useState(true);
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [count, setCount] = useState(30);
  const [isFinished, setIsFinished] = useState(false);

  const startstop = () => {
    if (!isStandBy) {
      // console.log("stop record");
      stopRecording();
    } else {
      // console.log("start record");
      startRecording();
    }
  };

  useEffect(() => {
    console.log(recordedVideos);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 0) {
          if (isStandBy) {
            setIsStandBy(false);
            startRecording();
            setCount(120);
          } else {
            setIsStandBy(true);
            setCount(30);
            stopRecording();
            setQuestionCurrent((prev) => prev + 1);
            clearInterval(timer);
          }

          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    if (questionCurrent === questions.length) {
      setIsFinished(true);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isStandBy]);

  const formatedTime = `${String(Math.floor(count / 60)).padStart(
    2,
    "0"
  )}:${String(count % 60).padStart(2, "0")}`;

  const handleClickStandby = () => {
    setIsStandBy(false);
    startRecording();
    setCount(120);
  };

  const handleClickFinish = () => {
    setCount(30);
    setIsStandBy(true);
    stopRecording();
    setQuestionCurrent((prev) => prev + 1);
  };

  const startRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    ) {
      setRecording(true);
      const stream = webcamRef.current.stream;
      const options = { mimeType: "video/webm;codecs=vp9" };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedVideos((prevRecordedVideos) => [
          ...prevRecordedVideos,
          blob,
        ]); // Append new recording to the existing array
      };
      mediaRecorderRef.current.start();
    } else {
      console.log("Recording is already in progress.");
    }
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  const handleHomeButton = () => {
    navigate("/home");
  };

  return (
    <div className=" min-h-screen bg-[#BED7DC] mt-0 pb-28 pt-28">
      {/* {questions.map((question, idx) => ( */}
      <div className=" p-12 max-w-[780px] xl:max-w-[1200px] lg:max-w-[980px]  bg-white flex gap-6 flex-col mx-auto ">
        {isFinished ? (
          <>
            <button
              className=" bg-black text-white w-fit py-2 px-4"
              onClick={handleHomeButton}
            >
              หน้าแรก
            </button>
            {recordedVideos.map((video, index) => (
              <div className="" key={index}>
                <h2>{questions[index]}</h2>
                <CustomVideoPlayer src={URL.createObjectURL(video)} />
              </div>
            ))}
          </>
        ) : (
          <>
            <p className=" bg-slate-400 rounded-full bg-opacity-20 py-1 px-4 self-center w-fit">
              คำถามข้อที่ {questionCurrent + 1} / {questions.length}
            </p>
            {/* {idx === questionCurrent && ( */}
            <>
              <h1 className=" w-full font-bold text-xl text-center">
                {questions[questionCurrent]}
              </h1>
              <div className="flex gap-6">
                <div className=" max-w-[540px] relative flex flex-1">
                  <div
                    className={` rounded-lg ${
                      !isStandBy &&
                      "bg-red-600 border-red-600 border-4 rounded-lg"
                    } `}
                  >
                    <Webcam
                      className=" rounded-md"
                      ref={webcamRef}
                      mirrored={true}
                      videoConstraints={videoConstraints}
                      audio={true}
                      muted={true}
                    />

                    {isStandBy && (
                      <p className=" rounded-lg h-full bg-opacity-55 bg-black font-bold absolute text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 content-center w-full text-center">
                        ช่วงเตรียมตัว <br />
                        ขณะนี้ยังไม่เริ่มการบันทึกวิดีโอ
                      </p>
                    )}
                  </div>
                </div>
                <div className=" flex flex-col gap-4 w-full max-w-[540px]">
                  <>
                    <div className=" border rounded-lg px-4 py-6 flex flex-col gap-3">
                      {isStandBy ? (
                        <>
                          <h5 className=" text-lg font-semibold">
                            ช่วงเตรียมตัว
                          </h5>
                          <p>
                            คุณกำลังอยู่ในช่วงเตรียมตัว
                            ทุกคำถามจะมีเวลาเตรียมตัว 30 วินาที
                            หลังจากหมดเวลาเตรียมตัวระบบจะเริ่มทำการบันทุกวิดีโอทันที
                          </p>
                        </>
                      ) : (
                        <>
                          <h5 className=" text-lg font-semibold flex w-full justify-between">
                            ช่วงสัมภาษณ์
                            <span className=" bg-red-600 rounded-full w-6 h-6 flex items-center justify-center relative">
                              <div className=" bg-red-600 rounded-full w-5 h-5 animate-ping"></div>
                            </span>
                            <span className=" text-2xl">กำลังบันทึกวิดีโอ</span>
                          </h5>
                        </>
                      )}
                    </div>
                    <div className="  ">
                      <div className="border flex flex-col gap-3 px-4 py-6 rounded-lg">
                        <p className=" text-lg font-semibold text-center">
                          {isStandBy
                            ? "เหลือเวลาเตรียมตัวอีก"
                            : "หมดเวลาตอบคำถามในอีก"}
                        </p>
                        <p className=" text-center text-2xl font-bold">
                          {formatedTime}
                        </p>
                      </div>

                      <button
                        onClick={
                          isStandBy ? handleClickStandby : handleClickFinish
                        }
                        className={` rounded-lg mt-6 w-full ${
                          isStandBy ? "bg-black" : " bg-red-600"
                        }  text-white py-3`}
                      >
                        {isStandBy ? "เริ่มการตอบคำถาม" : "จบการตอบคำถาม"}
                      </button>
                    </div>
                  </>
                </div>
              </div>
            </>
          </>
        )}

        {/* )} */}
      </div>
      {/* ))} */}
    </div>
  );
};

export default Interview;
