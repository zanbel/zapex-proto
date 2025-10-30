import { ArrowLeft, Zap, BookOpen, RotateCcw, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface WorkoutSelectionScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  isDarkMode: boolean;
}

export function WorkoutSelectionScreen({ onBack, onNavigate, isDarkMode }: WorkoutSelectionScreenProps) {
  const mainActions = [
    {
      id: 'quick-start',
      title: 'Quick Start',
      subtitle: 'Build a custom workout from scratch',
      icon: Zap,
      bgColor: 'var(--workout-accent-primary)',
      iconBg: 'rgba(255, 255, 255, 0.15)',
      size: 'large' as const,
    },
    {
      id: 'templates',
      title: 'From Template',
      subtitle: 'Pre-built workout plans',
      icon: BookOpen,
      bgColor: 'var(--workout-accent-tertiary)',
      iconBg: 'rgba(255, 255, 255, 0.15)',
      size: 'medium' as const,
    },
    {
      id: 'history',
      title: 'Repeat Workout',
      subtitle: 'From your history',
      icon: RotateCcw,
      bgColor: 'var(--workout-accent-secondary)',
      iconBg: 'rgba(255, 255, 255, 0.15)',
      size: 'medium' as const,
    },
  ];

  const popularTemplates = [
    { name: 'Push Day', exercises: 8, time: '45 min', uses: 124 },
    { name: 'Pull Day', exercises: 7, time: '40 min', uses: 98 },
    { name: 'Leg Destroyer', exercises: 10, time: '60 min', uses: 87 },
  ];

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: 'var(--workout-bg-primary)',
        color: 'var(--workout-text-primary)'
      }}
    >
      {/* Header */}
      <div 
        className="px-5 pt-12 pb-6"
        style={{ 
          background: 'linear-gradient(to bottom, var(--workout-bg-secondary), var(--workout-bg-primary))',
          borderBottom: '1px solid var(--workout-border)'
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full transition-colors flex items-center justify-center"
            style={{ backgroundColor: 'var(--workout-bg-elevated)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-bg-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 style={{ color: 'var(--workout-text-primary)' }}>Start Training</h1>
            <p className="text-sm" style={{ color: 'var(--workout-text-muted)' }}>Choose how you want to begin</p>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-5 py-6 space-y-3">
        {mainActions.map((action) => {
          const Icon = action.icon;
          
          if (action.size === 'large') {
            return (
              <button
                key={action.id}
                onClick={() => action.id === 'quick-start' && onNavigate('quick-start')}
                className="w-full rounded-2xl p-5 text-left transition-transform hover:scale-[1.01] relative overflow-hidden group"
                style={{ backgroundColor: action.bgColor }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <div className="relative flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: action.iconBg }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3>{action.title}</h3>
                    <p className="text-sm opacity-90 mt-0.5">{action.subtitle}</p>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          }

          return (
            <button
              key={action.id}
              className="w-full rounded-xl p-4 text-left transition-transform hover:scale-[1.01] relative overflow-hidden group"
              style={{ backgroundColor: action.bgColor }}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <div className="relative flex items-center gap-3">
                <div 
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: action.iconBg }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm">{action.title}</div>
                  <div className="text-xs opacity-80 mt-0.5">{action.subtitle}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Popular Templates Preview */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm" style={{ color: 'var(--workout-text-secondary)' }}>Popular Templates</h2>
          <Button 
            variant="ghost" 
            className="h-auto p-0 text-sm hover:bg-transparent" 
            style={{ color: 'var(--workout-accent-primary)' }}
          >
            See All
          </Button>
        </div>
        <div className="grid gap-2.5">
          {popularTemplates.map((template, i) => (
            <div
              key={i}
              className="rounded-xl p-4 transition-all cursor-pointer"
              style={{ 
                backgroundColor: 'var(--workout-bg-elevated)', 
                border: '1px solid var(--workout-border)' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--workout-accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--workout-border)'}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm mb-2" style={{ color: 'var(--workout-text-primary)' }}>{template.name}</h3>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--workout-text-muted)' }}>
                    <span>{template.exercises} exercises</span>
                    <span>•</span>
                    <span>{template.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs" style={{ color: 'var(--workout-text-muted)' }}>{template.uses} uses</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="px-5 py-4 pb-8">
        <h2 className="text-sm mb-3" style={{ color: 'var(--workout-text-secondary)' }}>Recent Workouts</h2>
        <div className="space-y-2">
          {[
            { name: 'Upper Body Blast', date: 'Oct 25', sets: 24 },
            { name: 'Leg Day', date: 'Oct 23', sets: 32 },
            { name: 'Full Body', date: 'Oct 21', sets: 28 },
          ].map((workout, i) => (
            <button
              key={i}
              className="w-full rounded-lg p-3.5 text-left transition-all flex items-center justify-between"
              style={{ 
                backgroundColor: 'var(--workout-bg-secondary)', 
                border: '1px solid var(--workout-border)' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)';
                e.currentTarget.style.borderColor = 'var(--workout-accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--workout-bg-secondary)';
                e.currentTarget.style.borderColor = 'var(--workout-border)';
              }}
            >
              <div>
                <div className="text-sm" style={{ color: 'var(--workout-text-primary)' }}>{workout.name}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--workout-text-muted)' }}>{workout.date}</div>
              </div>
              <div className="text-xs" style={{ color: 'var(--workout-text-secondary)' }}>{workout.sets} sets</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}