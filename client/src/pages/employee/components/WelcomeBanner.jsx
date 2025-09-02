import { useState, useEffect } from 'react';

export default function WelcomeBanner({ user }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-blue-100 text-lg">
            Welcome to your Employee Dashboard
          </p>
        </div>
        
        <div className="text-center lg:text-right">
          <div className="text-4xl lg:text-5xl font-mono font-bold mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-blue-100 text-sm">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
