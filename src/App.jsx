import React, { useRef, useEffect, useState } from 'react';


function App() {
  const videoRef = useRef(null);
  const recordedVideoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true, muted: true });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera and microphone:', err);
      }
    };

    startCamera();
  }, []);

  const handleStartRecording = () => {
    if (stream) {
      setRecordedChunks([]);
      setRecordedVideoUrl(null);
      const newMediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9,opus' });
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
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (recordedChunks.length && !isRecording) {
      const blob = new Blob(recordedChunks, { type: 'video/webm; codecs=vp9,opus' });
      const videoURL = URL.createObjectURL(blob);
      setRecordedVideoUrl(videoURL);
    }
  }, [recordedChunks, isRecording]);

  return (
    <div>
      <video ref={videoRef} muted autoPlay />
      <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {recordedVideoUrl && (
        <video ref={recordedVideoRef} src={recordedVideoUrl} controls />
      )}
    </div>
  );
}

export default App
