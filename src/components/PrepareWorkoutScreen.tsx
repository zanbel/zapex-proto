import { useState } from 'react';
import { ArrowLeft, Plus, X, GripVertical, Trash2, Check, Save } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Exercise } from './QuickStartScreen';

interface ExerciseSet {
  id: string;
  reps: number | null;
  weight: number | null;
}

interface PreparedExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

interface PrepareWorkoutScreenProps {
  selectedExercises: Exercise[];
  onBack: () => void;
  onAddExercises: () => void;
  onStartWorkout: (preparedExercises: PreparedExercise[]) => void;
  isDarkMode: boolean;
}

export function PrepareWorkoutScreen({
  selectedExercises,
  onBack,
  onAddExercises,
  onStartWorkout,
  isDarkMode,
}: PrepareWorkoutScreenProps) {
  // Initialize prepared exercises with one set each
  const [preparedExercises, setPreparedExercises] = useState<PreparedExercise[]>(
    selectedExercises.map((exercise) => ({
      exercise,
      sets: [{ id: crypto.randomUUID(), reps: null, weight: null }],
    }))
  );

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Check if exercise needs weight (not bodyweight)
  const needsWeight = (exercise: Exercise) => {
    return !exercise.equipment.includes('Bodyweight');
  };

  const addSet = (exerciseIndex: number) => {
    setPreparedExercises((prev) => {
      const newPrepared = [...prev];
      const exercise = newPrepared[exerciseIndex];
      
      // Pre-populate with first set's values if available
      const firstSet = exercise.sets[0];
      const newSet: ExerciseSet = {
        id: crypto.randomUUID(),
        reps: firstSet.reps,
        weight: firstSet.weight,
      };
      
      exercise.sets.push(newSet);
      return newPrepared;
    });
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setPreparedExercises((prev) => {
      const newPrepared = [...prev];
      if (newPrepared[exerciseIndex].sets.length > 1) {
        newPrepared[exerciseIndex].sets.splice(setIndex, 1);
      }
      return newPrepared;
    });
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    setPreparedExercises((prev) => {
      const newPrepared = [...prev];
      const numValue = value === '' ? null : parseInt(value);
      newPrepared[exerciseIndex].sets[setIndex][field] = numValue;
      return newPrepared;
    });
  };

  const removeExercise = (exerciseIndex: number) => {
    setPreparedExercises((prev) => prev.filter((_, i) => i !== exerciseIndex));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    setPreparedExercises((prev) => {
      const newPrepared = [...prev];
      const draggedItem = newPrepared[draggedIndex];
      newPrepared.splice(draggedIndex, 1);
      newPrepared.splice(index, 0, draggedItem);
      return newPrepared;
    });
    
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleStartWorkout = () => {
    // If saving as template, save it to templates (in a real app, this would save to database/storage)
    if (saveAsTemplate && templateName.trim()) {
      const template = {
        id: crypto.randomUUID(),
        name: templateName.trim(),
        exercises: preparedExercises,
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage for now
      const existingTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]');
      localStorage.setItem('workoutTemplates', JSON.stringify([...existingTemplates, template]));
    }
    
    onStartWorkout(preparedExercises);
  };

  const isWorkoutReady = preparedExercises.length > 0 && 
    preparedExercises.every(pe => 
      pe.sets.every(set => set.reps !== null && (needsWeight(pe.exercise) ? set.weight !== null : true))
    );

  return (
    <div
      className="min-h-screen pb-32"
      style={{
        backgroundColor: 'var(--workout-bg-primary)',
        color: 'var(--workout-text-primary)',
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-12 pb-4"
        style={{
          backgroundColor: 'var(--workout-bg-primary)',
          borderBottom: '1px solid var(--workout-border)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--workout-bg-elevated)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--workout-text-primary)' }} />
          </button>
          <div className="flex-1">
            <h1 style={{ color: 'var(--workout-text-primary)' }}>Prepare Workout</h1>
            <p className="text-sm" style={{ color: 'var(--workout-text-muted)' }}>
              Configure sets, reps, and weights for each exercise
            </p>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="px-5 py-6 space-y-4">
        {preparedExercises.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm mb-4" style={{ color: 'var(--workout-text-muted)' }}>
              No exercises selected
            </p>
            <button
              onClick={onAddExercises}
              className="px-6 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--workout-accent-primary)',
                color: '#ffffff',
              }}
            >
              Add Exercises
            </button>
          </div>
        ) : (
          preparedExercises.map((preparedExercise, exerciseIndex) => (
            <div
              key={preparedExercise.exercise.id}
              draggable
              onDragStart={() => handleDragStart(exerciseIndex)}
              onDragOver={(e) => handleDragOver(e, exerciseIndex)}
              onDragEnd={handleDragEnd}
              className="rounded-2xl p-4 transition-all"
              style={{
                backgroundColor: 'var(--workout-bg-elevated)',
                border: '1px solid var(--workout-border)',
                opacity: draggedIndex === exerciseIndex ? 0.5 : 1,
              }}
            >
              {/* Exercise Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="pt-1 cursor-grab active:cursor-grabbing">
                  <GripVertical
                    className="w-5 h-5"
                    style={{ color: 'var(--workout-text-muted)' }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm" style={{ color: 'var(--workout-text-primary)' }}>
                      {exerciseIndex + 1}. {preparedExercise.exercise.name}
                    </h3>
                    <button
                      onClick={() => removeExercise(exerciseIndex)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="flex gap-2 text-xs mb-3" style={{ color: 'var(--workout-text-muted)' }}>
                    <span>{preparedExercise.exercise.muscleGroups.join(', ')}</span>
                    <span>•</span>
                    <span>{preparedExercise.exercise.equipment.join(', ')}</span>
                  </div>

                  {/* Sets Configuration */}
                  <div className="space-y-2">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-2 text-xs px-2" style={{ color: 'var(--workout-text-muted)' }}>
                      <div className="col-span-2">Set</div>
                      <div className="col-span-4">Reps</div>
                      {needsWeight(preparedExercise.exercise) && (
                        <div className="col-span-5">Weight (kg)</div>
                      )}
                    </div>

                    {/* Set Rows */}
                    {preparedExercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                        <div
                          className="col-span-2 w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                          style={{
                            backgroundColor: 'var(--workout-bg-secondary)',
                            color: 'var(--workout-text-secondary)',
                          }}
                        >
                          {setIndex + 1}
                        </div>
                        <div className="col-span-4">
                          <Input
                            type="number"
                            placeholder="0"
                            value={set.reps ?? ''}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                            className="h-9 text-center"
                            style={{
                              backgroundColor: 'var(--workout-bg-secondary)',
                              border: '1px solid var(--workout-border)',
                              color: 'var(--workout-text-primary)',
                            }}
                          />
                        </div>
                        {needsWeight(preparedExercise.exercise) && (
                          <div className="col-span-5">
                            <Input
                              type="number"
                              placeholder="0"
                              value={set.weight ?? ''}
                              onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                              className="h-9 text-center"
                              style={{
                                backgroundColor: 'var(--workout-bg-secondary)',
                                border: '1px solid var(--workout-border)',
                                color: 'var(--workout-text-primary)',
                              }}
                            />
                          </div>
                        )}
                        <div className="col-span-1 flex justify-end">
                          {preparedExercise.sets.length > 1 && (
                            <button
                              onClick={() => removeSet(exerciseIndex, setIndex)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: 'transparent' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add Set Button */}
                    <button
                      onClick={() => addSet(exerciseIndex)}
                      className="w-full py-2 rounded-lg flex items-center justify-center gap-2 text-xs transition-all"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px dashed var(--workout-border)',
                        color: 'var(--workout-text-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--workout-accent-primary)';
                        e.currentTarget.style.color = 'var(--workout-accent-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--workout-border)';
                        e.currentTarget.style.color = 'var(--workout-text-secondary)';
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Set
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Add Exercises Button */}
        {preparedExercises.length > 0 && (
          <button
            onClick={onAddExercises}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--workout-border)',
              color: 'var(--workout-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)';
              e.currentTarget.style.borderColor = 'var(--workout-accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'var(--workout-border)';
            }}
          >
            <Plus className="w-5 h-5" />
            Add More Exercises
          </button>
        )}
      </div>

      {/* Bottom Action Button */}
      {preparedExercises.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 px-5 py-4"
          style={{
            backgroundColor: 'var(--workout-bg-secondary)',
            borderTop: '1px solid var(--workout-border)',
          }}
        >
          <div className="mx-auto max-w-md space-y-3">
            {/* Save as Template Option */}
            {isWorkoutReady && (
              <div
                className="rounded-xl p-4 space-y-3"
                style={{
                  backgroundColor: 'var(--workout-bg-elevated)',
                  border: '1px solid var(--workout-border)',
                }}
              >
                <button
                  onClick={() => {
                    setSaveAsTemplate(!saveAsTemplate);
                    if (saveAsTemplate) setTemplateName('');
                  }}
                  className="flex items-center gap-3 w-full text-left"
                >
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      backgroundColor: saveAsTemplate 
                        ? 'var(--workout-accent-primary)' 
                        : 'var(--workout-bg-primary)',
                      border: '2px solid',
                      borderColor: saveAsTemplate 
                        ? 'var(--workout-accent-primary)' 
                        : 'var(--workout-border)'
                    }}
                  >
                    {saveAsTemplate && <Check className="w-3 h-3" style={{ color: '#ffffff' }} />}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Save className="w-4 h-4" style={{ color: 'var(--workout-accent-primary)' }} />
                    <span className="text-sm" style={{ color: 'var(--workout-text-primary)' }}>
                      Save as Template
                    </span>
                  </div>
                </button>
                
                {saveAsTemplate && (
                  <Input
                    placeholder="Enter template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="h-10"
                    style={{
                      backgroundColor: 'var(--workout-bg-secondary)',
                      border: '1px solid var(--workout-border)',
                      color: 'var(--workout-text-primary)',
                    }}
                  />
                )}
              </div>
            )}

            {/* Start Workout Button */}
            <button
              onClick={handleStartWorkout}
              disabled={!isWorkoutReady || (saveAsTemplate && !templateName.trim())}
              className="w-full rounded-xl py-4 transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: (isWorkoutReady && (!saveAsTemplate || templateName.trim()))
                  ? 'var(--workout-accent-primary)'
                  : 'var(--workout-bg-elevated)',
                color: (isWorkoutReady && (!saveAsTemplate || templateName.trim())) ? '#ffffff' : 'var(--workout-text-muted)',
              }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
              <div className="relative flex items-center justify-center gap-2">
                <span>Start Workout</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  {preparedExercises.reduce((acc, pe) => acc + pe.sets.length, 0)} sets
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}