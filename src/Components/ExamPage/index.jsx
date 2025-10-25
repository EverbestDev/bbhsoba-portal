import React, { useState, useEffect } from "react";
import { QUESTIONS } from "../../constants";
import { shuffleArray } from "../../utils";
import ExamHeader from "./ExamHeader";
import SubjectSidebar from "./SubjectSidebar";
import QuestionCard from "./QuestionCard";
import NavigationButtons from "./NavigationButtons";
import WarningModal from "./WarningModal";
import SubmitModal from "./SubmitModal";
import ResultsReview from "./ResultsTable";

function ExamPage({ selectedClass, selectedSubjects, onBack }) {
  // --- STATE ---
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
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);
  const [subjectResults, setSubjectResults] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningColor, setWarningColor] = useState("yellow");

  const [hasShown2Min, setHasShown2Min] = useState(false);
  const [hasShown1Min, setHasShown1Min] = useState(false);

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

  // Save timeLeft per subject
  useEffect(() => {
    if (currentSubject) {
      localStorage.setItem(`exam_timeLeft_${currentSubject}`, timeLeft);
    }
  }, [timeLeft, currentSubject]);

  // --- LOAD QUESTIONS & TIMER ---
  useEffect(() => {
    const allQs = QUESTIONS[selectedClass]?.[currentSubject] || [];
    const savedQ = localStorage.getItem(`exam_questions_${currentSubject}`);
    const savedD = localStorage.getItem(`exam_displayed_${currentSubject}`);
    const savedTime = localStorage.getItem(`exam_timeLeft_${currentSubject}`);

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

    // Restore saved time or start fresh
    const initialTime = savedTime ? Number(savedTime) : 600;
    setTimeLeft(initialTime > 0 ? initialTime : 600);

    // Reset warning flags
    setHasShown2Min(false);
    setHasShown1Min(false);
  }, [currentSubject, selectedClass]);

  // --- SAVE TIMER PER SUBJECT ---
  useEffect(() => {
    if (currentSubject) {
      localStorage.setItem(`exam_timeLeft_${currentSubject}`, timeLeft);
    }
  }, [timeLeft, currentSubject]);

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
    if (timeLeft <= 120 && timeLeft > 60 && !hasShown2Min) {
      setWarningMessage("2 minutes remaining!");
      setWarningColor("yellow");
      setShowWarning(true);
      setHasShown2Min(true);
      playBeep(600, 400);
    } else if (timeLeft <= 60 && timeLeft > 0 && !hasShown1Min) {
      setWarningMessage("1 minute left! Submit now!");
      setWarningColor("red");
      setShowWarning(true);
      setHasShown1Min(true);
      playBeep(1000, 600);
    } else if (timeLeft <= 0) {
      setShowWarning(false);
    }
  }, [timeLeft, hasShown2Min, hasShown1Min]);

  // --- BEEP SOUND ---
  const playBeep = (freq = 800, duration = 300) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = freq;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + duration / 1000
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration / 1000);
  };

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

    // ✅ DO NOT DELETE exam_displayed and exam_answers yet!
    // They are needed for ResultsReview component

    // Only remove timer data and navigation state
    selectedSubjects.forEach((sub) => {
      localStorage.removeItem(`exam_questions_${sub}`);
      localStorage.removeItem(`exam_timeLeft_${sub}`);
    });

    // Remove navigation state only
    localStorage.removeItem("exam_currentSubjectIndex");
    localStorage.removeItem("exam_currentQuestionIndex");
  };

  // ✅ NEW: Cleanup function when user goes back from results
  const handleBackFromResults = () => {
    // NOW we can safely delete the exam data
    selectedSubjects.forEach((sub) => {
      localStorage.removeItem(`exam_displayed_${sub}`);
    });
    localStorage.removeItem("exam_answers");

    // Call the original onBack
    onBack();
  };

  if (submitted) {
    return (
      <ResultsReview
        results={subjectResults}
        selectedClass={selectedClass}
        selectedSubjects={selectedSubjects}
        onBack={handleBackFromResults}
      />
    );
  }

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

      <ExamHeader subject={currentSubject} timeLeft={timeLeft} />

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
