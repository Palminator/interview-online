import React, { useRef, useState } from "react";

function CustomVideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false); // Set isPlaying to false when the video ends
  };

  const updateTime = () => {
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div className=" relative">
      <video
        className="transform scale-x-[-1] rounded-lg cursor-pointer"
        onClick={togglePlay}
        ref={videoRef}
        src={src}
        onTimeUpdate={updateTime}
        onLoadedMetadata={updateTime}
        onEnded={handleVideoEnd} // Add event listener for ended event
      />
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className=" cursor-pointer rounded-lg px-4 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 backdrop-blur bg-opacity-20 bg-slate-100"
        >
          <div className=" text-[68px] ">▶︎</div>
        </div>
      )}

      {/* <div className="controls">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <div className="progress-bar" onClick={handleSeek}>
          <div
            className="progress"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div> */}
    </div>
  );
}

// function formatTime(seconds) {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
// }

// function padZero(number) {
//   return number < 10 ? `0${number}` : number;
// }

export default CustomVideoPlayer;
