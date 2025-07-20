import { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '../../../services/dashboard';

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary().then(res => {
      setTasks(res.upcomingTasks);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="bg-white rounded-2xl p-6 shadow mb-8 animate-pulse h-44" />;
  }

  const priorityColor = {
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-gray-800">Upcoming Tasks</div>
        <a href="#" className="text-xs text-violet-600 font-semibold hover:underline">View All</a>
      </div>
      <div className="flex flex-col gap-3 mb-4">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
            <input type="checkbox" className="accent-violet-500" />
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-800">{task.title}</div>
              <div className="text-xs text-gray-500">{task.due}</div>
            </div>
            <div className={`px-2 py-0.5 rounded text-xs font-semibold ${priorityColor[task.priority]}`}>{task.priority}</div>
          </div>
        ))}
      </div>
      <button className="w-full py-2 rounded-lg bg-violet-50 text-violet-700 font-semibold mt-2 hover:bg-violet-100">+ Add New Task</button>
    </div>
  );
} 