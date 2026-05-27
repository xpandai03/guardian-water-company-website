"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductVideoModalProps {
  /** Self-hosted .mp4 path under /public. */
  videoPath: string;
  /** Used for the modal's accessible title and the trigger button aria-label. */
  productName: string;
  /** Optional override for the trigger button label. */
  triggerLabel?: string;
}

// Trigger button + Radix Dialog wrapping an HTML5 <video controls>. Autoplay
// is off — the user opens the modal, then presses play. Closing the dialog
// pauses + rewinds the video so re-opening starts fresh.
export function ProductVideoModal({
  videoPath,
  productName,
  triggerLabel = "See How It Works",
}: ProductVideoModalProps) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!open) {
      video.pause();
      video.currentTime = 0;
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-full px-6 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Play className="mr-2 h-4 w-4" aria-hidden="true" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl p-0 sm:max-w-4xl bg-black border-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">
          {productName} — how it works
        </DialogTitle>
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full"
            controls
            playsInline
            preload="metadata"
            src={videoPath}
          >
            <track kind="captions" />
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
