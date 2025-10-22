import { FaUser, FaTrophy, FaCheckCircle } from 'react-icons/fa';

export default function TopPerformers({ data }) {
  const performers = data || [];

  return (
    <div className="space-y-4">
      {performers.length > 0 ? (
        performers.map((performer, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  {performer.name}
                  {index < 3 && <FaTrophy className="text-yellow-500" />}
                </div>
                <div className="text-sm text-gray-600">{performer.role}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 flex items-center gap-1">
                <FaCheckCircle className="text-green-600" />
                {performer.completionRate}%
              </div>
              <div className="text-xs text-gray-500">{performer.completedTasks} tasks completed</div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No performance data available</div>
          <div className="text-sm">Top performers will appear here once tasks are completed</div>
        </div>
      )}
    </div>
  );
}
