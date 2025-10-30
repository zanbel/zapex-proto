import { Play, Calendar, Trophy, Flame, Target, Activity, ChevronRight, TrendingUp, Dumbbell, User } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface HomeScreenProps {
  onNavigate: (screen: 'workout-selection' | 'profile') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function HomeScreen({ onNavigate, isDarkMode, onToggleDarkMode }: HomeScreenProps) {
  const todayStats = {
    streak: 5,
    weeklyGoal: 4,
    completed: 2,
    calories: 340,
  };

  // Calculate last 7 days for workout tracking
  const weekDays = [
    { day: 'Wed', date: 22, workedOut: false },
    { day: 'Thu', date: 23, workedOut: true },
    { day: 'Fri', date: 24, workedOut: false },
    { day: 'Sat', date: 25, workedOut: false },
    { day: 'Sun', date: 26, workedOut: true },
    { day: 'Mon', date: 27, workedOut: false },
    { day: 'Tue', date: 28, workedOut: false },
  ];

  const upcomingWorkouts = [
    { name: 'Upper Body Power', exercises: 8, duration: '45 min', scheduled: 'Today' },
    { name: 'Leg Day', exercises: 6, duration: '50 min', scheduled: 'Tomorrow' },
  ];

  const recentActivity = [
    { name: 'Full Body Strength', date: '2 days ago', exercises: 10, sets: 28, volume: 1250 },
    { name: 'Cardio Blast', date: '4 days ago', exercises: 6, sets: 18, volume: 850 },
  ];

  return (
    <div 
      className="min-h-screen pb-32"
      style={{ 
        backgroundColor: 'var(--workout-bg-primary)',
        color: 'var(--workout-text-primary)'
      }}
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ color: 'var(--workout-text-muted)' }} className="mb-1">Welcome back,</p>
            <h1 style={{ color: 'var(--workout-text-primary)' }}>Let's Get Moving</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Profile Button */}

          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mb-6">
          <div 
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--workout-bg-elevated)', border: '1px solid var(--workout-border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm mb-1" style={{ color: 'var(--workout-text-primary)' }}>Weekly Goal Progress</h3>
                <p className="text-xs" style={{ color: 'var(--workout-text-muted)' }}>2 of 4 workouts completed</p>
              </div>
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}
              >
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="space-y-3">
              <Progress 
                value={50} 
                className="h-2"
                style={{ backgroundColor: 'var(--workout-bg-secondary)' }}
              />
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  {weekDays.map((dayInfo, index) => (
                    <div
                      key={index}
                      className="flex-1 h-1.5 rounded-full"
                      style={{ 
                        backgroundColor: dayInfo.workedOut ? 'var(--workout-accent-primary)' : 'var(--workout-bg-secondary)'
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {weekDays.map((dayInfo, index) => (
                    <div key={index} className="flex-1 text-center">
                      <div className="text-[10px]" style={{ color: 'var(--workout-text-muted)' }}>
                        {dayInfo.day}
                      </div>
                      <div className="text-[9px]" style={{ color: 'var(--workout-text-muted)' }}>
                        {dayInfo.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Workout CTA */}
        <button
          onClick={() => onNavigate('workout-selection')}
          className="w-full rounded-2xl p-5 flex items-center justify-between transition-all"
          style={{ 
            backgroundColor: 'var(--workout-accent-primary)',
            color: 'var(--workout-text-primary)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-accent-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-accent-primary)'}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <Play className="w-6 h-6 fill-white" />
            </div>
            <div className="text-left">
              <div className="text-sm opacity-90">Ready to train?</div>
              <div>Start Workout</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Upcoming Workouts */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm" style={{ color: 'var(--workout-text-secondary)' }}>Upcoming Workouts</h2>
          <Button 
            variant="ghost" 
            className="h-auto p-0 text-sm hover:bg-transparent" 
            style={{ color: 'var(--workout-accent-primary)' }}
          >
            View All
          </Button>
        </div>
        <div className="space-y-2.5">
          {upcomingWorkouts.map((workout, i) => (
            <div
              key={i}
              className="rounded-xl p-4 transition-all cursor-pointer"
              style={{ 
                backgroundColor: 'var(--workout-bg-secondary)', 
                border: '1px solid var(--workout-border)' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--workout-accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--workout-border)'}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm mb-1" style={{ color: 'var(--workout-text-primary)' }}>{workout.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--workout-text-muted)' }}>{workout.scheduled}</p>
                </div>
                <div 
                  className="px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: 'rgba(103, 195, 195, 0.12)' }}
                >
                  <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--workout-accent-primary)' }} />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--workout-text-muted)' }}>
                <span>{workout.exercises} exercises</span>
                <span>•</span>
                <span>{workout.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-5 mb-32">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm" style={{ color: 'var(--workout-text-secondary)' }}>Recent Activity</h2>
        </div>
        <div className="space-y-2.5">
          {recentActivity.map((activity, i) => (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: 'var(--workout-bg-secondary)', 
                border: '1px solid var(--workout-border)' 
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-sm mb-1" style={{ color: 'var(--workout-text-primary)' }}>{activity.name}</div>
                  <div className="text-xs" style={{ color: 'var(--workout-text-muted)' }}>{activity.date}</div>
                </div>
                <div 
                  className="px-2 py-0.5 rounded-md text-xs"
                  style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}
                >
                  Completed
                </div>
              </div>
              <div className="flex items-center gap-5 text-xs">
                <div className="flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5" style={{ color: 'var(--workout-text-muted)' }} />
                  <span style={{ color: 'var(--workout-text-secondary)' }}>{activity.exercises} exercises</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" style={{ color: 'var(--workout-text-muted)' }} />
                  <span style={{ color: 'var(--workout-text-secondary)' }}>{activity.sets} sets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--workout-text-muted)' }} />
                  <span style={{ color: 'var(--workout-text-secondary)' }}>{activity.volume}kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div 
        className="fixed bottom-0 left-0 right-0"
        style={{ 
          backgroundColor: 'var(--workout-bg-secondary)', 
          borderTop: '1px solid var(--workout-border)' 
        }}
      >
        <div className="max-w-md mx-auto px-5 py-4">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1.5" style={{ color: 'var(--workout-accent-primary)' }}>
              <div className="w-9 h-9 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => onNavigate('workout-selection')}
              className="relative -mt-7"
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundColor: 'var(--workout-accent-primary)',
                  boxShadow: '0 8px 16px rgba(103, 195, 195, 0.25)'
                }}
              >
                <Play className="w-6 h-6 fill-white" />
              </div>
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className="flex flex-col items-center gap-1.5" 
              style={{ color: 'var(--workout-text-muted)' }}
            >
              <div className="w-9 h-9 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}