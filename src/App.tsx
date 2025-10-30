import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { WorkoutSelectionScreen } from './components/WorkoutSelectionScreen';
import { QuickStartScreen, type Exercise } from './components/QuickStartScreen';
import { PrepareWorkoutScreen } from './components/PrepareWorkoutScreen';
import { ActiveWorkoutScreen } from './components/ActiveWorkoutScreen';
import { WorkoutSummaryScreen } from './components/WorkoutSummaryScreen';
import { ProfileScreen } from './components/ProfileScreen';

type Screen = 'home' | 'workout-selection' | 'quick-start' | 'prepare-workout' | 'active-workout' | 'workout-summary' | 'profile';

interface ExerciseSet {
  id: string;
  reps: number | null;
  weight: number | null;
}

interface PreparedExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [preparedExercises, setPreparedExercises] = useState<PreparedExercise[]>([]);
  const [completedWorkout, setCompletedWorkout] = useState<{
    exercises: PreparedExercise[];
    elapsedTime: number;
  } | null>(null);

  return (
    <div 
      className={`min-h-screen ${isDarkMode ? 'dark-mode' : ''}`}
      style={{ backgroundColor: 'var(--workout-bg-primary)' }}
    >
      {/* Mobile App Container */}
      <div className="mx-auto max-w-md min-h-screen" style={{ backgroundColor: 'var(--workout-bg-primary)' }}>
        {currentScreen === 'home' && (
          <HomeScreen 
            onNavigate={(screen) => setCurrentScreen(screen)} 
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        )}
        {currentScreen === 'workout-selection' && (
          <WorkoutSelectionScreen 
            onBack={() => setCurrentScreen('home')}
            onNavigate={(screen) => setCurrentScreen(screen)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        )}
        {currentScreen === 'quick-start' && (
          <QuickStartScreen 
            onBack={() => setCurrentScreen('workout-selection')}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            initialSelectedExercises={selectedExercises}
            onStartWorkout={(exercises) => {
              setSelectedExercises(exercises);
              setCurrentScreen('prepare-workout');
            }}
            onSaveTemplate={(exercises) => {
              console.log('Saving template with exercises:', exercises);
              // Navigate to template save screen (to be implemented)
            }}
          />
        )}
        {currentScreen === 'prepare-workout' && (
          <PrepareWorkoutScreen
            selectedExercises={selectedExercises}
            onBack={() => setCurrentScreen('quick-start')}
            onAddExercises={() => setCurrentScreen('quick-start')}
            onStartWorkout={(preparedExercises) => {
              setPreparedExercises(preparedExercises);
              setCurrentScreen('active-workout');
            }}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        )}
        {currentScreen === 'active-workout' && (
          <ActiveWorkoutScreen
            preparedExercises={preparedExercises}
            onBack={() => setCurrentScreen('prepare-workout')}
            onComplete={(completedExercises, elapsedTime) => {
              console.log('Workout completed:', completedExercises);
              // Save completed workout data
              setCompletedWorkout({
                exercises: completedExercises,
                elapsedTime: elapsedTime,
              });
              setCurrentScreen('workout-summary');
            }}
            isDarkMode={isDarkMode}
          />
        )}
        {currentScreen === 'workout-summary' && completedWorkout && (
          <WorkoutSummaryScreen
            completedExercises={completedWorkout.exercises}
            elapsedTime={completedWorkout.elapsedTime}
            onBackToHome={() => {
              setCompletedWorkout(null);
              setCurrentScreen('home');
            }}
            isDarkMode={isDarkMode}
          />
        )}
        {currentScreen === 'profile' && (
          <ProfileScreen
            onBack={() => setCurrentScreen('home')}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        )}
      </div>
    </div>
  );
}