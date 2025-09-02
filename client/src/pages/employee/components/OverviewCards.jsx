import { FaClock, FaCheckSquare, FaStar, FaCalendar } from 'react-icons/fa';

export default function OverviewCards({ dashboardData }) {
  const cards = [
    {
      title: 'Attendance Rate',
      value: `${dashboardData.attendanceRate}%`,
      period: 'This month',
      icon: FaClock,
      gradient: 'from-pink-500 to-purple-600',
      iconColor: 'text-pink-100'
    },
    {
      title: 'Tasks Completed',
      value: `${dashboardData.tasksCompleted.completed}/${dashboardData.tasksCompleted.total}`,
      period: 'This week',
      icon: FaCheckSquare,
      gradient: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-100'
    },
    {
      title: 'Performance',
      value: `${dashboardData.performance}/5`,
      period: 'Last review',
      icon: FaStar,
      gradient: 'from-green-500 to-emerald-500',
      iconColor: 'text-green-100'
    },
    {
      title: 'Leave Balance',
      value: `${dashboardData.leaveBalance} Days`,
      period: 'Remaining',
      icon: FaCalendar,
      gradient: 'from-orange-500 to-yellow-500',
      iconColor: 'text-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center ${card.iconColor}`}>
                <Icon size={24} />
              </div>
            </div>
            
            <div className="mb-2">
              <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
              <div className="text-3xl font-bold">{card.value}</div>
            </div>
            
            <div className="text-sm opacity-90">{card.period}</div>
          </div>
        );
      })}
    </div>
  );
}
