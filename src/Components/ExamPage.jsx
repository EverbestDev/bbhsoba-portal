import React, { useState, useEffect } from "react";

export const QUESTIONS = {
  jss1: {
    Mathematics: [
      {
        question: "What is 2 + 3?",
        options: ["4", "5", "6", "7"],
        answer: "5",
      },
      {
        question: "What is 10 ÷ 2?",
        options: ["2", "4", "5", "6"],
        answer: "5",
      },
    ],
    "English Language": [
      {
        question: "Choose the correct spelling:",
        options: ["Recieve", "Receive", "Receeve", "Recive"],
        answer: "Receive",
      },
      {
        question: "Pick the correct verb form: He ____ to school every day.",
        options: ["go", "goes", "going", "gone"],
        answer: "goes",
      },
    ],
    "Basic Science": [
      {
        question: "Which planet is closest to the Sun?",
        options: ["Earth", "Venus", "Mercury", "Mars"],
        answer: "Mercury",
      },
    ],
  },
  jss2: {
    Mathematics: [
      {
        question: "Simplify: 3x + 2x = ?",
        options: ["5", "6x", "5x", "x²"],
        answer: "5x",
      },
    ],
    "English Language": [
      {
        question: "Choose the synonym of 'Happy':",
        options: ["Sad", "Joyful", "Angry", "Bored"],
        answer: "Joyful",
      },
    ],
  },
  ss1: {
    Physics: [
      {
        question: "What is the SI unit of force?",
        options: ["Joule", "Pascal", "Newton", "Watt"],
        answer: "Newton",
      },
    ],
    Chemistry: [
      {
        question: "Water is made up of which two elements?",
        options: [
          "Hydrogen and Oxygen",
          "Carbon and Oxygen",
          "Nitrogen and Hydrogen",
          "Hydrogen and Carbon",
        ],
        answer: "Hydrogen and Oxygen",
      },
    ],
  },
  ss2: {
    Biology: [
      {
        question: "What part of the cell contains genetic material?",
        options: ["Cytoplasm", "Nucleus", "Cell wall", "Ribosome"],
        answer: "Nucleus",
      },
    ],
  },
  ss3: {
    Mathematics: [
      {
        question: "Find the derivative of 2x²",
        options: ["4x", "x²", "2x", "2x²"],
        answer: "4x",
      },
    ],
  },
};

export const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

function ExamPage({
  selectedClass = "jss1",
  selectedSubjects = ["Mathematics", "English Language", "Basic Science"],
  onBack,
}) {
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(
    selectedSubjects.length * 5 * 60 || 300
  );
  const [submitted, setSubmitted] = useState(false);
  const [subjectResults, setSubjectResults] = useState([]);
  const [showNavigator, setShowNavigator] = useState(false);

  const currentSubject = selectedSubjects[currentSubjectIndex];
  const [questions, setQuestions] = useState(() => {
    const qs = QUESTIONS[selectedClass]?.[currentSubject] || [];
    return shuffleArray(qs).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
  });

  useEffect(() => {
    const qs = QUESTIONS[selectedClass]?.[currentSubject] || [];
    setQuestions(
      shuffleArray(qs).map((q) => ({ ...q, options: shuffleArray(q.options) }))
    );
    setCurrentQuestionIndex(0);
  }, [currentSubject, selectedClass]);

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) handleSubmit();
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentSubject]: {
        ...answers[currentSubject],
        [currentQuestionIndex]: option,
      },
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const results = selectedSubjects.map((sub) => {
      const subQuestions = QUESTIONS[selectedClass]?.[sub] || [];
      let correct = 0;
      let wrong = 0;
      let unanswered = 0;

      subQuestions.forEach((q, i) => {
        const userAnswer = answers[sub]?.[i];
        if (!userAnswer) {
          unanswered++;
        } else if (userAnswer === q.answer) {
          correct++;
        } else {
          wrong++;
        }
      });

      const total = subQuestions.length;
      const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

      return {
        subject: sub,
        correct,
        wrong,
        unanswered,
        total,
        percentage,
      };
    });

    setSubjectResults(results);
    setSubmitted(true);
  };

  const totalQuestions = selectedSubjects.reduce(
    (sum, s) => sum + (QUESTIONS[selectedClass]?.[s]?.length || 0),
    0
  );

  if (submitted) {
    const overallCorrect = subjectResults.reduce(
      (sum, r) => sum + r.correct,
      0
    );
    const overallPercentage =
      totalQuestions > 0
        ? ((overallCorrect / totalQuestions) * 100).toFixed(1)
        : 0;

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <h1 className="text-3xl font-bold text-center mb-2">
                Examination Results
              </h1>
              <p className="text-center text-green-100">
                {selectedClass.toUpperCase()} -{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="p-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500 rounded-lg p-6 mb-8 text-center">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                  OVERALL PERFORMANCE
                </h2>
                <div className="text-6xl font-bold text-green-600 mb-2">
                  {overallPercentage}%
                </div>
                <p className="text-lg text-gray-700">
                  {overallCorrect} correct out of {totalQuestions} questions
                </p>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-6 uppercase border-b-2 border-gray-300 pb-2">
                Subject Performance Summary
              </h3>

              <div className="space-y-4 mb-8">
                {subjectResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-bold text-gray-800">
                        {result.subject}
                      </h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {result.percentage}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.correct}/{result.total}
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${result.percentage}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 border border-green-300 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {result.correct}
                        </div>
                        <div className="text-xs text-green-600 uppercase font-semibold">
                          Correct
                        </div>
                      </div>
                      <div className="bg-red-50 border border-red-300 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-red-700">
                          {result.wrong}
                        </div>
                        <div className="text-xs text-red-600 uppercase font-semibold">
                          Wrong
                        </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-300 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-700">
                          {result.unanswered}
                        </div>
                        <div className="text-xs text-yellow-600 uppercase font-semibold">
                          Unanswered
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onBack}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold uppercase tracking-wide transition shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              {selectedClass.toUpperCase()} EXAMINATION
            </h1>
            <p className="text-sm text-green-100">Answer all questions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded">
              <div className="text-xs text-green-100">Time Remaining</div>
              <div className="text-2xl font-bold">
                {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h3 className="font-bold text-gray-800 mb-3 uppercase text-sm border-b pb-2">
                Subject Navigation
              </h3>
              <div className="space-y-2">
                {selectedSubjects.map((sub, idx) => {
                  const total = QUESTIONS[selectedClass]?.[sub]?.length || 0;
                  const answered = Object.keys(answers[sub] || {}).length;
                  return (
                    <button
                      key={sub}
                      onClick={() => {
                        setCurrentSubjectIndex(idx);
                        setCurrentQuestionIndex(0);
                      }}
                      className={`w-full text-left p-3 rounded transition ${
                        idx === currentSubjectIndex
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <div className="font-semibold text-sm">{sub}</div>
                      <div
                        className={`text-xs ${
                          idx === currentSubjectIndex
                            ? "text-green-100"
                            : "text-gray-600"
                        }`}
                      >
                        {answered}/{total} answered
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowNavigator(!showNavigator)}
                className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-semibold text-sm transition"
              >
                {showNavigator ? "Hide" : "Show"} Question Grid
              </button>

              {showNavigator && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">
                    {currentSubject}
                  </h4>
                  <div className="grid grid-cols-5 gap-1">
                    {questions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`aspect-square rounded text-xs font-bold transition ${
                          idx === currentQuestionIndex
                            ? "bg-green-600 text-white ring-2 ring-green-400"
                            : answers[currentSubject]?.[idx]
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {currentSubject}
                </span>
              </div>

              <p className="text-lg text-gray-800 mb-6 leading-relaxed">
                {questions[currentQuestionIndex]?.question || "No Question"}
              </p>

              <div className="space-y-3">
                {questions[currentQuestionIndex]?.options?.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className={`w-full p-4 rounded-lg border-2 transition text-left flex items-center gap-3 ${
                      answers[currentSubject]?.[currentQuestionIndex] === opt
                        ? "bg-green-600 text-white border-green-600 shadow-md"
                        : "bg-white border-gray-300 hover:border-green-400 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                        answers[currentSubject]?.[currentQuestionIndex] === opt
                          ? "bg-white text-green-600"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase transition shadow-md"
              >
                Submit Exam
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
