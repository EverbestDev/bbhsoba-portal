export default function SubmitModal({ show, onCancel, onConfirm }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm mx-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Exam?</h3>
        <p className="text-gray-600 mb-6">
          You are about to submit your answers. This action{" "}
          <strong>cannot be undone</strong>.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition shadow-md"
          >
            Submit Now
          </button>
        </div>
      </div>
    </div>
  );
}
