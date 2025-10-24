import React, { useState, useEffect } from "react";
import { QUESTIONS } from "../../constants";
import { shuffleArray } from "../../utils";
import ExamHeader from "./ExamHeader";
import SubjectSidebar from "./SubjectSidebar";
import QuestionCard from "./QuestionCard";
import NavigationButtons from "./NavigationButtons";
import WarningModal from "./WarningModal";
import SubmitModal from "./SubmitModal";
import ResultsTable from "./ResultsTable";

function ExamPage({ selectedClass, selectedSubjects, onBack }) {
  // --- STATE (saved in localStorage) ---
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(() => {
    const saved = localStorage.getItem("exam_currentSubjectIndex");
    return saved ? Number(saved) : 0;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem("exam_currentQuestionIndex");
    return saved ? Number(saved) : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("exam_answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("exam_timeLeft");
    return saved ? Number(saved) : 600;
  });
  const [submitted, setSubmitted] = useState(false);
  const [subjectResults, setSubjectResults] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningColor, setWarningColor] = useState("yellow");

  const currentSubject = selectedSubjects[currentSubjectIndex];
  const [questions, setQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);

  // --- LOCALSTORAGE SYNC ---
  useEffect(() => {
    localStorage.setItem("exam_currentSubjectIndex", currentSubjectIndex);
  }, [currentSubjectIndex]);

  useEffect(() => {
    localStorage.setItem("exam_currentQuestionIndex", currentQuestionIndex);
  }, [currentQuestionIndex]);

  useEffect(() => {
    localStorage.setItem("exam_answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("exam_timeLeft", timeLeft);
  }, [timeLeft]);

  // --- LOAD QUESTIONS ---
  useEffect(() => {
    const allQs = QUESTIONS[selectedClass]?.[currentSubject] || [];
    const savedQ = localStorage.getItem(`exam_questions_${currentSubject}`);
    const savedD = localStorage.getItem(`exam_displayed_${currentSubject}`);

    if (savedQ && savedD) {
      setQuestions(JSON.parse(savedQ));
      setDisplayedQuestions(JSON.parse(savedD));
    } else {
      const shuffled = shuffleArray(allQs);
      const selected = shuffled.slice(0, 20);
      const displayed = selected.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
      setQuestions(displayed);
      setDisplayedQuestions(selected);
      localStorage.setItem(
        `exam_questions_${currentSubject}`,
        JSON.stringify(displayed)
      );
      localStorage.setItem(
        `exam_displayed_${currentSubject}`,
        JSON.stringify(selected)
      );
    }

    const savedTime = localStorage.getItem("exam_timeLeft");
    if (!savedTime || Number(savedTime) === 600) setTimeLeft(600);
  }, [currentSubject, selectedClass]);

  // --- TIMER ---
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  // --- WARNINGS ---
  useEffect(() => {
    if (timeLeft <= 120 && timeLeft > 60) {
      setWarningMessage("2 minutes remaining!");
      setWarningColor("yellow");
      setShowWarning(true);
    } else if (timeLeft <= 60 && timeLeft > 0) {
      setWarningMessage("1 minute left! Submit now!");
      setWarningColor("red");
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [timeLeft]);

  // --- HANDLERS ---
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
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = () => {
    const results = selectedSubjects.map((sub) => {
      const originalQs = JSON.parse(
        localStorage.getItem(`exam_displayed_${sub}`) || "[]"
      );
      let correct = 0,
        wrong = 0,
        unanswered = 0;

      originalQs.forEach((q, i) => {
        const userAnswer = answers[sub]?.[i];
        if (!userAnswer) unanswered++;
        else if (userAnswer === q.answer) correct++;
        else wrong++;
      });

      const total = originalQs.length;
      const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

      return { subject: sub, correct, wrong, unanswered, total, percentage };
    });

    const attempted = results.filter((r) => r.total > 0);
    const overallCorrect = attempted.reduce((s, r) => s + r.correct, 0);
    const overallWrong = attempted.reduce((s, r) => s + r.wrong, 0);
    const overallUnanswered = attempted.reduce((s, r) => s + r.unanswered, 0);
    const overallTotal = attempted.reduce((s, r) => s + r.total, 0);
    const overallPercentage =
      overallTotal > 0 ? ((overallCorrect / overallTotal) * 100).toFixed(1) : 0;

    setSubjectResults([
      ...results,
      {
        subject: `Overall (${attempted.length} subject${
          attempted.length > 1 ? "s" : ""
        })`,
        correct: overallCorrect,
        wrong: overallWrong,
        unanswered: overallUnanswered,
        total: overallTotal,
        percentage: overallPercentage,
      },
    ]);
    setSubmitted(true);

    // Cleanup
    selectedSubjects.forEach((sub) => {
      localStorage.removeItem(`exam_questions_${sub}`);
      localStorage.removeItem(`exam_displayed_${sub}`);
    });
    [
      "exam_currentSubjectIndex",
      "exam_currentQuestionIndex",
      "exam_answers",
      "exam_timeLeft",
    ].forEach((key) => localStorage.removeItem(key));
  };

  // --- RENDER ---
  if (submitted) {
    return <ResultsTable results={subjectResults} onBack={onBack} />;
  }

  const answeredCount = Object.keys(answers[currentSubject] || {}).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <WarningModal
        show={showWarning}
        message={warningMessage}
        color={warningColor}
        onClose={() => setShowWarning(false)}
      />
      <SubmitModal
        show={showConfirmSubmit}
        onCancel={() => setShowConfirmSubmit(false)}
        onConfirm={() => {
          setShowConfirmSubmit(false);
          handleSubmit();
        }}
      />

      <ExamHeader
        subject={currentSubject}
        timeLeft={timeLeft}
        onExit={onBack}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-4 gap-6">
        <SubjectSidebar
          subjects={selectedSubjects}
          currentIndex={currentSubjectIndex}
          answers={answers}
          onSelect={setCurrentSubjectIndex}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />

        <div className="md:col-span-3 space-y-6">
          <QuestionCard
            question={questions[currentQuestionIndex]}
            index={currentQuestionIndex}
            total={questions.length}
            subject={currentSubject}
            userAnswer={answers[currentSubject]?.[currentQuestionIndex]}
            onAnswer={handleAnswer}
          />

          <NavigationButtons
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            currentSubjectIndex={currentSubjectIndex}
            totalSubjects={selectedSubjects.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onNextSubject={handleNextSubject}
            onSubmit={() => setShowConfirmSubmit(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
