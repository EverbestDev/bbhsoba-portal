
import React, { useState } from "react";
import QuestionNavigator from "./QuestionNavigator";

export default function SubjectSidebar({
  subjects,
  currentIndex,
  answers,
  onSelect,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) {
  const [showNavigator, setShowNavigator] = useState(false);

  const getAnsweredCount = (subject) => {
    return Object.keys(answers[subject] || {}).length;
  };

  return (
    <div className="md:col-span-1 bg-white rounded-xl shadow-md p-4 sticky top-4 h-fit">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-4">Subjects</h3>

      {/* Subject List */}
      <div className="space-y-2 mb-6">
        {subjects.map((sub, idx) => {
          const answered = getAnsweredCount(sub);
          const total = 20;

          return (
            <button
              key={sub}
              onClick={() => {
                onSelect(idx);
                setCurrentQuestionIndex(0);
              }}
              className={`
                w-full text-left p-3 rounded-lg transition-all duration-200
                ${
                  idx === currentIndex
                    ? "bg-green-600 text-white shadow-md ring-2 ring-green-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }
              `}
            >
              <div className="font-semibold text-sm">{sub}</div>
              <div
                className={`text-xs mt-1 ${
                  idx === currentIndex ? "text-green-100" : "text-gray-600"
                }`}
              >
                {answered}/{total} answered
              </div>
            </button>
          );
        })}
      </div>

      {/* Toggle Navigator Button */}
      <button
        onClick={() => setShowNavigator(!showNavigator)}
        className={`
          w-full py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md
          bg-gradient-to-r from-green-500 to-emerald-600
          hover:from-green-600 hover:to-emerald-700
          text-white
        `}
      >
        {showNavigator ? "Hide" : "Show"} Question Navigator
      </button>

      {/* Question Navigator Grid */}
      {showNavigator && (
        <QuestionNavigator
          questions={Array.from({ length: 20 })}
          currentIndex={currentQuestionIndex}
          answers={answers}
          subject={subjects[currentIndex]}
          onNavigate={(idx) => {
            onSelect(currentIndex); 
            setCurrentQuestionIndex(idx); 
          }}
        />
      )}
    </div>
  );
}
