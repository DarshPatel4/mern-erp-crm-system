const candidates = [
  { name: 'Priya Patel', position: 'Software Engineer', status: 'In Process', applied: '2023-07-10' },
  { name: 'Rahul Mehta', position: 'Product Manager', status: 'Hired', applied: '2023-06-22' },
  { name: 'Sneha Shah', position: 'HR Executive', status: 'Rejected', applied: '2023-07-01' },
  { name: 'Amit Kumar', position: 'Sales Associate', status: 'In Process', applied: '2023-07-12' },
];

const statusColor = {
  'In Process': 'bg-yellow-100 text-yellow-700',
  'Hired': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-700',
};

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
}

export default function RecruitmentStatus() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-gray-800">Recruitment / Onboarding</div>
        <button className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold text-sm">+ Add Candidate</button>
      </div>
      <div className="flex flex-col gap-3">
        {candidates.map((c, i) => (
          <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white" style={{background: '#f3f4f6', color: '#6366f1'}}>{getInitials(c.name)}</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{c.name}</div>
              <div className="text-xs text-gray-500">{c.position}</div>
              <div className="text-xs text-gray-400">Applied: {new Date(c.applied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[c.status]}`}>{c.status}</div>
            <button className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200">View</button>
          </div>
        ))}
      </div>
    </div>
  );
} 