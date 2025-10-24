import React from "react";
import { BookOpen, Users, ChevronRight } from "lucide-react";
import { CLASS_NAMES, SUBJECTS } from "../constants";

export default function ClassSelection({ onSelectClass }) {
  const classes = Object.keys(CLASS_NAMES);

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
            <div className="hidden md:block">
              <div className="bg-green-800 bg-opacity-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-green-100">
                  Logged in as:{" "}
                  <span className="font-semibold text-white">Student</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border-t-4 border-green-600">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg flex-shrink-0">
              <BookOpen className="w-7 h-7 text-green-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Select Your Class
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Choose your class level below to view available examination
                subjects. Make sure you select the correct class before
                proceeding to the examination.
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
              <div className="w-8 h-8 bg-yellow-400 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden md:inline">
                Select Class
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-semibold text-gray-500 hidden md:inline">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {classes.map((cls, index) => (
            <button
              key={cls}
              onClick={() => onSelectClass(cls)}
              className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-yellow-50 border-2 border-gray-200 hover:border-green-500 rounded-xl p-6 md:p-8 transition-all duration-300 shadow-md hover:shadow-2xl transform hover:-translate-y-2"
            >
              <div className="text-center">
                <div className="relative mb-5">
                  <div className="bg-gradient-to-br from-green-100 to-yellow-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:scale-110 transform">
                    <span className="text-3xl font-bold bg-gradient-to-br from-green-600 to-green-700 bg-clip-text text-transparent">
                      {CLASS_NAMES[cls]}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-green-800 text-xs font-bold px-2 py-1 rounded-full shadow">
                    {SUBJECTS[cls].length}
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                  {CLASS_NAMES[cls]}
                </h3>

                <div className="flex items-center justify-center space-x-1 text-gray-600 text-sm mb-4">
                  <Users className="w-4 h-4" />
                  <span>{SUBJECTS[cls].length} Subjects Available</span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="inline-flex items-center space-x-2 text-green-600 font-semibold text-sm group-hover:text-green-700">
                    <span>Select Class</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-10 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-5 md:p-6">
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
              <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-700">
                If you're unsure about your class level or can't find your
                class, please contact your teacher or the school administrator
                for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
