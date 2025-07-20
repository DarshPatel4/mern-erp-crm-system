import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import KPICards from './components/KPICards';
import PerformanceChart from './components/PerformanceChart';
import QuickNotifications from './components/QuickNotifications';
import SalesPipeline from './components/SalesPipeline';
import UpcomingTasks from './components/UpcomingTasks';
import QuickActions from './components/QuickActions';

export default function AdminDashboard() {
  return (
    <div className="flex bg-gray-50 min-h-screen h-screen">
      <div className="sticky top-0 left-0 h-screen z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-screen h-screen">
        <div className="sticky top-0 z-20">
          <Header />
        </div>
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
          <WelcomeBanner />
          <KPICards />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <PerformanceChart />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-0">
                <SalesPipeline />
                <UpcomingTasks />
              </div>
            </div>
            <div>
              <QuickNotifications />
              <QuickActions />
            </div>
          </div>
          {/* More widgets and admin controls will go here */}
        </main>
      </div>
    </div>
  );
} 