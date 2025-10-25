// src/Components/ExamPage/ResultsReview.jsx
import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export default function ResultsReview({
  results,
  selectedClass,
  selectedSubjects,
  onBack,
}) {
  const [activeTab, setActiveTab] = useState("summary");
  const [currentSubject, setCurrentSubject] = useState(
    selectedSubjects[0] || ""
  );
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Load answers from loc
  useEffect(() => {
    const saved = localStorage.getItem("exam_answers");
    if (saved) {
      setAnswers(JSON.parse(saved));
    }
  }, []);

  // Get displayed questions for subject
  const getDisplayedQuestions = (subject) => {
    const saved = localStorage.getItem(`exam_displayed_${subject}`);
    return saved ? JSON.parse(saved) : [];
  };

  const displayed = getDisplayedQuestions(currentSubject);
  const subjectAnswers = answers[currentSubject] || {};
  const question = displayed[currentQIndex];
  const userAnswer = subjectAnswers[currentQIndex];
  const isCorrect = userAnswer === question?.answer;

  // Calculate overall score
  const overall = results.find((r) => r.subject.includes("Overall"));
  const overallScore = overall ? parseFloat(overall.percentage) : 0;

  // Confetti effect for high scores
  useEffect(() => {
    if (overallScore >= 80) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [overallScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 max-w-sm sm:min-w-full px-auto">
      <div className=" max-w-full md:max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Exam Review
          </h1>
          <p className="text-gray-600">Analyse your performance</p>

          {overallScore >= 80 && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-800">
                Excellent! You scored {overallScore}%!
              </p>
            </div>
          )}
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex-1 py-2 rounded-md font-medium transition ${
              activeTab === "summary"
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`flex-1 py-2 rounded-md font-medium transition ${
              activeTab === "review"
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Review Answers
          </button>
        </div>

        {/* Summary tab */}
        {activeTab === "summary" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-4 py-3 text-left whitespace-nowrap">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">
                      Correct
                    </th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">
                      Wrong
                    </th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">
                      Unanswered
                    </th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={i}
                      className={
                        r.subject.includes("Overall")
                          ? "bg-yellow-50 font-bold"
                          : i % 2 === 0
                          ? "bg-gray-50"
                          : "bg-white"
                      }
                    >
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {r.subject}
                      </td>
                      <td className="px-4 py-3 text-center text-green-600 whitespace-nowrap">
                        {r.correct}
                      </td>
                      <td className="px-4 py-3 text-center text-red-600 whitespace-nowrap">
                        {r.wrong}
                      </td>
                      <td className="px-4 py-3 text-center text-green-600 whitespace-nowrap">
                        {r.unanswered}
                      </td>
                      <td className="px-4 py-3 text-center font-bold whitespace-nowrap">
                        {r.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Review tab */}
        {activeTab === "review" && (
          <div className="space-y-6">
            {/* Subject selector */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-green-700 mb-2">
                Select Subject
              </label>
              <select
                value={currentSubject}
                onChange={(e) => {
                  setCurrentSubject(e.target.value);
                  setCurrentQIndex(0);
                }}
                className="w-full p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                {selectedSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Question grid */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 20 }, (_, i) => {
                  const ans = subjectAnswers[i];
                  const q = displayed[i];
                  const correct = ans === q?.answer;

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentQIndex(i)}
                      className={`
                        aspect-square rounded text-xs font-bold transition
                        ${
                          i === currentQIndex
                            ? "bg-green-600 text-white ring-2 ring-green-400"
                            : ans === undefined
                            ? "bg-gray-200 text-gray-700"
                            : correct
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question card */}
            {question && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Question {currentQIndex + 1} of 20
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Wrong"}
                  </span>
                </div>

                <p className="text-lg text-gray-800 mb-6 leading-relaxed">
                  {question.question}
                </p>

                <div className="space-y-3">
                  {question.options.map((opt, idx) => {
                    const isUserChoice = opt === userAnswer;
                    const isCorrectAnswer = opt === question.answer;

                    return (
                      <div
                        key={opt}
                        className={`
                          p-4 rounded-lg border-2 flex items-center gap-3
                          ${
                            isCorrectAnswer
                              ? "bg-green-100 border-green-500"
                              : isUserChoice && !isCorrect
                              ? "bg-red-100 border-red-500"
                              : "bg-gray-50 border-gray-300"
                          }
                        `}
                      >
                        <span
                          className={`
                            w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                            ${
                              isCorrectAnswer
                                ? "bg-green-500 text-white"
                                : isUserChoice && !isCorrect
                                ? "bg-red-500 text-white"
                                : "bg-gray-300 text-gray-700"
                            }
                          `}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>

                        {isUserChoice && !isCorrect && (
                          <span className="text-red-700 font-medium">
                            You chose
                          </span>
                        )}
                        {isCorrectAnswer && (
                          <span className="text-green-700 font-medium">
                            Correct answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Feedback */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">
                    {isCorrect ? (
                      "Well done! You selected the correct answer."
                    ) : (
                      <>
                        <span className="text-red-600">Incorrect.</span> You
                        chose: <strong>{userAnswer}</strong>. The correct answer
                        is:{" "}
                        <strong className="text-green-600">
                          {question.answer}
                        </strong>
                        .
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back button */}
        <button
          onClick={onBack}
          className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition shadow-md"
        >
          Back to Subjects
        </button>
      </div>
    </div>
  );
}
