import { useState } from 'react';
import Sidebar from '../admin/components/Sidebar';
import Header from '../admin/components/Header';
import HRStats from './components/HRStats';
import EmployeeDirectoryTable from './components/EmployeeDirectoryTable';
import AttendanceCalendar from './components/AttendanceCalendar';
import LeaveManagement from './components/LeaveManagement';
import RecruitmentStatus from './components/RecruitmentStatus';
import DepartmentsDesignations from './components/DepartmentsDesignations';

const tabs = [
  { label: 'Employee Directory', value: 'directory' },
  { label: 'Attendance', value: 'attendance' },
  { label: 'Leave Tracker', value: 'leave' },
  { label: 'Recruitment', value: 'recruitment' },
  { label: 'Departments', value: 'departments' },
];

export default function HRDashboard() {
  const [tab, setTab] = useState('directory');

  return (
    <div className="flex bg-gray-50 min-h-screen h-screen">
      <div className="sticky top-0 left-0 h-screen z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-screen h-screen">
        <div className="sticky top-0 z-20">
          <Header />
        </div>
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="text-2xl font-bold text-gray-800 mb-2">Employee Management</div>
          <div className="text-gray-500 mb-6">Manage your organization’s workforce</div>
          <HRStats />
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map(t => (
              <button
                key={t.value}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === t.value ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-violet-50'}`}
                onClick={() => setTab(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow p-6 min-h-[400px]">
            {tab === 'directory' && <EmployeeDirectoryTable />}
            {tab === 'attendance' && <AttendanceCalendar />}
            {tab === 'leave' && <LeaveManagement />}
            {tab === 'recruitment' && <RecruitmentStatus />}
            {tab === 'departments' && <DepartmentsDesignations />}
          </div>
        </main>
      </div>
    </div>
  );
}
