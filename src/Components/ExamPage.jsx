import React, { useState, useEffect } from "react";
import { QUESTIONS } from "./constants"; 
import { shuffleArray } from "./utils"; 

function ExamPage({ selectedClass, selectedSubjects, onBack }) {
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); 
  const [submitted, setSubmitted] = useState(false);
  const [subjectResults, setSubjectResults] = useState([]);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningColor, setWarningColor] = useState("yellow");

  const currentSubject = selectedSubjects[currentSubjectIndex];
  const [questions, setQuestions] = useState([]);


  useEffect(() => {
    const allQs = QUESTIONS[selectedClass]?.[currentSubject] || [];
    const randomQs = shuffleArray(allQs).slice(0, 20);
    setQuestions(
      randomQs.map((q) => ({ ...q, options: shuffleArray(q.options) }))
    );
    setCurrentQuestionIndex(0);
    setTimeLeft(600); 
    setShowWarning(false); 
  }, [currentSubject, selectedClass]);


  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  useEffect(() => {
    if (timeLeft <= 120 && timeLeft > 60) {
      setWarningMessage("2 minutes remaining!");
      setWarningColor("yellow");
      setShowWarning(true);
    } else if (timeLeft <= 60 && timeLeft > 0) {
      setWarningMessage("1 minute left! Submit soon!");
      setWarningColor("red");
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [timeLeft]);

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

  const handleNextSubject = () => {
    if (currentSubjectIndex < selectedSubjects.length - 1) {
      setCurrentSubjectIndex(currentSubjectIndex + 1);
    } else {
      handleSubmit();
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

  const unansweredTotal = subjectResults.reduce(
    (sum, r) => sum + r.unanswered,
    0
  );

  if (submitted) {
    const overallCorrect = subjectResults.reduce(
      (sum, r) => sum + r.correct,
      0
    );
    const overallWrong = subjectResults.reduce((sum, r) => sum + r.wrong, 0);
    const overallPercentage =
      totalQuestions > 0
        ? ((overallCorrect / totalQuestions) * 100).toFixed(1)
        : 0;

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Examination Results
          </h1>
          <div className="overflow-x-auto mb-8">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="px-4 py-3 text-left">Subject</th>
                  <th className="px-4 py-3 text-center">Correct</th>
                  <th className="px-4 py-3 text-center">Wrong</th>
                  <th className="px-4 py-3 text-center">Unanswered</th>
                  <th className="px-4 py-3 text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {subjectResults.map((r, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-3 font-medium">{r.subject}</td>
                    <td className="px-4 py-3 text-center text-green-600">
                      {r.correct}
                    </td>
                    <td className="px-4 py-3 text-center text-red-600">
                      {r.wrong}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {r.unanswered}
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      {r.percentage}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-yellow-50 font-bold border-t-2 border-yellow-400">
                  <td className="px-4 py-3">Overall</td>
                  <td className="px-4 py-3 text-center text-green-600">
                    {overallCorrect}
                  </td>
                  <td className="px-4 py-3 text-center text-red-600">
                    {overallWrong}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {unansweredTotal}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {overallPercentage}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            onClick={onBack}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition shadow-md"
          >
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  const answered = questions.filter(
    (_, i) => answers[currentSubject]?.[i]
  ).length;
  const total = questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className={`bg-white p-6 rounded-xl shadow-xl border-4 ${
              warningColor === "yellow" ? "border-yellow-400" : "border-red-500"
            } max-w-sm mx-auto`}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Time Warning!
            </h3>
            <p className="text-lg mb-4">{warningMessage}</p>
            <button
              onClick={() => setShowWarning(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold">Exam: {currentSubject}</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-yellow-400 text-green-800 px-3 py-1 rounded-full font-semibold">
              Time Left: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
            <button
              onClick={onBack}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
            >
              Exit Exam
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white rounded-xl shadow-md p-4 sticky top-4 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Subjects</h3>
          <div className="space-y-2 mb-6">
            {selectedSubjects.map((sub, idx) => {
              const subAnswers = answers[sub] || {};
              const answered = Object.keys(subAnswers).length;
              const total = 20; // Fixed 20 questions
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setCurrentQuestionIndex(idx);
                    }}
                    tabIndex={0}
                    aria-label={`Go to question ${idx + 1}${
                      answers[currentSubject]?.[idx] ? " (answered)" : ""
                    }`}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAnswer(opt);
                  }}
                  tabIndex={0}
                  aria-label={`Option ${String.fromCharCode(65 + idx)}: ${opt}`}
                  className={`w-full p-4 rounded-lg border-2 transition text-left flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-green-400 ${
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
              onClick={
                currentQuestionIndex === questions.length - 1
                  ? handleNextSubject
                  : handleNext
              }
              disabled={false}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              {currentQuestionIndex === questions.length - 1
                ? "Next Subject →"
                : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
