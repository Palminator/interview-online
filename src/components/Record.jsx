import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [isMirrored, setIsMirrored] = useState(true); // Set initial value to true for mirror effect

  const startRecording = () => {
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
      setRecordedVideos([...recordedVideos, blob]);
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Webcam
        audio={true}
        muted={true}
        ref={webcamRef}
        className="w-full max-w-md rounded-lg shadow-lg"
        mirrored
      />
      <div className="mt-4 flex items-center">
        {/* <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
          onClick={toggleMirror}
        >
          {isMirrored ? 'Disable Mirror' : 'Enable Mirror'}
        </button> */}
        {recording ? (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={startRecording}
          >
            Start Recording
          </button>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recordedVideos.map((video, index) => (
          <video key={index} controls className="w-full rounded-lg shadow-lg">
            <source src={URL.createObjectURL(video)} type="video/webm" />
          </video>
        ))}
      </div>
    </div>
  );
};

export default VideoRecorder;
