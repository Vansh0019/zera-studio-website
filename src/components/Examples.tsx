import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { exampleVideos, type ExampleVideo } from "@/config/examples";

function ExampleVideoCard({ item }: { item: ExampleVideo }) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const hasVideo = Boolean(item.video);

  useEffect(() => {
    if (!hasVideo || !cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "180px 0px", threshold: 0.25 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [hasVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    if (isVisible) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [hasVideo, isVisible]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  return (
    <article
      ref={cardRef}
      className="reveal group border border-black/10 bg-white p-3 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-[#111]">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={isVisible ? item.video : undefined}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover"
            aria-label={`${item.title} preview video`}
          />
        ) : (
          <img
            src={item.poster}
            alt={`${item.title} coming soon placeholder`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-4 border border-white/[0.15]" />

        {hasVideo ? (
          <button
            type="button"
            className="focus-ring absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-105"
            aria-label={isPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
        ) : (
          <span className="absolute left-4 top-4 border border-white/[0.15] bg-black/50 px-3 py-2 text-[0.68rem] font-black uppercase text-white">
            Coming Soon
          </span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 p-2 pt-4">
        <div>
          <h3 className="text-lg font-black">{item.title}</h3>
          <p className="mt-1 text-sm font-bold text-black/[0.55]">{item.category}</p>
        </div>
        <span className="text-right text-xs font-black uppercase text-black/40">{item.duration}</span>
      </div>
    </article>
  );
}

export default function Examples() {
  return (
    <section id="examples" className="overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="reveal">
            <p className="eyebrow mb-4">Examples</p>
            <h2 className="section-title">READY FOR REAL EDITS.</h2>
          </div>
          <p className="body-large reveal max-w-[640px] lg:justify-self-end">
            This area is prepared for short Zera Studio editing previews. For
            now, each slot is marked clearly until actual example videos are
            added.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exampleVideos.map((item) => (
            <ExampleVideoCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
