import { useState, useMemo } from 'react';
import { ArrowLeft, Check, Plus, X, Filter, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

interface QuickStartScreenProps {
  onBack: () => void;
  isDarkMode: boolean;
  initialSelectedExercises?: Exercise[];
  onStartWorkout?: (exercises: Exercise[]) => void;
  onSaveTemplate?: (exercises: Exercise[]) => void;
}

export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Legs' | 'Core' | 'Glutes' | 'Cardio';
export type Equipment = 'Barbell' | 'Dumbbell' | 'Machine' | 'Bodyweight' | 'Cable' | 'Kettlebell' | 'Band';

export interface Exercise {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
}

const EXERCISES: Exercise[] = [
  { id: '1', name: 'Bench Press', muscleGroups: ['Chest', 'Triceps'], equipment: ['Barbell'] },
  { id: '2', name: 'Dumbbell Flyes', muscleGroups: ['Chest'], equipment: ['Dumbbell'] },
  { id: '3', name: 'Push-ups', muscleGroups: ['Chest', 'Triceps', 'Shoulders'], equipment: ['Bodyweight'] },
  { id: '4', name: 'Incline Press', muscleGroups: ['Chest', 'Shoulders'], equipment: ['Barbell', 'Dumbbell'] },
  { id: '5', name: 'Cable Crossover', muscleGroups: ['Chest'], equipment: ['Cable'] },
  { id: '6', name: 'Deadlift', muscleGroups: ['Back', 'Legs', 'Core'], equipment: ['Barbell'] },
  { id: '7', name: 'Pull-ups', muscleGroups: ['Back', 'Biceps'], equipment: ['Bodyweight'] },
  { id: '8', name: 'Bent Over Row', muscleGroups: ['Back', 'Biceps'], equipment: ['Barbell'] },
  { id: '9', name: 'Lat Pulldown', muscleGroups: ['Back', 'Biceps'], equipment: ['Cable', 'Machine'] },
  { id: '10', name: 'Seated Cable Row', muscleGroups: ['Back'], equipment: ['Cable'] },
  { id: '11', name: 'Overhead Press', muscleGroups: ['Shoulders', 'Triceps'], equipment: ['Barbell', 'Dumbbell'] },
  { id: '12', name: 'Lateral Raise', muscleGroups: ['Shoulders'], equipment: ['Dumbbell', 'Cable'] },
  { id: '13', name: 'Front Raise', muscleGroups: ['Shoulders'], equipment: ['Dumbbell', 'Cable'] },
  { id: '14', name: 'Face Pull', muscleGroups: ['Shoulders', 'Back'], equipment: ['Cable'] },
  { id: '15', name: 'Barbell Curl', muscleGroups: ['Biceps'], equipment: ['Barbell'] },
  { id: '16', name: 'Hammer Curl', muscleGroups: ['Biceps'], equipment: ['Dumbbell'] },
  { id: '17', name: 'Preacher Curl', muscleGroups: ['Biceps'], equipment: ['Barbell', 'Dumbbell', 'Machine'] },
  { id: '18', name: 'Tricep Dips', muscleGroups: ['Triceps', 'Chest'], equipment: ['Bodyweight'] },
  { id: '19', name: 'Tricep Pushdown', muscleGroups: ['Triceps'], equipment: ['Cable'] },
  { id: '20', name: 'Overhead Tricep Extension', muscleGroups: ['Triceps'], equipment: ['Dumbbell', 'Cable'] },
  { id: '21', name: 'Squat', muscleGroups: ['Legs', 'Glutes', 'Core'], equipment: ['Barbell'] },
  { id: '22', name: 'Leg Press', muscleGroups: ['Legs', 'Glutes'], equipment: ['Machine'] },
  { id: '23', name: 'Lunges', muscleGroups: ['Legs', 'Glutes'], equipment: ['Bodyweight', 'Dumbbell'] },
  { id: '24', name: 'Romanian Deadlift', muscleGroups: ['Legs', 'Glutes', 'Back'], equipment: ['Barbell', 'Dumbbell'] },
  { id: '25', name: 'Leg Curl', muscleGroups: ['Legs'], equipment: ['Machine'] },
  { id: '26', name: 'Leg Extension', muscleGroups: ['Legs'], equipment: ['Machine'] },
  { id: '27', name: 'Calf Raise', muscleGroups: ['Legs'], equipment: ['Machine', 'Dumbbell'] },
  { id: '28', name: 'Hip Thrust', muscleGroups: ['Glutes', 'Legs'], equipment: ['Barbell', 'Bodyweight'] },
  { id: '29', name: 'Plank', muscleGroups: ['Core'], equipment: ['Bodyweight'] },
  { id: '30', name: 'Cable Crunch', muscleGroups: ['Core'], equipment: ['Cable'] },
  { id: '31', name: 'Hanging Leg Raise', muscleGroups: ['Core'], equipment: ['Bodyweight'] },
  { id: '32', name: 'Russian Twist', muscleGroups: ['Core'], equipment: ['Bodyweight', 'Dumbbell'] },
  { id: '33', name: 'Treadmill Run', muscleGroups: ['Cardio', 'Legs'], equipment: ['Machine'] },
  { id: '34', name: 'Rowing Machine', muscleGroups: ['Cardio', 'Back'], equipment: ['Machine'] },
  { id: '35', name: 'Jump Rope', muscleGroups: ['Cardio', 'Legs'], equipment: ['Bodyweight'] },
];

const ALL_MUSCLE_GROUPS: MuscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Glutes', 'Cardio'];
const ALL_EQUIPMENT: Equipment[] = ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Cable', 'Kettlebell', 'Band'];

export function QuickStartScreen({ 
  onBack, 
  isDarkMode, 
  initialSelectedExercises = [],
  onStartWorkout,
  onSaveTemplate 
}: QuickStartScreenProps) {
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(
    new Set(initialSelectedExercises.map(ex => ex.id))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<Set<MuscleGroup>>(new Set());
  const [selectedEquipment, setSelectedEquipment] = useState<Set<Equipment>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(exercise => {
      // Search filter
      if (searchQuery && !exercise.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Muscle group filter
      if (selectedMuscleGroups.size > 0) {
        const hasMatchingMuscle = exercise.muscleGroups.some(mg => selectedMuscleGroups.has(mg));
        if (!hasMatchingMuscle) return false;
      }

      // Equipment filter
      if (selectedEquipment.size > 0) {
        const hasMatchingEquipment = exercise.equipment.some(eq => selectedEquipment.has(eq));
        if (!hasMatchingEquipment) return false;
      }

      return true;
    });
  }, [searchQuery, selectedMuscleGroups, selectedEquipment]);

  const toggleExercise = (exerciseId: string) => {
    setSelectedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const toggleMuscleGroup = (muscle: MuscleGroup) => {
    setSelectedMuscleGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(muscle)) {
        newSet.delete(muscle);
      } else {
        newSet.add(muscle);
      }
      return newSet;
    });
  };

  const toggleEquipment = (equipment: Equipment) => {
    setSelectedEquipment(prev => {
      const newSet = new Set(prev);
      if (newSet.has(equipment)) {
        newSet.delete(equipment);
      } else {
        newSet.add(equipment);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedMuscleGroups(new Set());
    setSelectedEquipment(new Set());
  };

  const handleStartWorkout = () => {
    const exercises = EXERCISES.filter(ex => selectedExercises.has(ex.id));
    onStartWorkout?.(exercises);
  };

  const handleSaveTemplate = () => {
    const exercises = EXERCISES.filter(ex => selectedExercises.has(ex.id));
    onSaveTemplate?.(exercises);
  };

  const activeFiltersCount = selectedMuscleGroups.size + selectedEquipment.size;

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
        <div className="flex items-center gap-4 mb-4">
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
            <h1 style={{ color: 'var(--workout-text-primary)' }}>Select Exercises</h1>
            <p className="text-sm" style={{ color: 'var(--workout-text-muted)' }}>
              {selectedExercises.size === 0 
                ? 'Select exercises to build your workout'
                : `${selectedExercises.size} exercise${selectedExercises.size !== 1 ? 's' : ''} selected`
              }
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl h-11 pr-10"
              style={{ 
                backgroundColor: 'var(--workout-bg-elevated)',
                border: '1px solid var(--workout-border)',
                color: 'var(--workout-text-primary)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--workout-bg-secondary)' }}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <button
                className="w-11 h-11 rounded-xl flex items-center justify-center relative transition-colors"
                style={{ 
                  backgroundColor: activeFiltersCount > 0 ? 'var(--workout-accent-primary)' : 'var(--workout-bg-elevated)',
                  border: '1px solid var(--workout-border)'
                }}
              >
                <Filter className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <div 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: 'var(--workout-accent-secondary)' }}
                  >
                    {activeFiltersCount}
                  </div>
                )}
              </button>
            </SheetTrigger>
            <SheetContent 
              side="bottom" 
              className="h-[80vh] border-none p-0 [&]:!bg-[var(--workout-bg-primary)]"
              style={{ 
                backgroundColor: 'var(--workout-bg-primary) !important',
                borderTop: '1px solid var(--workout-border)',
                color: 'var(--workout-text-primary)'
              }}
            >
              <div className="p-6 h-full flex flex-col" style={{ backgroundColor: 'var(--workout-bg-primary)' }}>
                <SheetHeader className="p-0">
                  <SheetTitle style={{ color: 'var(--workout-text-primary)' }}>Filter Exercises</SheetTitle>
                  <SheetDescription style={{ color: 'var(--workout-text-muted)' }}>
                    Filter exercises by muscle groups and equipment type
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6 overflow-y-auto flex-1 pb-4">
                {/* Muscle Groups */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm" style={{ color: 'var(--workout-text-secondary)' }}>Muscle Groups</h3>
                    {selectedMuscleGroups.size > 0 && (
                      <button 
                        onClick={() => setSelectedMuscleGroups(new Set())}
                        className="text-xs"
                        style={{ color: 'var(--workout-accent-primary)' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_MUSCLE_GROUPS.map(muscle => (
                      <button
                        key={muscle}
                        onClick={() => toggleMuscleGroup(muscle)}
                        className="px-3 py-2 rounded-lg text-sm transition-all"
                        style={{
                          backgroundColor: selectedMuscleGroups.has(muscle) 
                            ? 'var(--workout-accent-primary)' 
                            : 'var(--workout-bg-elevated)',
                          border: '1px solid',
                          borderColor: selectedMuscleGroups.has(muscle)
                            ? 'var(--workout-accent-primary)'
                            : 'var(--workout-border)',
                          color: 'var(--workout-text-primary)'
                        }}
                      >
                        {muscle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm" style={{ color: 'var(--workout-text-secondary)' }}>Equipment</h3>
                    {selectedEquipment.size > 0 && (
                      <button 
                        onClick={() => setSelectedEquipment(new Set())}
                        className="text-xs"
                        style={{ color: 'var(--workout-accent-primary)' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_EQUIPMENT.map(equipment => (
                      <button
                        key={equipment}
                        onClick={() => toggleEquipment(equipment)}
                        className="px-3 py-2 rounded-lg text-sm transition-all"
                        style={{
                          backgroundColor: selectedEquipment.has(equipment) 
                            ? 'var(--workout-accent-tertiary)' 
                            : 'var(--workout-bg-elevated)',
                          border: '1px solid',
                          borderColor: selectedEquipment.has(equipment)
                            ? 'var(--workout-accent-tertiary)'
                            : 'var(--workout-border)',
                          color: 'var(--workout-text-primary)'
                        }}
                      >
                        {equipment}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear All Filters */}
                {activeFiltersCount > 0 && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full"
                    style={{
                      backgroundColor: 'var(--workout-bg-elevated)',
                      border: '1px solid var(--workout-border)',
                      color: 'var(--workout-text-primary)'
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--workout-text-muted)' }}>
              No exercises found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredExercises.map(exercise => {
              const isSelected = selectedExercises.has(exercise.id);
              return (
                <button
                  key={exercise.id}
                  onClick={() => toggleExercise(exercise.id)}
                  className="w-full rounded-xl p-4 text-left transition-all relative"
                  style={{
                    backgroundColor: isSelected 
                      ? 'var(--workout-bg-elevated)' 
                      : 'var(--workout-bg-secondary)',
                    border: '1px solid',
                    borderColor: isSelected 
                      ? 'var(--workout-accent-primary)' 
                      : 'var(--workout-border)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                      style={{
                        backgroundColor: isSelected 
                          ? 'var(--workout-accent-primary)' 
                          : 'var(--workout-bg-primary)',
                        border: '2px solid',
                        borderColor: isSelected 
                          ? 'var(--workout-accent-primary)' 
                          : 'var(--workout-border)'
                      }}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>

                    {/* Exercise Info */}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-sm mb-2" 
                        style={{ color: 'var(--workout-text-primary)' }}
                      >
                        {exercise.name}
                      </h3>
                      
                      {/* Muscle Groups */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {exercise.muscleGroups.map(muscle => (
                          <span
                            key={muscle}
                            className="px-2 py-0.5 rounded text-xs"
                            style={{
                              backgroundColor: 'var(--workout-accent-primary)',
                              color: 'var(--workout-text-primary)',
                              opacity: 0.8
                            }}
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>

                      {/* Equipment */}
                      <div className="flex flex-wrap gap-1.5">
                        {exercise.equipment.map(equip => (
                          <span
                            key={equip}
                            className="px-2 py-0.5 rounded text-xs"
                            style={{
                              backgroundColor: 'var(--workout-bg-primary)',
                              color: 'var(--workout-text-muted)',
                              border: '1px solid var(--workout-border)'
                            }}
                          >
                            {equip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {selectedExercises.size > 0 && (
        <div 
          className="fixed bottom-0 left-0 right-0 px-5 py-4"
          style={{ 
            backgroundColor: 'var(--workout-bg-secondary)',
            borderTop: '1px solid var(--workout-border)'
          }}
        >
          <div className="mx-auto max-w-md">
            <button
              onClick={handleStartWorkout}
              className="w-full rounded-xl py-4 transition-all relative overflow-hidden group"
              style={{ backgroundColor: 'var(--workout-accent-primary)' }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
              <div className="relative flex items-center justify-center gap-2">
                <span>Prepare Workout</span>
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  {selectedExercises.size}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
