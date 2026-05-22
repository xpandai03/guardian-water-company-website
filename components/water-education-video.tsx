"use client";

import { useEffect, useRef } from "react";

// Autoplaying, muted, looping water video for the "What's actually in
// Northeast Ohio tap water?" section — fills the square frame the bull's-eye
// placeholder used. Same approach as the home hero video: a poster frame
// shows instantly while the clip downloads, and a ref-based play() backs up
// the autoplay attribute (browsers require the muted *property* for autoplay).
export function WaterEducationVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
  }, []);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-accent/15">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/water-education-poster.jpg"
        aria-hidden="true"
      >
        <source src="/water-education.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
