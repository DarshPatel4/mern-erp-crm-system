import { useState } from 'react';
import { FaTimes, FaDownload, FaInfoCircle } from 'react-icons/fa';

export default function PayrollModal({ onClose }) {
  const [selectedMonth, setSelectedMonth] = useState('December 2024');

  // Mock payroll data - replace with real API call
  const payrollData = {
    'December 2024': {
      grossSalary: 5500,
      netSalary: 4620,
      breakdown: {
        basicSalary: 4000,
        houseAllowance: 800,
        transportAllowance: 300,
        performanceBonus: 400
      },
      deductions: {
        incomeTax: 550,
        socialSecurity: 220,
        healthInsurance: 110
      }
    },
    'November 2024': {
      grossSalary: 5500,
      netSalary: 4620,
      breakdown: {
        basicSalary: 4000,
        houseAllowance: 800,
        transportAllowance: 300,
        performanceBonus: 400
      },
      deductions: {
        incomeTax: 550,
        socialSecurity: 220,
        healthInsurance: 110
      }
    },
    'October 2024': {
      grossSalary: 5500,
      netSalary: 4620,
      breakdown: {
        basicSalary: 4000,
        houseAllowance: 800,
        transportAllowance: 300,
        performanceBonus: 400
      },
      deductions: {
        incomeTax: 550,
        socialSecurity: 220,
        healthInsurance: 110
      }
    }
  };

  const months = Object.keys(payrollData);
  const currentData = payrollData[selectedMonth];

  const handleDownloadPayslip = (month) => {
    // TODO: API call to download payslip
    console.log(`Downloading payslip for ${month}`);
    alert(`Downloading payslip for ${month}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payroll & Salary</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Payroll Content */}
        <div className="p-6 space-y-6">
          {/* Month Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Select Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {/* Summary Card */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-4">{selectedMonth}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-green-600 mb-1">Gross Salary</div>
                  <div className="text-2xl font-bold text-green-800">${currentData.grossSalary.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-green-600 mb-1">Net Salary</div>
                  <div className="text-2xl font-bold text-green-800">${currentData.netSalary.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Breakdown and Deductions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Salary Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Salary Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(currentData.breakdown).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ${value.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-900">Gross Total</span>
                    <span className="text-gray-900">${currentData.grossSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Deductions</h4>
              <div className="space-y-3">
                {Object.entries(currentData.deductions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      -${value.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-900">Total Deductions</span>
                    <span className="text-red-600">
                      -${Object.values(currentData.deductions).reduce((a, b) => a + b, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Net Salary</span>
              <span className="text-2xl font-bold text-green-600">
                ${currentData.netSalary.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Recent Payslips */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Payslips</h4>
            <div className="space-y-3">
              {months.map(month => (
                <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{month}</div>
                    <div className="text-sm text-gray-600">
                      Net: ${payrollData[month].netSalary.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadPayslip(month)}
                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download Payslip"
                  >
                    <FaDownload size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tax Information (YTD)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-blue-600 mb-1">Total Gross Income</div>
                <div className="text-lg font-semibold text-gray-900">$66,000</div>
              </div>
              <div>
                <div className="text-sm text-blue-600 mb-1">Total Tax Paid</div>
                <div className="text-lg font-semibold text-gray-900">$6,600</div>
              </div>
              <div>
                <div className="text-sm text-blue-600 mb-1">Tax Rate</div>
                <div className="text-lg font-semibold text-gray-900">10%</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleDownloadPayslip(selectedMonth)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FaDownload size={16} />
              <span>Download Current Payslip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
