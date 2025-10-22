import { FaUsers, FaUserFriends, FaTasks, FaFileInvoice, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function SummaryCards({ data }) {
  const cards = [
    {
      title: 'Total Clients',
      value: data?.totalClients || 0,
      change: data?.clientsChange || 0,
      icon: <FaUsers className="text-blue-600" />,
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Total Employees',
      value: data?.totalEmployees || 0,
      change: data?.employeesChange || 0,
      icon: <FaUsers className="text-green-600" />,
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Active Leads',
      value: data?.activeLeads || 0,
      change: data?.leadsChange || 0,
      icon: <FaUserFriends className="text-purple-600" />,
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Open Tasks',
      value: data?.openTasks || 0,
      change: data?.tasksChange || 0,
      icon: <FaTasks className="text-orange-600" />,
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Pending Invoices',
      value: data?.pendingInvoices || 0,
      change: data?.invoicesChange || 0,
      icon: <FaFileInvoice className="text-red-600" />,
      bgGradient: 'from-red-50 to-red-100',
      iconBg: 'bg-red-100',
      subtitle: data?.overduePercentage ? `${data.overduePercentage}% overdue` : null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.iconBg}`}>
              {card.icon}
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              card.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {card.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(card.change)}%
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
            {card.subtitle && (
              <p className="text-xs text-red-600 font-medium">{card.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
