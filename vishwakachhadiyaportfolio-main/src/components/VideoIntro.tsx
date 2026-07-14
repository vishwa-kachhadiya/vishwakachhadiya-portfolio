import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import heroVideo from "/hero.mp4";
import CinematicLayer from "./CinematicLayer";
import Portfolio from "./Portfolio";
import styles from "./VideoIntro.module.css";

export default function VideoIntro() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [hintVisible, setHintVisible] = useState(true);

  // Try to play with sound; browsers usually block, then fall back to muted.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        setMuted(false);
        setHintVisible(false);
      }).catch(() => {
        v.muted = true;
        setMuted(true);
      });
    }
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(`.${styles.tagline}`, { opacity: 1, y: 0, duration: 1, delay: 0.4 })
        .to(
          `.${styles.nameInner}`,
          { opacity: 1, y: "0%", duration: 1.2, stagger: 0.12, ease: "power4.out" },
          "-=0.6"
        )
        .to(`.${styles.subtitle}`, { opacity: 1, y: 0, duration: 1 }, "-=0.7")
        .to(`.${styles.controls}`, { opacity: 1, duration: 0.8 }, "-=0.5")
        .to(`.${styles.scrollIndicator}`, { opacity: 1, duration: 0.8 }, "-=0.5");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Auto-hide sound hint
  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Keep the two videos in sync
  useEffect(() => {
    const v = videoRef.current;
    const a = ambientRef.current;
    if (!v || !a) return;
    const sync = () => {
      if (Math.abs(a.currentTime - v.currentTime) > 0.25) a.currentTime = v.currentTime;
    };
    const id = window.setInterval(sync, 1500);
    return () => window.clearInterval(id);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    const a = ambientRef.current;
    if (!v || !a) return;
    if (v.paused) {
      v.play(); a.play(); setPlaying(true);
    } else {
      v.pause(); a.pause(); setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    setHintVisible(false);
  };

  const scrollNext = () => {
    nextRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section ref={rootRef} className={styles.hero} aria-label="Portfolio intro">
        <video
          ref={ambientRef}
          className={styles.ambientLayer}
          src={heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
        <video
          ref={videoRef}
          className={`${styles.videoLayer} ${loaded ? styles.loaded : ""}`}
          src={heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setLoaded(true)}
          onCanPlay={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />

        <div className={styles.gradient} aria-hidden />
        <CinematicLayer />

        <div
          className={`${styles.loader} ${loaded || failed ? styles.loaderHidden : ""}`}
          aria-hidden={loaded || failed}
          role="status"
          aria-live="polite"
        >
          <div className={styles.loaderGlow} />
          <div className={styles.loaderRing}>
            <span className={styles.loaderArc} />
          </div>
          <p className={styles.loaderLabel}>
            {failed ? "Intro unavailable" : "Loading intro"}
          </p>
        </div>

        <div className={styles.content}>
          <p className={styles.tagline}>Portfolio · 2026</p>
          <h1 className={styles.name}>
            <span className={styles.nameLine}><span className={styles.nameInner}>Vishwa</span></span>
            <span className={styles.nameLine}><span className={styles.nameInner}>Kachhadiya</span></span>
          </h1>
          <p className={styles.subtitle}>
            AI / ML Researcher · M.Sc. Computer Science (AI), Université de Montréal
          </p>
        </div>

        <button
          type="button"
          className={`${styles.soundHint} ${hintVisible && muted ? styles.visible : ""}`}
          onClick={toggleMute}
          aria-label="Tap for sound"
        >
          Tap for sound
        </button>

        <div className={styles.controls}>
          <button type="button" onClick={togglePlay} className={styles.glass} aria-label={playing ? "Pause" : "Play"}>
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button type="button" onClick={toggleMute} className={styles.glass} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            )}
          </button>
        </div>

        <button type="button" className={styles.scrollIndicator} onClick={scrollNext} aria-label="Scroll to next section">
          <span>Scroll</span>
          <span className={styles.scrollLine} />
        </button>
      </section>

      <div ref={nextRef}>
        <Portfolio />
      </div>
    </>
  );
}
