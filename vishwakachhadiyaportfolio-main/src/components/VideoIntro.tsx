import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CinematicLayer from "./CinematicLayer";
import Portfolio from "./Portfolio";
import styles from "./VideoIntro.module.css";

const heroVideoUrl = "/hero.mp4";

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

  // Try autoplay with sound, then fall back to muted.
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

  // Entrance animation
  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.to(`.${styles.tagline}`, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.3,
      })
        .to(
          `.${styles.nameInner}`,
          {
            opacity: 1,
            y: "0%",
            duration: 1.1,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.4"
        )
        .to(
          `.${styles.subtitle}`,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .to(
          `.${styles.description}`,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .to(
          `.${styles.actions}`,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .to(
          `.${styles.controls}`,
          {
            opacity: 1,
            duration: 0.7,
          },
          "-=0.4"
        )
        .to(
          `.${styles.scrollIndicator}`,
          {
            opacity: 1,
            duration: 0.7,
          },
          "-=0.4"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Hide sound hint
  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Keep ambient video synchronized
  useEffect(() => {
    const v = videoRef.current;
    const a = ambientRef.current;

    if (!v || !a) return;

    const sync = () => {
      if (Math.abs(a.currentTime - v.currentTime) > 0.25) {
        a.currentTime = v.currentTime;
      }
    };

    const id = window.setInterval(sync, 1500);

    return () => window.clearInterval(id);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    const a = ambientRef.current;

    if (!v || !a) return;

    if (v.paused) {
      v.play();
      a.play();
      setPlaying(true);
    } else {
      v.pause();
      a.pause();
      setPlaying(false);
    }
  };

  const handleVideoEnded = () => {
    setPlaying(false);

    window.setTimeout(() => {
      const v = videoRef.current;
      const a = ambientRef.current;

      if (!v || !a) return;

      v.currentTime = 0;
      a.currentTime = 0;

      v.play();
      a.play();

      setPlaying(true);
    }, 40000);
  };

  const toggleMute = () => {
    const v = videoRef.current;

    if (!v) return;

    v.muted = !v.muted;
    setMuted(v.muted);
    setHintVisible(false);
  };

  const scrollNext = () => {
    nextRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    
    <>
        <section
          ref={rootRef}
          id="home"
          className={styles.hero}
          aria-label="Portfolio introduction"
        >
          <nav className={styles.navbar}>
            <a href="#home" className={styles.logo}>
              VK
            </a>

            <div className={styles.navLinks}>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a
                href="#publications"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("publications")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                Publications
              </a>

              <a
                href="#experience"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("experience")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                Experience
              </a>
              <a href="#projects">Projects</a>
              <a href="#toolbox">Skill</a>
              <a href="#contact">Contact</a>
            </div>
          </nav>

        {/* Soft ambient background */}
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

        {/* Main video */}
        <div className={styles.videoArea}>
          <video
            ref={videoRef}
            className={`${styles.cardVideo} ${
              loaded ? styles.loaded : ""
            }`}
            src={heroVideoUrl}
            autoPlay
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setLoaded(true)}
            onCanPlay={() => setLoaded(true)}
            onError={() => setFailed(true)}
            onEnded={handleVideoEnded}
          />

          <div className={styles.videoGlow} aria-hidden />
        </div>

        {/* Cinematic color treatment */}
        <div className={styles.gradient} aria-hidden />

        {/* Floating particles */}
        <CinematicLayer />

        {/* Loading screen */}
        <div
          className={`${styles.loader} ${
            loaded || failed ? styles.loaderHidden : ""
          }`}
          aria-hidden={loaded || failed}
        >
          <div className={styles.loaderGlow} />

          <div className={styles.loaderRing}>
            <span className={styles.loaderArc} />
          </div>

          <p className={styles.loaderLabel}>
            {failed ? "Intro unavailable" : "Loading intro"}
          </p>
        </div>

        {/* Main content */}
        <div className={styles.layout}>
          <div className={styles.content}>
            <p className={styles.tagline}>
              PORTFOLIO <span>•</span> 2026
            </p>

            <h1 className={styles.name}>
              <span className={styles.nameLine}>
                <span className={styles.nameInner}>Vishwa</span>
              </span>

              <span className={styles.nameLine}>
                <span className={styles.nameInner}>Kachhadiya</span>
              </span>
            </h1>

            <p className={styles.subtitle}>
              AI / ML RESEARCHER & DEVELOPER
            </p>

            <div className={styles.accentLine} />

            <p className={styles.description}>
              M.Sc. Computer Science (AI) at Université de Montréal.
              Passionate about building intelligent systems, conducting
              impactful research, and turning ideas into meaningful
              technology.
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={scrollNext}
              >
                <span>ABOUT ME</span>
                <span className={styles.buttonArrow}>↗</span>
              </button>

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={scrollNext}
              >
                <span>VIEW WORK</span>
                <span className={styles.buttonArrow}>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sound hint */}
        <button
          type="button"
          className={`${styles.soundHint} ${
            hintVisible && muted ? styles.visible : ""
          }`}
          onClick={toggleMute}
          aria-label="Tap for sound"
        >
          Tap for sound
        </button>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            type="button"
            onClick={toggleMute}
            className={styles.glass}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <line x1="22" y1="9" x2="16" y2="15" />
                <line x1="16" y1="9" x2="22" y2="15" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={styles.playButton}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          className={styles.scrollIndicator}
          onClick={scrollNext}
          aria-label="Scroll to next section"
        >
          <span className={styles.scrollMouse}>
            <span />
          </span>

          <span className={styles.scrollText}>
            SCROLL TO EXPLORE
          </span>
        </button>
      </section>

      <div ref={nextRef}>
        <Portfolio />
      </div>
    </>
  );
}