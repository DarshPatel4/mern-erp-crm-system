import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getPayroll } from '../../services/employeePortal';

export default function Payroll() {
  const { employeeId } = useOutletContext();
  const [payroll, setPayroll] = useState([]);

  const loadPayroll = useCallback(async () => {
    if (!employeeId) return;
    try {
      const data = await getPayroll(employeeId);
      setPayroll(data);
    } catch (error) {
      console.error('Failed to load payroll data', error);
    }
  }, [employeeId]);

  useEffect(() => {
    loadPayroll();
  }, [loadPayroll]);

  const latestPayroll = payroll[0];

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900">Payroll Overview</h2>
        <p className="text-sm text-gray-600">Review your salary breakdown and past payslips.</p>
      </div>

      {latestPayroll && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-gray-500">Net Salary</div>
            <div className="text-2xl font-semibold text-gray-900">{formatCurrency(latestPayroll.netSalary)}</div>
            <div className="text-xs text-gray-500">{latestPayroll.monthName} {latestPayroll.year}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-gray-500">Gross Salary</div>
            <div className="text-2xl font-semibold text-gray-900">{formatCurrency(latestPayroll.grossSalary)}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-gray-500">Deductions</div>
            <div className="text-2xl font-semibold text-gray-900">{formatCurrency(latestPayroll.totalDeductions)}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="text-sm text-gray-500">Bonus</div>
            <div className="text-2xl font-semibold text-gray-900">{formatCurrency(latestPayroll.performanceBonus || 0)}</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payroll.map((entry) => (
                <tr key={entry._id}>
                  <td className="px-6 py-4 text-sm text-gray-600">{entry.monthName} {entry.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(entry.grossSalary)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(entry.totalDeductions)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{formatCurrency(entry.netSalary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {payroll.length === 0 && (
          <div className="p-6 text-sm text-gray-500 text-center">No payroll records available.</div>
        )}
      </div>
    </div>
  );
}
