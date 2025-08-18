'use client';

import Header from '@/components/header';
import { TermsDialog } from '@/components/termsDialog';
import { Label } from '@radix-ui/react-label';
import React, { useEffect, useRef, useState } from 'react';

const WatchPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastTime, setLastTime] = useState(0);
  const [videoDone, setVideoDone] = useState(false);

  const tempUser = {
    name: 'John Doe'
  }

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
    <div className='flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#3f5a36] via-[#5f725d] to-[#374f2f]'>
      <Header variant="signedUser" location='Man Power Orientation'/>
      <div className="flex flex-col justify-center items-center min-h-screen gap-5">
        <video ref={videoRef} width="640" height="360" controls>
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {videoDone && (
          <TermsDialog name={tempUser.name}/>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
