"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
};

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  //const playerUrl = `https://player.cloudinary.com/embed/?public_id=${encodeURIComponent(playbackId)}&cloud_name=dn9djuqe5&player[colors][accent]=%230c4dff&player[showJumpControls]=true&player[hideContextMenu]=false&player[floatingWhenNotVisible]=false&player[seekThumbnails]=false`;
  const playerUrl = `https://player.cloudinary.com/embed/?public_id=${encodeURIComponent(playbackId)}&cloud_name=dn9djuqe5&player[colors][accent]=%230ca5ff&player[logoOnclickUrl]=http%3A%2F%2Flocalhost%3A3000&player[logoImageUrl]=https%3A%2F%2Fres.cloudinary.com%2Fdn9djuqe5%2Fimage%2Ffetch%2Fh_25%2Fhttps%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F1216%2F1216895.png&player[showJumpControls]=true&source[poster]=https%3A%2F%2Fres.cloudinary.com%2Fdn9djuqe5%2Fimage%2Fupload%2Fsqixosr8footr8gu6ssh.jpg`
  return (
    <div className="relative aspect-video">
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">
            This chapter is locked
          </p>
        </div>
      )}
      
      {!isLocked && (
        <iframe
          src={playerUrl}
          width="640"
          height="360"
          style={{ height: 'auto', width: '100%', aspectRatio: '640 / 360' }}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  )
}