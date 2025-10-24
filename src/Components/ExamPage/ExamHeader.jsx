import React from "react";

export default function ExamHeader({ subject, timeLeft, onExit }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">Exam: {subject}</h1>
        <div className="flex items-center space-x-4">
          <span className="bg-yellow-400 text-green-800 px-3 py-2 rounded-lg font-semibold text-sm transition">
            Time Left: {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
}
