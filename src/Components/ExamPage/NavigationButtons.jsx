
import React from "react";

export default function NavigationButtons({
  currentQuestionIndex,
  totalQuestions,
  currentSubjectIndex,
  totalSubjects,
  onPrev,
  onNext,
  onNextSubject,
  onSubmit,
}) {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isLastSubject = currentSubjectIndex === totalSubjects - 1;

  return (
    <div className="flex justify-between gap-3">
      <button
        onClick={onPrev}
        disabled={currentQuestionIndex === 0}
        className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>

      <button
        onClick={onSubmit}
        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase transition shadow-md"
      >
        Submit Exam
      </button>

      <button
        onClick={
          isLastQuestion ? (isLastSubject ? onSubmit : onNextSubject) : onNext
        }
        disabled={isLastQuestion && isLastSubject}
        className={`px-6 py-3 rounded-lg font-semibold transition ${
          isLastQuestion && !isLastSubject
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : isLastQuestion && isLastSubject
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {isLastQuestion && !isLastSubject
          ? "Next Subject"
          : isLastQuestion
          ? "Submit Exam"
          : "Next"}
      </button>
    </div>
  );
}
