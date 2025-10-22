import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../admin/components/Sidebar';
import Header from '../admin/components/Header';
import AnalyticsContent from './components/AnalyticsContent';

export default function AnalyticsDashboard() {
  return (
    <div className="flex bg-gray-50 min-h-screen h-screen">
      <div className="sticky top-0 left-0 h-screen z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-screen h-screen">
        <div className="sticky top-0 z-20">
          <Header />
        </div>
        <AnalyticsContent />
      </div>
    </div>
  );
}
