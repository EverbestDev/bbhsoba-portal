export default function WarningModal({ show, message, color, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-sm">
      <div
        className={`bg-white p-6 rounded-xl shadow-xl border-4 ${
          color === "yellow" ? "border-yellow-400" : "border-red-500"
        } max-w-sm mx-auto`}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Time Warning!</h3>
        <p className="text-lg mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
