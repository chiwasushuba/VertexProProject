'use client';

import Header from '@/components/header';
import { Label } from '@radix-ui/react-label';
import { CircleArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

const WatchPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastTime, setLastTime] = useState(0);
  const [videoDone, setVideoDone] = useState(false);

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

    const handleEnded = () => {
      setVideoDone(true); 
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('ended', handleEnded); 

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('ended', handleEnded);
    };
  }, [lastTime]);

  return (
    <div>
      <Header variant="signedUser" location='Man Power Orientation'/>
      asdfasd
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 gap-5">
        <video ref={videoRef} width="640" height="360" controls>
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className='flex gap-4'>
          <input type="checkbox"/>
          <Label>I UNDERSTAND AND AGREE TO THE TERMS PRESENTED</Label>
        </div>

        {videoDone && (
          <Link href="/">
            <button
              className="absolute flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-400 transition-all bottom-10 right-20"
            >
              <CircleArrowRight size={40} />
              <span className="text-lg">Next</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
