import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay, year, month };
  };

  const getAttendanceStatus = (day) => {
    // Mock attendance data - replace with real API call
    const mockAttendance = {
      2: 'present', 3: 'present', 4: 'present', 5: 'present',
      6: 'leave', 9: 'present', 10: 'present', 11: 'present',
      12: 'present', 13: 'absent', 16: 'present', 17: 'present',
      18: 'present', 19: 'present', 20: 'leave', 23: 'present',
      24: 'present', 25: 'leave', 26: 'leave', 27: 'today'
    };
    
    return mockAttendance[day] || 'none';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-200 text-green-800';
      case 'absent':
        return 'bg-red-200 text-red-800';
      case 'leave':
        return 'bg-yellow-200 text-yellow-800';
      case 'today':
        return 'bg-blue-500 text-white';
      default:
        return 'text-gray-400';
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDay, year, month } = getDaysInMonth(currentDate);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getAttendanceStatus(day);
      const isToday = day === new Date().getDate() && 
                     month === new Date().getMonth() && 
                     year === new Date().getFullYear();
      
      days.push(
        <div
          key={day}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors ${
            status === 'today' ? 'bg-blue-500 text-white' : 
            status !== 'none' ? getStatusColor(status) : 'text-gray-900'
          }`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Calendar</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <FaChevronLeft size={16} className="text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <FaChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 uppercase">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <span className="text-gray-600">Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <span className="text-gray-600">Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
          <span className="text-gray-600">Leave</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
}
