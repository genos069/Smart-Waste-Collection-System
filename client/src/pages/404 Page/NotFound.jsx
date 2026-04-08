import { motion } from "framer-motion";

export default function NotFoundPage() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 px-6 overflow-hidden">
      {/* Floating Waste Emojis */}
      <motion.div
        className="absolute text-4xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        style={{ top: "10%", left: "10%" }}
      >
        🗑️
      </motion.div>

      <motion.div
        className="absolute text-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        style={{ bottom: "15%", right: "12%" }}
      >
        ♻️
      </motion.div>

      <motion.div
        className="absolute text-5xl"
        animate={{ x: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        style={{ top: "50%", left: "5%" }}
      >
        🚛
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-lg bg-white border border-gray-200 rounded-3xl shadow-xl p-10 max-w-xl w-full text-center"
      >
        {/* 404 Title */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-extrabold tracking-widest text-gray-800"
        >
          4<span className="inline-block animate-bounce">🗑️</span>4
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-lg text-gray-600"
        >
          Oops! This page got lost in the trash... 🚮
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 text-sm text-gray-500"
        >
          Don’t worry, our waste collection team is on it! Meanwhile, you can head back home.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <button
            onClick={handleGoHome}
            className="px-8 py-3 rounded-2xl bg-gray-900 text-white font-semibold shadow-md hover:scale-105 hover:bg-black transition-all"
          >
            ⬅️ Go Back Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

/*
TEST CASES:

1. Render Test:
   - Component should render without crashing.
   - "404" text with emoji should be visible.

2. Theme Test:
   - Background should be light (white/gray gradient).

3. Emoji Presence Test:
   - Waste-related emojis (🗑️ ♻️ 🚛 🚮) should appear on screen.

4. Button Click Test:
   - Clicking button redirects to "/".

5. Animation Test:
   - Floating emojis animate continuously.
   - Main card fades/scales in.
*/