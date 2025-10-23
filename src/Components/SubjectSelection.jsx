import React, { useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  BookOpen,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { CLASS_NAMES, SUBJECTS } from "./constants";

export default function SubjectSelection({
  selectedClass,
  onBack,
  onStartExam,
}) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const totalDuration = selectedSubjects.length * 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 6.253v13m0-13C10.553 5.484 9.112 5 7.5 5 4.996 5 3 6.994 3 9.475c0 1.25.5 2.5 1.5 3.5l-1.5 1.5V17h18v-3.025l-1.5-1.5c1-1 1.5-2.25 1.5-3.5C21 6.994 19.004 5 16.5 5c-1.612 0-3.053.484-4.5 1.253z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  Baptist Boys High School (BBHS)
                </h1>
                <p className="text-xs text-green-100">
                  Online Examination Portal
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 bg-green-800 hover:bg-green-900 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">
                Back to Classes
              </span>
              <span className="sm:hidden text-sm font-medium">Back</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border-t-4 border-green-600">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-green-100 to-yellow-100 p-3 rounded-lg flex-shrink-0">
              <BookOpen className="w-7 h-7 text-green-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {CLASS_NAMES[selectedClass]}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Select one or more subjects you wish to take examination for.
                You can select multiple subjects to take them consecutively.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-yellow-100 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden md:inline">
                Login
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden md:inline">
                Select Class
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden md:inline">
                Choose Subject
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span className="text-sm font-semibold text-gray-500 hidden md:inline">
                Start Exam
              </span>
            </div>
          </div>
        </div>
        {selectedSubjects.length > 0 && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-5 md:p-6 mb-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-400 text-green-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                  {selectedSubjects.length}
                </div>
                <div>
                  <p className="text-sm text-green-100">Subjects Selected</p>
                  <p className="font-semibold text-lg">
                    {selectedSubjects.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-800 bg-opacity-50 rounded-lg px-4 py-3 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-xs text-green-100">Total Duration</p>
                    <p className="font-bold">{totalDuration} minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => onStartExam(selectedSubjects)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-green-800 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <span>Start Exam</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SUBJECTS[selectedClass].map((subject) => {
            const isSelected = selectedSubjects.includes(subject);
            return (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left shadow-md hover:shadow-xl transform hover:-translate-y-1 ${
                  isSelected
                    ? "bg-gradient-to-br from-green-600 to-green-700 border-green-600 text-white scale-105"
                    : "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-yellow-400" : "bg-green-100"
                    }`}
                  >
                    <BookOpen
                      className={`w-5 h-5 ${
                        isSelected ? "text-green-800" : "text-green-600"
                      }`}
                    />
                  </div>
                  {isSelected && (
                    <div className="bg-yellow-400 rounded-full p-1">
                      <CheckCircle className="w-5 h-5 text-green-800" />
                    </div>
                  )}
                </div>

                <h3
                  className={`font-bold text-lg mb-2 ${
                    isSelected
                      ? "text-white"
                      : "text-gray-800 group-hover:text-green-700"
                  }`}
                >
                  {subject}
                </h3>

                <div className="flex items-center space-x-2 text-sm">
                  <Clock
                    className={`w-4 h-4 ${
                      isSelected ? "text-green-100" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={isSelected ? "text-green-100" : "text-gray-600"}
                  >
                    5 minutes
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-5 md:p-6">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Examination Instructions
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Each subject has a duration of 5 minutes</li>
                <li>
                  • You can select multiple subjects to take consecutively
                </li>
                <li>• Once you start, you cannot pause the examination</li>
                <li>
                  • Make sure you have selected all desired subjects before
                  starting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
