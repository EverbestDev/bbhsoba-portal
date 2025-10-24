
import React from "react";

export default function QuestionNavigator({
  questions,
  currentIndex,
  answers,
  subject,
  onNavigate,
}) {
  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
        {subject} – Question Navigator
      </h4>
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((_, idx) => {
          const isAnswered = answers[subject]?.[idx] !== undefined;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              onKeyDown={(e) => e.key === "Enter" && onNavigate(idx)}
              tabIndex={0}
              aria-label={`Go to question ${idx + 1}${
                isAnswered ? " (answered)" : ""
              }`}
              className={`
                aspect-square rounded-lg text-xs font-bold transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                ${
                  isCurrent
                    ? "bg-green-700 text-white ring-2 ring-green-500 ring-offset-2 shadow-lg scale-105"
                    : isAnswered
                    ? "bg-green-200 text-green-800 hover:bg-green-300"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
