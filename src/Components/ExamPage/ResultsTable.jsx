import React from "react";

export default function ResultsTable({ results, onBack }) {
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
              {results.map((r, i) => (
                <tr
                  key={i}
                  className={
                    r.subject.includes("Overall")
                      ? "bg-yellow-50 font-bold border-t-2 border-yellow-400"
                      : i % 2 === 0
                      ? "bg-gray-50"
                      : "bg-white"
                  }
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
