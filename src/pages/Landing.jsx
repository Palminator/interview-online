import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [ready, setReady] = useState(false);
  const words = [
    `${greeting}`,
    "Welcome to online interview",
    "It's my great pleasure to meet you today",
    "Are you ready?",
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex !== 3) {
      }
      if (typingIndex === words[currentIndex].length) {
        setTimeout(() => {
          if (Number(currentIndex) < 3) {
            setCurrentIndex((currentIndex + 1) % words.length);
            setTypingIndex(0);
          } else {
            setReady(true);
          }
        }, 2000);
      } else {
        setCurrentWord(
          words[currentIndex].slice(0, typingIndex + 1) +
            (typingIndex === words[currentIndex].length - 1 ? "" : "|")
        );
        setTypingIndex(typingIndex + 1);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentIndex, typingIndex, words]);

  useEffect(() => {
    const time = new Date();
    const hour = time.getHours();
    if (hour >= 6 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <div className=" bg-[#BED7DC] flex h-screen justify-center items-center">
      <div className="text-4xl font-bold flex flex-col gap-9">
        <span className=" transition-all duration-300 ease-in-out drop-shadow-sm">
          {currentWord}
        </span>

        <div
          className={` flex w-full justify-center h-20 transition-opacity duration-300 ease-in-out ${
            ready ? " opacity-100" : " opacity-0 "
          }`}
        >
          {ready && (
            <Link to={"/home"}>
              <button className=" bg-black text-white py-4 px-24">ready</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
