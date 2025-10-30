import { useState, useEffect } from 'react';
import { ArrowLeft, Pause, Play, X, Check, ChevronRight, List, Edit2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
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

interface ActiveWorkoutScreenProps {
  preparedExercises: PreparedExercise[];
  onBack: () => void;
  onComplete: (completedExercises: PreparedExercise[], elapsedTime: number) => void;
  isDarkMode: boolean;
}

interface EditedSet {
  reps: string;
  weight: string;
}

export function ActiveWorkoutScreen({
  preparedExercises,
  onBack,
  onComplete,
  isDarkMode,
}: ActiveWorkoutScreenProps) {
  const [exercises, setExercises] = useState<PreparedExercise[]>(
    preparedExercises.map(pe => ({
      ...pe,
      sets: pe.sets.map(set => ({ ...set, completed: false }))
    }))
  );
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [isEditingExercise, setIsEditingExercise] = useState(false);
  const [editedSets, setEditedSets] = useState<EditedSet[]>([]);

  // Timer effect
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExercise = exercises[currentExerciseIndex];
  const currentSet = currentExercise.sets.findIndex(set => !set.completed);
  const completedSets = currentExercise.sets.filter(set => set.completed).length;
  const totalSets = currentExercise.sets.length;
  const allSetsCompleted = currentSet === -1;

  // Check if exercise needs weight
  const needsWeight = (exercise: Exercise) => {
    return !exercise.equipment.includes('Bodyweight');
  };

  const markSetComplete = (setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[currentExerciseIndex].sets[setIndex].completed = true;
    setExercises(newExercises);

    // Auto-advance to next exercise if all sets completed
    const allComplete = newExercises[currentExerciseIndex].sets.every(set => set.completed);
    if (allComplete && currentExerciseIndex < exercises.length - 1) {
      setTimeout(() => {
        setCurrentExerciseIndex(prev => prev + 1);
      }, 500);
    }
  };

  const goToNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const goToExercise = (index: number) => {
    setCurrentExerciseIndex(index);
  };

  const startEditExercise = () => {
    // Initialize edited sets with current values
    const initialEdits = currentExercise.sets.map(set => ({
      reps: set.reps?.toString() || '',
      weight: set.weight?.toString() || ''
    }));
    setEditedSets(initialEdits);
    setIsEditingExercise(true);
  };

  const saveEditExercise = () => {
    const newExercises = [...exercises];
    newExercises[currentExerciseIndex].sets = newExercises[currentExerciseIndex].sets.map((set, idx) => ({
      ...set,
      reps: editedSets[idx].reps ? parseInt(editedSets[idx].reps) : null,
      weight: editedSets[idx].weight ? parseFloat(editedSets[idx].weight) : null,
    }));
    setExercises(newExercises);
    setIsEditingExercise(false);
    setEditedSets([]);
  };

  const cancelEditExercise = () => {
    setIsEditingExercise(false);
    setEditedSets([]);
  };

  const updateEditedSet = (setIndex: number, field: 'reps' | 'weight', value: string) => {
    const newEditedSets = [...editedSets];
    newEditedSets[setIndex][field] = value;
    setEditedSets(newEditedSets);
  };

  const handleFinishWorkout = () => {
    // Filter to only include exercises with at least one completed set
    const completedExercises = exercises
      .map(ex => ({
        ...ex,
        sets: ex.sets.filter(set => set.completed)
      }))
      .filter(ex => ex.sets.length > 0);
    
    onComplete(completedExercises, elapsedTime);
  };

  const confirmFinishEarly = () => {
    setShowFinishDialog(true);
  };

  // Calculate total progress
  const totalCompletedSets = exercises.reduce((acc, ex) => 
    acc + ex.sets.filter(set => set.completed).length, 0
  );
  const totalAllSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const progressPercent = (totalCompletedSets / totalAllSets) * 100;

  // Check if workout is complete
  const isWorkoutComplete = exercises.every(ex => ex.sets.every(set => set.completed));

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: 'var(--workout-bg-primary)',
        color: 'var(--workout-text-primary)'
      }}
    >
      {/* Header */}
      <div 
        className="px-5 pt-12 pb-4 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(to bottom, var(--workout-bg-secondary), var(--workout-bg-primary))',
          borderBottom: '1px solid var(--workout-border)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full transition-colors flex items-center justify-center"
            style={{ backgroundColor: 'var(--workout-bg-elevated)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-bg-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Timer */}
          <div className="flex-1 text-center">
            <div className="text-2xl tracking-wider" style={{ color: 'var(--workout-accent-primary)' }}>
              {formatTime(elapsedTime)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--workout-text-muted)' }}>
              {isPaused ? 'Paused' : 'In Progress'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pause/Resume */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-10 h-10 rounded-full transition-colors flex items-center justify-center"
              style={{ backgroundColor: 'var(--workout-bg-elevated)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)'}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>

            {/* Exercise List Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="w-10 h-10 rounded-full transition-colors flex items-center justify-center"
                  style={{ backgroundColor: 'var(--workout-bg-elevated)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-accent-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)'}
                >
                  <List className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent 
                side="right"
                style={{
                  backgroundColor: 'var(--workout-bg-elevated)',
                  borderLeft: '1px solid var(--workout-border)'
                }}
              >
                <SheetHeader>
                  <SheetTitle style={{ color: 'var(--workout-text-primary)' }}>
                    All Exercises
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {exercises.map((ex, idx) => {
                    const exCompletedSets = ex.sets.filter(set => set.completed).length;
                    const exTotalSets = ex.sets.length;
                    const isCurrentEx = idx === currentExerciseIndex;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          goToExercise(idx);
                        }}
                        className="w-full text-left p-4 rounded-xl transition-all"
                        style={{
                          backgroundColor: isCurrentEx ? 'var(--workout-accent-primary)' : 'var(--workout-bg-primary)',
                          border: `1px solid ${isCurrentEx ? 'transparent' : 'var(--workout-border)'}`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="mb-1" style={{ color: isCurrentEx ? '#fff' : 'var(--workout-text-primary)' }}>
                              {ex.exercise.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs" style={{ color: isCurrentEx ? 'rgba(255,255,255,0.8)' : 'var(--workout-text-muted)' }}>
                              <span>{exCompletedSets}/{exTotalSets} sets</span>
                              {exCompletedSets === exTotalSets && (
                                <span className="flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  Complete
                                </span>
                              )}
                            </div>
                          </div>
                          {isCurrentEx && (
                            <div className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                              Current
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-2">
          <div 
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--workout-bg-elevated)' }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'var(--workout-accent-primary)'
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--workout-text-muted)' }}>
          <span>Overall Progress</span>
          <span>{totalCompletedSets} / {totalAllSets} sets</span>
        </div>
      </div>

      {/* Current Exercise */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="max-w-md mx-auto">
          {/* Exercise Info */}
          <div 
            className="rounded-2xl p-6 mb-6"
            style={{ 
              backgroundColor: 'var(--workout-bg-elevated)',
              border: '1px solid var(--workout-border)'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 style={{ color: 'var(--workout-text-primary)' }}>
                    {currentExercise.exercise.name}
                  </h2>
                  {!isEditingExercise && (
                    <button
                      onClick={startEditExercise}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: 'var(--workout-bg-primary)',
                        color: 'var(--workout-text-muted)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--workout-accent-secondary)';
                        e.currentTarget.style.color = 'var(--workout-text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--workout-bg-primary)';
                        e.currentTarget.style.color = 'var(--workout-text-muted)';
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--workout-text-muted)' }}>
                  <span>{currentExercise.exercise.muscle}</span>
                  <span>•</span>
                  <span>{currentExercise.exercise.equipment}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: 'var(--workout-text-muted)' }}>Exercise</div>
                <div className="text-sm" style={{ color: 'var(--workout-accent-primary)' }}>
                  {currentExerciseIndex + 1} / {exercises.length}
                </div>
              </div>
            </div>

            {/* Sets Progress */}
            <div className="flex items-center gap-2 mb-4">
              {currentExercise.sets.map((set, idx) => (
                <div
                  key={set.id}
                  className="flex-1 h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: set.completed ? 'var(--workout-accent-primary)' : 'var(--workout-bg-primary)'
                  }}
                />
              ))}
            </div>

            <div className="text-center mb-2">
              <div className="text-sm" style={{ color: 'var(--workout-text-muted)' }}>
                {allSetsCompleted ? 'All sets completed!' : `Set ${currentSet + 1} of ${totalSets}`}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--workout-text-secondary)' }}>
                {completedSets} completed • {totalSets - completedSets} remaining
              </div>
            </div>
          </div>

          {/* Sets List */}
          <div className="space-y-3">
            {currentExercise.sets.map((set, idx) => {
              const isActive = idx === currentSet;
              
              return (
                <div
                  key={set.id}
                  className="rounded-xl p-4 transition-all"
                  style={{
                    backgroundColor: set.completed ? 'var(--workout-bg-secondary)' : 'var(--workout-bg-elevated)',
                    border: `2px solid ${isActive && !set.completed ? 'var(--workout-accent-primary)' : 'var(--workout-border)'}`,
                    opacity: set.completed ? 0.7 : 1
                  }}
                >
                  {isEditingExercise ? (
                    <div className="space-y-3">
                      <div className="text-sm mb-2" style={{ color: 'var(--workout-text-muted)' }}>
                        Set {idx + 1}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-xs block mb-1" style={{ color: 'var(--workout-text-muted)' }}>
                            Reps
                          </label>
                          <Input
                            type="number"
                            value={editedSets[idx]?.reps || ''}
                            onChange={(e) => updateEditedSet(idx, 'reps', e.target.value)}
                            className="h-10"
                            style={{
                              backgroundColor: 'var(--workout-bg-primary)',
                              border: '1px solid var(--workout-border)',
                              color: 'var(--workout-text-primary)'
                            }}
                          />
                        </div>
                        {needsWeight(currentExercise.exercise) && (
                          <div className="flex-1">
                            <label className="text-xs block mb-1" style={{ color: 'var(--workout-text-muted)' }}>
                              Weight (lbs)
                            </label>
                            <Input
                              type="number"
                              value={editedSets[idx]?.weight || ''}
                              onChange={(e) => updateEditedSet(idx, 'weight', e.target.value)}
                              className="h-10"
                              style={{
                                backgroundColor: 'var(--workout-bg-primary)',
                                border: '1px solid var(--workout-border)',
                                color: 'var(--workout-text-primary)'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm" style={{ color: 'var(--workout-text-muted)' }}>
                          Set {idx + 1}
                        </div>
                        <div className="flex items-center gap-3">
                          <div>
                            <span style={{ color: 'var(--workout-text-primary)' }}>
                              {set.reps || '—'}
                            </span>
                            <span className="text-xs ml-1" style={{ color: 'var(--workout-text-muted)' }}>
                              reps
                            </span>
                          </div>
                          {needsWeight(currentExercise.exercise) && (
                            <>
                              <span style={{ color: 'var(--workout-text-muted)' }}>×</span>
                              <div>
                                <span style={{ color: 'var(--workout-text-primary)' }}>
                                  {set.weight || '—'}
                                </span>
                                <span className="text-xs ml-1" style={{ color: 'var(--workout-text-muted)' }}>
                                  lbs
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => !set.completed && markSetComplete(idx)}
                          disabled={set.completed}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            backgroundColor: set.completed ? 'var(--workout-accent-primary)' : 'var(--workout-bg-primary)',
                            cursor: set.completed ? 'default' : 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            if (!set.completed) e.currentTarget.style.backgroundColor = 'var(--workout-accent-primary)';
                          }}
                          onMouseLeave={(e) => {
                            if (!set.completed) e.currentTarget.style.backgroundColor = 'var(--workout-bg-primary)';
                          }}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Edit Mode Actions */}
          {isEditingExercise && (
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={saveEditExercise}
                className="flex-1 rounded-xl py-3 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--workout-accent-primary)' }}
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={cancelEditExercise}
                className="flex-1 rounded-xl py-3 transition-all text-center"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--workout-border)',
                  color: 'var(--workout-text-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)';
                  e.currentTarget.style.borderColor = 'var(--workout-text-muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--workout-border)';
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Skip to Next Exercise */}
          {!allSetsCompleted && !isEditingExercise && currentExerciseIndex < exercises.length - 1 && (
            <button
              onClick={goToNextExercise}
              className="w-full mt-6 rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2 text-center"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--workout-border)',
                color: 'var(--workout-text-secondary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)';
                e.currentTarget.style.borderColor = 'var(--workout-accent-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'var(--workout-border)';
              }}
            >
              Skip to Next Exercise
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div 
        className="px-5 py-4 flex-shrink-0"
        style={{ 
          backgroundColor: 'var(--workout-bg-secondary)',
          borderTop: '1px solid var(--workout-border)'
        }}
      >
        <div className="max-w-md mx-auto">
          {isWorkoutComplete ? (
            <button
              onClick={handleFinishWorkout}
              className="w-full rounded-xl py-4 transition-all relative overflow-hidden group text-center"
              style={{ backgroundColor: 'var(--workout-accent-primary)' }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
              <div className="relative flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span>Complete Workout</span>
              </div>
            </button>
          ) : (
            <button
              onClick={confirmFinishEarly}
              className="w-full rounded-xl py-4 transition-all text-center"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--workout-border)',
                color: 'var(--workout-text-secondary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)';
                e.currentTarget.style.borderColor = 'var(--workout-text-muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'var(--workout-border)';
              }}
            >
              Finish Workout Early
            </button>
          )}
        </div>
      </div>

      {/* Finish Early Dialog */}
      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent style={{ backgroundColor: 'var(--workout-bg-elevated)', border: '1px solid var(--workout-border)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: 'var(--workout-text-primary)' }}>
              Finish Workout Early?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'var(--workout-text-muted)' }}>
              You still have uncompleted sets. Only completed sets will be saved to your workout history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="text-center"
              style={{ 
                backgroundColor: 'var(--workout-bg-secondary)',
                border: '1px solid var(--workout-border)',
                color: 'var(--workout-text-secondary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--workout-bg-secondary)';
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishWorkout}
              className="text-center"
              style={{
                backgroundColor: 'var(--workout-accent-primary)',
                color: 'var(--workout-text-primary)'
              }}
            >
              Finish Workout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
