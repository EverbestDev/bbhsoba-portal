
import React from "react";

export default function QuestionCard({
  question,
  index,
  total,
  subject,
  userAnswer,
  onAnswer,
  isSubmitted,
  correctAnswer,
}) {
  if (!question) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-800">
          Question {index + 1} of {total}
        </h2>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          {subject}
        </span>
      </div>

      <p className="text-lg text-gray-800 mb-6 leading-relaxed">
        {question.question}
      </p>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const isCorrect = opt === question.answer;
          const isUserAnswer = opt === userAnswer;
          const isWrong = isUserAnswer && !isCorrect;

          return (
            <button
              key={opt}
              disabled={isSubmitted}
              onClick={() => onAnswer(opt)}
              className={`w-full p-4 rounded-lg border-2 text-left flex items-center gap-3 transition ${
                isSubmitted
                  ? isCorrect
                    ? "bg-green-100 border-green-500 text-green-800"
                    : isWrong
                    ? "bg-red-100 border-red-500 text-red-800"
                    : "bg-gray-50 border-gray-300 text-gray-600"
                  : isUserAnswer
                  ? "bg-green-600 text-white border-green-600 shadow-md"
                  : "bg-white border-gray-300 hover:border-green-400 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  isSubmitted
                    ? isCorrect
                      ? "bg-green-500 text-white"
                      : isWrong
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-600"
                    : isUserAnswer
                    ? "bg-white text-green-600"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{opt}</span>
              {isSubmitted && isCorrect && (
                <span className="ml-auto">Correct</span>
              )}
              {isSubmitted && isWrong && <span className="ml-auto">Wrong</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
