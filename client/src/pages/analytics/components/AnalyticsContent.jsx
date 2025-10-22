import { useState, useEffect } from 'react';
import { FaDownload, FaSync, FaFilter, FaChartLine, FaUsers, FaTasks, FaFileInvoice, FaUserFriends } from 'react-icons/fa';
import SummaryCards from './SummaryCards';
import RevenueChart from './RevenueChart';
import LeadConversionFunnel from './LeadConversionFunnel';
import EmployeePerformanceChart from './EmployeePerformanceChart';
import TaskStatusChart from './TaskStatusChart';
import LeadDistributionChart from './LeadDistributionChart';
import TopClients from './TopClients';
import TopPerformers from './TopPerformers';
import { getAnalyticsData } from '../../../services/analyticsService';

export default function AnalyticsContent() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('30days');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await getAnalyticsData(filter);
      setAnalyticsData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [filter]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchAnalyticsData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, filter]);

  const handleExport = async (format) => {
    try {
      const response = await fetch(`/api/analytics/export?format=${format}&filter=${filter}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  if (loading && !analyticsData) {
    return (
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">This Year</option>
            </select>
          </div>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaSync className={autoRefresh ? 'animate-spin' : ''} />
            Live Data
          </button>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <FaDownload />
              PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaDownload />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mb-6 text-sm text-gray-500">
        Last updated: {lastUpdated.toLocaleString()}
        {autoRefresh && <span className="ml-2 text-green-600">• Auto-refresh enabled</span>}
      </div>

      {/* Summary Cards */}
      {analyticsData && <SummaryCards data={analyticsData.summary} />}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaChartLine className="text-violet-600" />
              Revenue Trend
            </h3>
          </div>
          {analyticsData && <RevenueChart data={analyticsData.revenue} />}
        </div>

        {/* Lead Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaUserFriends className="text-blue-600" />
              Lead Conversion Funnel
            </h3>
          </div>
          {analyticsData && <LeadConversionFunnel data={analyticsData.leads} />}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Employee Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaUsers className="text-green-600" />
              Employee Performance
            </h3>
          </div>
          {analyticsData && <EmployeePerformanceChart data={analyticsData.employeePerformance} />}
        </div>

        {/* Task Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaTasks className="text-orange-600" />
              Task Status Overview
            </h3>
          </div>
          {analyticsData && <TaskStatusChart data={analyticsData.tasks} />}
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Lead Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaUserFriends className="text-purple-600" />
              Lead Distribution by Region
            </h3>
          </div>
          {analyticsData && <LeadDistributionChart data={analyticsData.leadDistribution} />}
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaFileInvoice className="text-indigo-600" />
              Top 5 Clients by Revenue
            </h3>
          </div>
          {analyticsData && <TopClients data={analyticsData.topClients} />}
        </div>
      </div>

      {/* Fourth Row */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaUsers className="text-emerald-600" />
              Top Performers by Task Completion
            </h3>
          </div>
          {analyticsData && <TopPerformers data={analyticsData.topPerformers} />}
        </div>
      </div>
    </main>
  );
}
