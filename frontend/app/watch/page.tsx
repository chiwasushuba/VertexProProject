'use client'

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { CircleArrowRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const WatchPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastTime, setLastTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setLastTime(video.currentTime);
    };

    const handleSeeking = () => {
      if (video.currentTime > lastTime + 0.01) {
        video.currentTime = lastTime;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeking', handleSeeking);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeking', handleSeeking);
    };
  }, [lastTime]);

  return (
    <div>
      <Header variant='auth'/>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        
        <video ref={videoRef} width="640" height="360" controls>
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <button
          className=
          "absolute flex items-center gap-2 px-5 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-400 transition-all bottom-10 right-20"
        >
          <CircleArrowRight size={30}/>
        </button>




        

      </div>
    </div>
  );
};

export default WatchPage;
