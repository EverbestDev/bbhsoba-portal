import React, { useState, useEffect } from "react";
import LoginPage from "./Components/LoginPage";
import ClassSelection from "./Components/ClassSelection";
import SubjectSelection from "./Components/SubjectSelection";
import ExamPage from "./Components/ExamPage/index.jsx";
import Sidebar from "./Components/Sidebar";

export default function App() {
  const [loading, setLoading] = useState(true);
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
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const showBack = currentStep === "subject" || currentStep === "class";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600 absolute top-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar*/}
      {isLoggedIn && (
        <Sidebar
          onLogout={handleLogout}
          showBack={showBack}
          onBack={() => {
            if (currentStep === "exam") {
              setSelectedSubjects([]);
              setCurrentStep("subject");
            } else if (currentStep === "subject") {
              setSelectedClass(null);
              setCurrentStep("class");
            }
          }}
          currentStep={currentStep}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8">
          {!isLoggedIn ? (
            <LoginPage
              onLogin={() => {
                setIsLoggedIn(true);
                setCurrentStep("class");
              }}
            />
          ) : !selectedClass ? (
            <ClassSelection
              onSelectClass={(cls) => {
                setSelectedClass(cls);
                setCurrentStep("subject");
              }}
            />
          ) : selectedSubjects.length === 0 ? (
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
          ) : (
            <ExamPage
              selectedClass={selectedClass}
              selectedSubjects={selectedSubjects}
              onBack={() => {
                setSelectedSubjects([]);
                setCurrentStep("subject");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
