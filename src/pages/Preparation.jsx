import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import { useNavigate } from "react-router-dom";

const videoConstraints = {
  width: 1024,
  height: 720,
  facingMode: "user",
};

const Preparation = () => {
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  const [recording, setRecording] = useState(true);
  const mediaRecorderRef = useRef(null);
  const [isStandBy, setIsStandBy] = useState(true);
  const [recordedVideos, setRecordedVideos] = useState(null);
  const [count, setCount] = useState(30);
  const [title, setTitle] = useState([
    "คุณกำลังอยู่ในช่วงสัมภาษณ์ กรุณาออกเสียง 1-10 เพื่อทดสอบไมโครโฟนและกล้องของคุณ คุณกำลังอยู่ในช่วงเตรียมตัว",
    'เมื่อกดปุ่ม "เริ่มทดสอบระบบ" กรุณาออกเสียง 1-10 เพื่อทดสอบไมโครโฟนและกล้องของคุณ',
  ]);

  const startstop = () => {
    if (!isStandBy) {
      console.log("stop record");
      stopRecording();
    } else {
      console.log("start record");
      startRecording();
    }
  };

  useEffect(() => {
    if (!isStandBy) {
      setCount(120);
    }
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 0) {
          setIsStandBy(false);
          clearInterval(timer);
          startstop();
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStandBy]);

  const formatedTime = `${String(Math.floor(count / 60)).padStart(
    2,
    "0"
  )}:${String(count % 60).padStart(2, "0")}`;

  const handleClickStandby = () => {
    setIsStandBy(false);
    startstop();
  };
  const handleClickFinish = () => {
    startstop();
    setCount(0);
  };
  const handleClickRefresh = () => {
    setRecordedVideos(null);
    setIsStandBy(true);
    setCount(30);
  };

  const startRecording = () => {
    const stream = webcamRef.current.stream;
    const options = { mimeType: "video/webm;codecs=vp9" };
    mediaRecorderRef.current = new MediaRecorder(stream, options);
    const chunks = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const videoURL = URL.createObjectURL(blob);
      setRecordedVideos(videoURL);
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  const handleClickStartInterview = () => {
    navigate('/interview')
  }

  return (
    <div className=" h-screen bg-[#BED7DC] mt-0 pt-28">
      <div className=" p-12 max-w-[780px] xl:max-w-[1200px] lg:max-w-[980px]  bg-white flex gap-6 flex-col mx-auto ">
        <p className=" bg-slate-400 rounded-full bg-opacity-20 py-1 px-4 self-center w-fit">
          ทดสอบการใช้ระบบ
        </p>
        <h1 className=" w-full font-bold text-xl text-center">
          {isStandBy ? title[1] : title[0]}
        </h1>
        <div className="flex gap-6">
          <div className=" max-w-[540px] relative flex flex-1">
            {recordedVideos ? (
              <CustomVideoPlayer src={recordedVideos} />
            ) : (
              <div
                className={` rounded-lg ${
                  !isStandBy && "bg-red-600 border-red-600 border-4 rounded-lg"
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
            )}
          </div>
          <div className=" flex flex-col gap-4 w-full max-w-[540px]">
            {recordedVideos ? (
              <>
                <div className=" border rounded-lg px-4 py-6 flex flex-col gap-3">
                  <h5 className=" text-lg font-semibold">จบการตอบคำถาม</h5>
                  <p>
                    กรุณาตรวจสอบวิดีโอของคุณ หากพบปัญหาด้าน
                    อุปกรณ์การบันทึกภาพหรือเสียง กรุณาแก้ไข
                    อุปกรณ์ของคุณให้พร้อมก่อนการเริ่มสัมภาษณ์จริง แล้ว
                    “ทดสอบระบบอีกครั้ง” ก่อน
                  </p>
                  <p>
                    หากคุณพร้อมแล้ว สามารถกดปุ่ม “เริ่มการสัมภาษณ์จริง” ได้เลย!
                  </p>
                </div>
                <div className="  ">
                  <button
                    onClick={handleClickRefresh}
                    className=" rounded-lg mt-6 w-full bg-black text-white py-3"
                  >
                    ทำใหม่อีกครั้ง
                  </button>
                  <button
                    onClick={handleClickStartInterview}
                    className=" rounded-lg mt-3 w-full bg-black text-white py-3"
                  >
                    เริ่มการสัมภาษณ์จริง
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className=" border rounded-lg px-4 py-6 flex flex-col gap-3">
                  {isStandBy ? (
                    <>
                      <h5 className=" text-lg font-semibold">ช่วงเตรียมตัว</h5>
                      <p>
                        คุณกำลังอยู่ในช่วงเตรียมตัว ทุกคำถามจะมีเวลาเตรียมตัว 15
                        วินาที
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
                    onClick={isStandBy ? handleClickStandby : handleClickFinish}
                    className={` rounded-lg mt-6 w-full ${isStandBy ? "bg-black": " bg-red-600"}  text-white py-3`}
                  >
                  {isStandBy ? "เริ่มการทดสอบระบบ" : "จบการตอบคำถาม"}
                    
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preparation;
