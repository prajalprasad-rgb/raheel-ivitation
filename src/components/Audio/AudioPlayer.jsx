import { useCallback, useEffect, useRef, useState } from "react";
import { warnDeveloper } from "../../utils/logger";

const FADE_STEP_MS = 100;
const FADE_DURATION_MS = 2000;

export default function AudioPlayer({ music, shouldStart, visible, fadeOut }) {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const fallbackSourceRef = useRef(null);
  const fallbackGainRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const wasPlayingBeforeHiddenRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [volume] = useState(() => {
    const savedVolume = sessionStorage.getItem("invitation-music-volume");
    return savedVolume ? Number(savedVolume) : music.volume;
  });
  const [useFallbackAudio, setUseFallbackAudio] = useState(false);

  const targetVolume = fadeOut ? 0 : volume;

  const clearFadeTimer = () => {
    if (fadeTimerRef.current) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const getOutputVolume = () => {
    if (useFallbackAudio) {
      return fallbackGainRef.current?.gain.value ?? 0;
    }
    return audioRef.current?.volume ?? 0;
  };

  const setOutputVolume = (nextVolume) => {
    if (useFallbackAudio) {
      if (fallbackGainRef.current) {
        fallbackGainRef.current.gain.value = nextVolume;
      }
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      audio.volume = nextVolume;
    }
  };

  const fadeTo = useCallback((nextVolume, onComplete) => {
    clearFadeTimer();
    const startVolume = getOutputVolume();
    const steps = Math.max(1, FADE_DURATION_MS / FADE_STEP_MS);
    let currentStep = 0;

    fadeTimerRef.current = window.setInterval(() => {
      currentStep += 1;
      const progress = Math.min(currentStep / steps, 1);
      setOutputVolume(startVolume + (nextVolume - startVolume) * progress);

      if (progress >= 1) {
        clearFadeTimer();
        onComplete?.();
      }
    }, FADE_STEP_MS);
  }, [useFallbackAudio]);

  const startFallbackAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return false;

      audioContextRef.current = new AudioContextClass();
      fallbackGainRef.current = audioContextRef.current.createGain();
      fallbackGainRef.current.gain.value = 0;
      fallbackGainRef.current.connect(audioContextRef.current.destination);

      const source = audioContextRef.current.createConstantSource?.() || audioContextRef.current.createOscillator();
      if ("offset" in source) {
        source.offset.value = 0;
      } else {
        source.frequency.value = 0;
      }
      source.connect(fallbackGainRef.current);
      source.start();
      fallbackSourceRef.current = source;
    }

    await audioContextRef.current.resume();
    setUseFallbackAudio(true);
    setPlaying(true);
    fadeTo(targetVolume);
    return true;
  }, [fadeTo, targetVolume]);

  const startAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (useFallbackAudio) {
      await startFallbackAudio();
      return;
    }
    if (!audio) return;

    try {
      audio.muted = false;
      audio.volume = 0;
      await audio.play();
      setPlaying(true);
      fadeTo(targetVolume);
    } catch (error) {
      warnDeveloper("[Invitation Audio] Music could not start. The browser may require a manual play tap.", error);
      await startFallbackAudio();
    }
  }, [fadeTo, startFallbackAudio, targetVolume, useFallbackAudio]);

  useEffect(() => {
    if (shouldStart && !playing) {
      startAudio();
    }
  }, [playing, shouldStart, startAudio]);

  useEffect(() => {
    sessionStorage.setItem("invitation-music-volume", String(volume));
    if (audioRef.current) {
      audioRef.current.muted = false;
    }
    fadeTo(targetVolume);
  }, [fadeTo, targetVolume, volume]);

  useEffect(() => {
    if (!fadeOut || !audioRef.current) return;
    fadeTo(0, () => {
      audioRef.current?.pause();
      audioContextRef.current?.suspend();
      setPlaying(false);
    });
  }, [fadeOut, fadeTo]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        wasPlayingBeforeHiddenRef.current = useFallbackAudio ? playing : !audio.paused;
        audio.pause();
        audioContextRef.current?.suspend();
        setPlaying(false);
        return;
      }

      if (wasPlayingBeforeHiddenRef.current && !fadeOut) {
        startAudio();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fadeOut, playing, startAudio, useFallbackAudio]);

  useEffect(
    () => () => {
      clearFadeTimer();
      fallbackSourceRef.current?.stop?.();
      audioContextRef.current?.close?.();
    },
    []
  );

  const handleAudioError = () => {
    setPlaying(false);
    warnDeveloper("[Invitation Audio] Music file failed to load:", music.file);
    setUseFallbackAudio(true);
  };

  return (
    <audio ref={audioRef} src={music.file} loop preload="auto" onError={handleAudioError} aria-hidden="true" />
  );
}
