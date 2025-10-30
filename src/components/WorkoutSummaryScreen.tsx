import { Check, Home, Trophy, Dumbbell, Clock } from 'lucide-react';
import type { Exercise } from './QuickStartScreen';

interface ExerciseSet {
  id: string;
  reps: number | null;
  weight: number | null;
  completed: boolean;
}

interface PreparedExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

interface WorkoutSummaryScreenProps {
  completedExercises: PreparedExercise[];
  elapsedTime: number;
  onBackToHome: () => void;
  isDarkMode: boolean;
}

export function WorkoutSummaryScreen({
  completedExercises,
  elapsedTime,
  onBackToHome,
  isDarkMode,
}: WorkoutSummaryScreenProps) {
  
  // Format elapsed time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  // Calculate stats
  const totalSets = completedExercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalVolume = completedExercises.reduce((acc, ex) => {
    return acc + ex.sets.reduce((setAcc, set) => {
      const reps = set.reps || 0;
      const weight = set.weight || 0;
      return setAcc + (reps * weight);
    }, 0);
  }, 0);

  return (
    <div 
      className="min-h-screen pb-20"
      style={{ backgroundColor: 'var(--workout-bg-primary)' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-12 pb-6 text-center"
        style={{
          backgroundColor: 'var(--workout-bg-primary)',
        }}
      >
        <div className="flex justify-center mb-4">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--workout-accent-primary)' }}
          >
            <Trophy className="w-10 h-10" style={{ color: 'var(--workout-text-primary)' }} />
          </div>
        </div>
        <h1 style={{ color: 'var(--workout-text-primary)' }}>Great Workout!</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--workout-text-muted)' }}>
          You've completed your workout session
        </p>
      </div>

      {/* Stats Summary */}
      <div className="px-5 mb-6">
        <div 
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--workout-bg-elevated)' }}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Clock className="w-5 h-5" style={{ color: 'var(--workout-accent-primary)' }} />
              </div>
              <div style={{ color: 'var(--workout-text-primary)' }}>
                {formatTime(elapsedTime)}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--workout-text-muted)' }}>
                Duration
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Dumbbell className="w-5 h-5" style={{ color: 'var(--workout-accent-primary)' }} />
              </div>
              <div style={{ color: 'var(--workout-text-primary)' }}>
                {completedExercises.length}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--workout-text-muted)' }}>
                Exercises
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Check className="w-5 h-5" style={{ color: 'var(--workout-accent-primary)' }} />
              </div>
              <div style={{ color: 'var(--workout-text-primary)' }}>
                {totalSets}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--workout-text-muted)' }}>
                Sets
              </div>
            </div>
          </div>
          
          {totalVolume > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--workout-border)' }}>
              <div className="text-center">
                <div style={{ color: 'var(--workout-text-primary)' }}>
                  {totalVolume.toLocaleString()} lbs
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--workout-text-muted)' }}>
                  Total Volume
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exercises Summary */}
      <div className="px-5 mb-6">
        <h2 className="mb-4" style={{ color: 'var(--workout-text-primary)' }}>
          Exercises Completed
        </h2>
        <div className="space-y-3">
          {completedExercises.map((prepEx, index) => (
            <div
              key={index}
              className="rounded-xl p-4"
              style={{ backgroundColor: 'var(--workout-bg-elevated)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: 'var(--workout-text-primary)' }}>
                    {prepEx.exercise.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--workout-text-muted)' }}>
                      {prepEx.exercise.muscleGroup}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--workout-text-muted)' }}>
                      •
                    </span>
                    <span className="text-xs" style={{ color: 'var(--workout-text-muted)' }}>
                      {prepEx.sets.length} {prepEx.sets.length === 1 ? 'set' : 'sets'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-2">
                {prepEx.sets.map((set, setIndex) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg"
                    style={{ backgroundColor: 'var(--workout-bg-primary)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--workout-text-muted)' }}>
                      Set {setIndex + 1}
                    </span>
                    <div className="flex items-center gap-4">
                      {set.reps !== null && (
                        <span className="text-sm" style={{ color: 'var(--workout-text-secondary)' }}>
                          {set.reps} reps
                        </span>
                      )}
                      {set.weight !== null && (
                        <span className="text-sm" style={{ color: 'var(--workout-text-secondary)' }}>
                          {set.weight} lbs
                        </span>
                      )}
                      <Check className="w-4 h-4" style={{ color: 'var(--workout-accent-primary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 px-5 py-6"
        style={{ 
          backgroundColor: 'var(--workout-bg-primary)',
          borderTop: '1px solid var(--workout-border)',
        }}
      >
        <div className="mx-auto max-w-md">
          <button
            onClick={onBackToHome}
            className="w-full rounded-xl py-4 transition-all relative overflow-hidden group text-center"
            style={{ backgroundColor: 'var(--workout-accent-primary)' }}
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            <div className="relative flex items-center justify-center gap-2" style={{ color: 'var(--workout-text-primary)' }}>
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
