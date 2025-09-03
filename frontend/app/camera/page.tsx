'use client';

import { useEffect, useRef, useState } from 'react';
import { RouteGuard } from '../RouteGuard';
import api from '@/utils/axios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function CapturePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [suburb, setSuburb] = useState<string | null>(null);
  const [fullAddress, setFullAddress] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLocationReady, setIsLocationReady] = useState(false);
  

  // Start camera
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        setIsCameraReady(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Camera error:', err);
        setIsCameraReady(false);
        setError('Camera access denied. Please allow camera access.');
      });
  }, []);

  // Start geolocation
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setIsLocationReady(true);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
      },
      (err) => {
        console.error('Location error:', err);
        setIsLocationReady(false);
        setError('Location access denied. Please allow location access.');
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Reverse geocode
  useEffect(() => {
    async function getLocationDetails(lat: number, lng: number) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        const address = data.address;

        const resolvedCity =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          'Unknown';
        const resolvedSuburb = address.suburb || address.neighbourhood || null;

        const full = [
          address.house_number,
          address.road,
          address.suburb,
          address.city || address.town || address.village,
          address.state,
          address.country,
        ]
          .filter(Boolean)
          .join(', ');

        setCity(resolvedCity);
        setSuburb(resolvedSuburb);
        setFullAddress(full);
      } catch (err) {
        console.error('Geocoding error:', err);
        setCity('Unknown');
        setSuburb(null);
        setFullAddress(null);
      }
    }

    if (location) {
      getLocationDetails(location.lat, location.lng);
    }
  }, [location]);

  // Capture photo + trusted timestamp
  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    setCapturedImage(imageData);

    try {
      // ✅ Call your backend
      const res = await api.get("/user/time");
      const data = res.data;

      // ✅ Parse UTC string from backend
      const utcDate = new Date(data.utc);

      // ✅ Convert UTC → Asia/Manila (or keep UTC if you prefer)
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Manila",
      };

      const phtTime = new Intl.DateTimeFormat("en-PH", options).format(utcDate);
      setTimestamp(phtTime);
    } catch (err) {
      console.error("Error fetching trusted time:", err);
      setError("Failed to fetch trusted time.");
    }
  };

  return (
    <RouteGuard>
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 p-4">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-4">Take a Picture</h1>

          {error && <p className="text-red-600">{error}</p>}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-md rounded-xl shadow"
          />

          <button
            onClick={capturePhoto}
            disabled={!isCameraReady || !isLocationReady}
            className={`mt-4 px-6 py-2 rounded-lg text-white 
            ${
              !isCameraReady || !isLocationReady
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Capture
          </button>
        </div>

        {capturedImage && (
          <div className="flex flex-col justify-center mt-6 text-justify w-auto">
            <img
              src={capturedImage}
              alt="Captured"
              className="rounded-lg shadow mb-4 max-w-xs"
            />
            <span className="text-sm">
              <strong>Take a screenshot of this then upload it in your profile</strong>
            </span>
            <span className="flex">
              <strong>Time:&nbsp; </strong> {timestamp}
            </span>
            <span>
              <strong>Suburb:&nbsp; </strong> {suburb || 'N/A'}
            </span>
            <span>
              <strong>City: &nbsp;</strong> {city}
            </span>
            <span>
              <strong>Full Address:</strong>
              <br /> {fullAddress}
            </span>
            <Link href="/login" passHref>
              <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                Go to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}
