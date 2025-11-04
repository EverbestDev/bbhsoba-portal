import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [schoolName, setSchoolName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (schoolName.toLowerCase() === "bbhsoba" && password === "12345") {
        onLogin();
      } else {
        setError("Invalid School Name or Password");
        setLoading(false);
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 flex-col-reverse md:flex-none">
          <div className="p-4 md:p-6 bg-gray-50 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                Student Login
              </h2>
              <p className="text-gray-600 text-xs">
                Enter your credentials to access the examination portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  School Name / Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg outline-none transition duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white text-sm"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg outline-none transition duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white text-sm"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded-r text-xs">
                  <p className="text-red-700 font-medium flex items-center space-x-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                } text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                {loading ? "Logging in..." : "Access Examination Portal"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-300 text-xs text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <a href="#" className="hover:text-green-600 transition">
                  Privacy Policy
                </a>
                <span>•</span>
                <a href="#" className="hover:text-green-600 transition">
                  Terms of Use
                </a>
                <span>•</span>
                <a href="#" className="hover:text-green-600 transition">
                  Help
                </a>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 md:p-6 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
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
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.553 5.484 9.112 5 7.5 5 4.996 5 3 6.994 3 9.475c0 1.25.5 2.5 1.5 3.5l-1.5 1.5V17h18v-3.025l-1.5-1.5c1-1 1.5-2.25 1.5-3.5C21 6.994 19.004 5 16.5 5c-1.612 0-3.053.484-4.5 1.253z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">
                    Baptist Boys High School (BBHS)
                  </h1>
                  <p className="text-green-100 text-xs">
                    Excellence in Education
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-yellow-300">
                  Online Examination Portal
                </h2>
                <p className="text-green-50 text-xs md:text-sm leading-relaxed">
                  Welcome to the Baptist Boys High School (BBHS) Digital
                  Assessment Platform. This secure portal provides students with
                  access to online examinations across all subjects and classes.
                </p>
              </div>

              <div className="bg-green-800 bg-opacity-50 rounded-lg p-3 space-y-2 text-xs">
                <h3 className="font-semibold text-yellow-300 flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Examination Guidelines</span>
                </h3>
                <ul className="space-y-1 text-green-50">
                  <li className="flex items-start space-x-1">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span>Ensure you have a stable internet connection</span>
                  </li>
                  <li className="flex items-start space-x-1">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span>Read all instructions carefully before starting</span>
                  </li>
                  <li className="flex items-start space-x-1">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span>Complete the exam within the allocated time</span>
                  </li>
                  <li className="flex items-start space-x-1">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span>Submit your answers before time expires</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-green-500 text-xs text-green-100">
              <p>
                © 2025 Baptist Boys High School (BBHS). All rights reserved.
              </p>
              <p className="mt-1">
                For technical support, contact: https://bbhsoba.org/
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
