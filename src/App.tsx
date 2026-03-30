/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Lock, Unlock, Sparkles, Crown, Volume2, VolumeX } from 'lucide-react';

const CORRECT_PASSWORD = "KAIRA";

// Placeholder images for the background slideshow
const BACKGROUND_IMAGES = [
  "https://picsum.photos/seed/kaira1/1920/1080",
  "https://picsum.photos/seed/kaira2/1920/1080",
  "https://picsum.photos/seed/kaira3/1920/1080",
  "https://picsum.photos/seed/kaira4/1920/1080",
];

// Placeholder royalty-free romantic music
const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export default function App() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audio] = useState(new Audio(MUSIC_URL));

  // Background Image Slideshow Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(interval);
  }, []);

  // Music Control Logic
  useEffect(() => {
    audio.loop = true;
    if (isUnlocked && !isMuted) {
      audio.play().catch(e => console.log("Autoplay blocked:", e));
    } else {
      audio.pause();
    }
    return () => audio.pause();
  }, [isUnlocked, isMuted, audio]);

  const handleUnlock = () => {
    if (password.toUpperCase() === CORRECT_PASSWORD) {
      setIsUnlocked(true);
      setError(false);
      triggerConfetti();
    } else {
      setError(true);
      setPassword("");
    }
  };

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#fffafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-1">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{
              y: "-20vh",
              opacity: [0, 0.1, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
            className="absolute text-pink-200"
          >
            {i % 2 === 0 ? <Heart size={24} fill="currentColor" /> : <Sparkles size={20} />}
          </motion.div>
        ))}
      </div>

      {/* Music Toggle Button */}
      {isUnlocked && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-6 right-6 z-50 p-3 bg-white/50 backdrop-blur-md rounded-full text-pink-500 hover:bg-white/80 transition-all shadow-lg"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-pink-50 text-center z-10"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                <Lock size={32} />
              </div>
            </div>
            
            <h1 className="text-3xl font-serif italic text-gray-800 mb-2">A little surprise awaits ✨</h1>
            <p className="text-gray-500 mb-8">Enter the special word to unlock your birthday note</p>
            
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="Enter password"
                className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all text-center text-lg placeholder:text-gray-300"
              />
              
              <button
                onClick={handleUnlock}
                className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-pink-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Unlock size={20} />
                Unlock
              </button>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-pink-500 text-sm font-medium"
                >
                  That’s not quite it 💕
                </motion.p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="message-screen"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border border-pink-50 text-center z-10 relative overflow-hidden"
          >
            {/* Background Slideshow inside the card */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 0.15, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={BACKGROUND_IMAGES[currentImageIndex]}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    alt=""
                  />
                </motion.div>
              </AnimatePresence>
              {/* Subtle gradient overlay to keep text readable */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/80" />
            </div>

            <div className="relative z-10 p-10 md:p-16">
              {/* Decorative Crown for the Productivity Queen */}
              <motion.div 
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
                className="absolute top-8 right-8 text-yellow-400/30"
              >
                <Crown size={64} />
              </motion.div>

              <div className="mb-8 flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-pink-500"
                >
                  <Heart size={48} fill="currentColor" />
                </motion.div>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif italic text-gray-900 mb-8">Happy Belated Birthday ✨</h2>
              
              <div className="space-y-6 text-lg leading-relaxed text-gray-800 font-medium">
                <p>
                  If you’re reading this, then my little design worked 😄
                  <br /> I just wanted to leave a tiny reminder that someone thinks you’re amazing.
                </p>
                <p>
                  Not every beautiful thing needs to be said out loud immediately.
                  Some feelings are better discovered… one scan at a time.
                </p>
                <p>
                  Some people have a way of making ordinary moments feel special,
                  and your presence does that more often than you probably know.
                </p>
                <p>
                  Even though this comes a little after your special day,
                  the thought behind it has been with me for a while.
                  I just wanted to celebrate you in my own little way.
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-pink-100">
                <div className="text-gray-500 italic mb-2">— from someone who truly admires your light</div>
                <div className="text-pink-600 font-serif font-semibold text-xl">
                  <br /> Happy Birthday once again to you KAIRA. 
                  <br /> The Productivity Queen
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for custom fonts if needed */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </div>
  );
}


