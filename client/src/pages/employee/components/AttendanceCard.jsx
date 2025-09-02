import { FaPlay, FaStop, FaClock, FaCheckCircle } from 'react-icons/fa';

export default function AttendanceCard({ attendanceData, onCheckIn, onCheckOut }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Working': return 'text-green-600';
      case 'Completed': return 'text-blue-600';
      case 'Not Started': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Working': return <FaCheckCircle className="text-green-600" />;
      case 'Completed': return <FaCheckCircle className="text-blue-600" />;
      case 'Not Started': return <FaClock className="text-gray-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Today's Attendance</h2>
        <div className="text-4xl font-mono font-bold text-blue-600">
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Check In Button */}
        <div className="text-center">
          <button
            onClick={onCheckIn}
            disabled={attendanceData.isCheckedIn}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              attendanceData.isCheckedIn
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FaPlay size={16} />
              <span>Check In</span>
            </div>
          </button>
          {attendanceData.lastCheckIn && (
            <p className="text-xs text-gray-600 mt-2">
              Last check-in: {attendanceData.lastCheckIn}
            </p>
          )}
        </div>

        {/* Check Out Button */}
        <div className="text-center">
          <button
            onClick={onCheckOut}
            disabled={!attendanceData.isCheckedIn}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              !attendanceData.isCheckedIn
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FaStop size={16} />
              <span>Check Out</span>
            </div>
          </button>
          <p className="text-xs text-gray-600 mt-2">
            Working hours: {attendanceData.workingHours}
          </p>
        </div>

        {/* Start Break Button */}
        <div className="text-center">
          <button
            disabled={!attendanceData.isCheckedIn}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              !attendanceData.isCheckedIn
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FaClock size={16} />
              <span>Start Break</span>
            </div>
          </button>
          <p className="text-xs text-gray-600 mt-2">
            Break time available
          </p>
        </div>
      </div>

      {/* Status Display */}
      <div className="flex items-center justify-center space-x-2 text-sm">
        <span>Status:</span>
        <div className="flex items-center space-x-2">
          {getStatusIcon(attendanceData.status)}
          <span className={`font-medium ${getStatusColor(attendanceData.status)}`}>
            {attendanceData.status}
          </span>
        </div>
      </div>
    </div>
  );
}
