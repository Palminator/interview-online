import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate()
  const videoRef = useRef(null);
  const recordedVideoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [ready, setReady] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera and microphone:", err);
    }
  };

  useEffect(() => {}, []);

  const handleStartRecording = () => {
    if (stream) {
      setRecordedChunks([]);
      setRecordedVideoUrl(null);
      const newMediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9,opus",
      });
      setMediaRecorder(newMediaRecorder);
      newMediaRecorder.start();
      newMediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (recordedChunks.length && !isRecording) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm; codecs=vp9,opus",
      });
      const videoURL = URL.createObjectURL(blob);
      console.log(blob);
      setRecordedVideoUrl(videoURL);
    }
  }, [recordedChunks, isRecording]);

  return (
    <div className=" h-screen bg-[#BED7DC] mt-0 pt-28">
      <div className=" p-12 max-w-[780px] xl:max-w-[1200px] lg:max-w-[980px]  bg-white flex gap-6 flex-col mx-auto ">
        <h1 className=" w-full font-bold text-xl text-center">
          Welcome Interview
        </h1>
        <div className="">
          <h2 className=" mb-2">คำแนะนำในการสัมภาษณ์</h2>
          <ol className=" list-inside list-disc">
            <li>คำถามในการสัมภาษณ์มีทั้งหมด 4 ข้อ</li>
            <li>
              คำถามแต่ละข้อมีเวลาเตรียมตัว 30 วินาที
              และเวลาในการตอบคำถามจะอยู่ในแต่ละหน้า
            </li>
            <li>กรุณาตรวจสอบกล้องและไมโครโฟนของคุณว่าสามารถใช้งานได้</li>
            <li>
              หลังจากเข้าสู่ขั้นตอน "เริ่มการสัมภาษณ์ข้อที่ 1"
              เวลาการสัมภาษณ์ทั้งหมดจะเริ่มนับถอยหลังทันที
              แม้ว่าคุณจะออกจากระบบไปแล้วก็ตาม
              กรุณาเตรียมตัวให้พร้อมก่อนเริ่มการสัมภาษณ์
            </li>
          </ol>
        </div>

        <button onClick={()=> navigate("/preparation")} className=" py-3 px-5 self-center bg-black w-fit text-white">
          เข้าสู่หน้าทดสอบระบบ
        </button>
      </div>
    </div>
    // <div className=" bg-[#BED7DC] flex justify-center items-center h-screen">
    //   <div className="bg-white drop-shadow-sm rounded-lg p-8 max-w-full">
    //     <div className=" w-[640px] h-[480px]">
    //       <video className=" w-full" ref={videoRef} muted autoPlay />
    //       <button
    //         onClick={isRecording ? handleStopRecording : handleStartRecording}
    //       >
    //         {isRecording ? "Stop Recording" : "Start Recording"}
    //       </button>
    //       <video src=""></video>
    //       {recordedVideoUrl && (
    //         <video
    //           ref={recordedVideoRef}
    //           className=" w-full h-[480px]"
    //           src={recordedVideoUrl}
    //           controls
    //         />
    //       )}
    //     </div>
    //     <div className=" flex justify-center items-center flex-col box-border p-5">
    //       <p>if you ready click ready</p>
    //       <button onClick={startCamera} className=" py-4 px-12 bg-teal-400">
    //         Ready
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Home;
