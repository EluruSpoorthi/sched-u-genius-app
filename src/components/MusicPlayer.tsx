
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from "lucide-react";

const lofiTracks = [
  {
    id: 1,
    title: "Chill Beats Study Session",
    url: "https://www.soundjay.com/misc/sounds-1030.wav", // placeholder
    duration: 180
  },
  {
    id: 2,
    title: "Ambient Focus Flow",
    url: "https://www.soundjay.com/misc/sounds-1031.wav", // placeholder
    duration: 200
  },
  {
    id: 3,
    title: "Neural Enhancement Mix",
    url: "https://www.soundjay.com/misc/sounds-1032.wav", // placeholder
    duration: 165
  }
];

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % lofiTracks.length);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + lofiTracks.length) % lofiTracks.length);
    setCurrentTime(0);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="fixed bottom-6 right-6 w-80 terminal-bg glow-magenta border-neon-magenta/50 z-50 animate-fade-in">
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
                width: `${(currentTime / lofiTracks[currentTrack].duration) * 100}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono neon-cyan">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(lofiTracks[currentTrack].duration)}</span>
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
          onEnded={nextTrack}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </CardContent>
    </Card>
  );
};
