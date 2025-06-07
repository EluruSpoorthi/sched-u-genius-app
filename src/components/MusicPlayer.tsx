
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from "lucide-react";

const lofiTracks = [
  {
    id: 1,
    title: "Calm Lofi Vibes",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 180,
  },
  {
    id: 2,
    title: "Soft Ambient Flow",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 200,
  },
  {
    id: 3,
    title: "Focus Session",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 160,
  },
];

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', nextTrack);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', nextTrack);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % lofiTracks.length);
    setCurrentTime(0);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 100);
    }
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + lofiTracks.length) % lofiTracks.length);
    setCurrentTime(0);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 100);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!duration || isNaN(duration) || duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  return (
    <Card className="w-full terminal-bg glow-magenta border-neon-magenta/50 animate-fade-in">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Music className="w-5 h-5 neon-magenta" />
          <div className="flex-1">
            <h3 className="font-mono text-sm neon-magenta font-bold">NEURAL_AUDIO_SYSTEM</h3>
            <p className="font-mono text-xs neon-cyan truncate">
              {lofiTracks[currentTrack].title}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-background/50 h-1 rounded border border-neon-magenta/30">
            <div 
              className="h-full bg-neon-magenta rounded transition-all duration-300"
              style={{ 
                width: `${getProgressPercentage()}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono neon-cyan">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={prevTrack}
            className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-background transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={togglePlay}
            className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background transition-all glow-magenta"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={nextTrack}
            className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-background transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 neon-green" />
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs font-mono neon-green w-8">{volume[0]}%</span>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={lofiTracks[currentTrack].url}
          preload="metadata"
        />
      </CardContent>
    </Card>
  );
};
