// src/pages/TestPersonalAnalytics.tsx
import React from "react";
import PerformanceAnalytics from "../components/personal/PerformanceAnalytics";
import PersonalInsights from "../components/personal/PersonalInsights";
import { useAuth } from "../contexts/AuthContext";

const TestPersonalAnalytics = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-white p-8">Please log in to view analytics</div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8 space-y-8">
      <h1 className="text-white text-2xl font-bold">
        Testing Personal Analytics
      </h1>

      <PerformanceAnalytics userId={user.id} />

      <PersonalInsights userId={user.id} />
    </div>
  );
};

export default TestPersonalAnalytics;
