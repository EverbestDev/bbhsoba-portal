import React, { useState, useEffect } from "react";
import LoginPage from "./Components/LoginPage";
import ClassSelection from "./Components/ClassSelection";
import SubjectSelection from "./Components/SubjectSelection";
import ExamPage from "./Components/ExamPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => JSON.parse(localStorage.getItem("isLoggedIn")) || false
  );
  const [selectedClass, setSelectedClass] = useState(
    () => localStorage.getItem("selectedClass") || null
  );
  const [selectedSubjects, setSelectedSubjects] = useState(
    () => JSON.parse(localStorage.getItem("selectedSubjects")) || []
  );
  const [currentStep, setCurrentStep] = useState(
    () => localStorage.getItem("currentStep") || "login"
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedClass) localStorage.setItem("selectedClass", selectedClass);
    else localStorage.removeItem("selectedClass");
  }, [selectedClass]);

  useEffect(() => {
    localStorage.setItem("selectedSubjects", JSON.stringify(selectedSubjects));
  }, [selectedSubjects]);

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);

  if (!isLoggedIn) {
    if (currentStep !== "login") setCurrentStep("login");
    return (
      <LoginPage
        onLogin={() => {
          setIsLoggedIn(true);
          setCurrentStep("class");
        }}
      />
    );
  }

  if (!selectedClass) {
    if (currentStep !== "class") setCurrentStep("class");
    return (
      <ClassSelection
        onSelectClass={(cls) => {
          setSelectedClass(cls);
          setCurrentStep("subject");
        }}
      />
    );
  }

  if (selectedSubjects.length === 0) {
    if (currentStep !== "subject") setCurrentStep("subject");
    return (
      <SubjectSelection
        selectedClass={selectedClass}
        onBack={() => {
          setSelectedClass(null);
          setCurrentStep("class");
        }}
        onStartExam={(subs) => {
          setSelectedSubjects(subs);
          setCurrentStep("exam");
        }}
      />
    );
  }

  if (currentStep !== "exam") setCurrentStep("exam");
  return (
    <ExamPage
      selectedSubjects={selectedSubjects}
      onBack={() => {
        setSelectedSubjects([]);
        setCurrentStep("subject");
      }}
    />
  );
}
