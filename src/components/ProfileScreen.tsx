import { useState } from 'react';
import { ArrowLeft, Edit2, Check, User } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  unit: 'kg' | 'lbs';
  weeklyGoal: string;
}

interface ProfileScreenProps {
  onBack: () => void;
  isDarkMode: boolean;
}

export function ProfileScreen({ onBack, isDarkMode }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Roy Z',
    age: '28',
    gender: 'male',
    unit: 'kg',
    weeklyGoal: '4',
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const updateField = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full transition-colors flex items-center justify-center"
              style={{ backgroundColor: 'var(--workout-bg-elevated)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-bg-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--workout-bg-elevated)'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 style={{ color: 'var(--workout-text-primary)' }}>Profile</h1>
              <p className="text-sm" style={{ color: 'var(--workout-text-muted)' }}>
                {isEditing ? 'Edit your information' : 'View your information'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Edit/Save Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-10 h-10 rounded-full transition-colors flex items-center justify-center"
                style={{ backgroundColor: 'var(--workout-accent-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Edit2 className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="w-10 h-10 rounded-full transition-colors flex items-center justify-center"
                style={{ backgroundColor: 'var(--workout-accent-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Check className="w-5 h-5" />
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-5 py-6 max-w-md mx-auto space-y-6">
        {/* Name */}
        <div 
          className="rounded-2xl p-5"
          style={{ 
            backgroundColor: 'var(--workout-bg-elevated)',
            border: '1px solid var(--workout-border)'
          }}
        >
          <Label className="text-sm mb-2 block" style={{ color: 'var(--workout-text-muted)' }}>
            Name
          </Label>
          {isEditing ? (
            <Input
              value={editedProfile.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Enter your name"
              className="h-12"
              style={{
                backgroundColor: 'var(--workout-bg-primary)',
                border: '1px solid var(--workout-border)',
                color: 'var(--workout-text-primary)'
              }}
            />
          ) : (
            <div className="py-3" style={{ color: 'var(--workout-text-primary)' }}>
              {profile.name}
            </div>
          )}
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <div 
            className="rounded-2xl p-5"
            style={{ 
              backgroundColor: 'var(--workout-bg-elevated)',
              border: '1px solid var(--workout-border)'
            }}
          >
            <Label className="text-sm mb-2 block" style={{ color: 'var(--workout-text-muted)' }}>
              Age
            </Label>
            {isEditing ? (
              <Input
                type="number"
                value={editedProfile.age}
                onChange={(e) => updateField('age', e.target.value)}
                placeholder="Age"
                className="h-12"
                style={{
                  backgroundColor: 'var(--workout-bg-primary)',
                  border: '1px solid var(--workout-border)',
                  color: 'var(--workout-text-primary)'
                }}
              />
            ) : (
              <div className="py-3" style={{ color: 'var(--workout-text-primary)' }}>
                {profile.age}
              </div>
            )}
          </div>

          {/* Gender */}
          <div 
            className="rounded-2xl p-5"
            style={{ 
              backgroundColor: 'var(--workout-bg-elevated)',
              border: '1px solid var(--workout-border)'
            }}
          >
            <Label className="text-sm mb-2 block" style={{ color: 'var(--workout-text-muted)' }}>
              Gender
            </Label>
            {isEditing ? (
              <Select
                value={editedProfile.gender}
                onValueChange={(value) => updateField('gender', value)}
              >
                <SelectTrigger 
                  className="h-12"
                  style={{
                    backgroundColor: 'var(--workout-bg-primary)',
                    border: '1px solid var(--workout-border)',
                    color: 'var(--workout-text-primary)'
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--workout-bg-elevated)', border: '1px solid var(--workout-border)' }}>
                  <SelectItem value="male" style={{ color: 'var(--workout-text-primary)' }}>Male</SelectItem>
                  <SelectItem value="female" style={{ color: 'var(--workout-text-primary)' }}>Female</SelectItem>
                  <SelectItem value="other" style={{ color: 'var(--workout-text-primary)' }}>Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="py-3 capitalize" style={{ color: 'var(--workout-text-primary)' }}>
                {profile.gender}
              </div>
            )}
          </div>
        </div>

        {/* Weight Unit */}
        <div 
          className="rounded-2xl p-5"
          style={{ 
            backgroundColor: 'var(--workout-bg-elevated)',
            border: '1px solid var(--workout-border)'
          }}
        >
          <Label className="text-sm mb-3 block" style={{ color: 'var(--workout-text-muted)' }}>
            Weight Unit
          </Label>
          {isEditing ? (
            <div className="flex gap-4">
              <button
                onClick={() => updateField('unit', 'kg')}
                className="flex-1 py-3 px-4 rounded-lg transition-all text-center"
                style={{
                  backgroundColor: editedProfile.unit === 'kg' ? 'var(--workout-accent-primary)' : 'var(--workout-bg-primary)',
                  border: `1px solid ${editedProfile.unit === 'kg' ? 'var(--workout-accent-primary)' : 'var(--workout-border)'}`,
                  color: editedProfile.unit === 'kg' ? '#fff' : 'var(--workout-text-primary)'
                }}
              >
                KG
              </button>
              <button
                onClick={() => updateField('unit', 'lbs')}
                className="flex-1 py-3 px-4 rounded-lg transition-all text-center"
                style={{
                  backgroundColor: editedProfile.unit === 'lbs' ? 'var(--workout-accent-primary)' : 'var(--workout-bg-primary)',
                  border: `1px solid ${editedProfile.unit === 'lbs' ? 'var(--workout-accent-primary)' : 'var(--workout-border)'}`,
                  color: editedProfile.unit === 'lbs' ? '#fff' : 'var(--workout-text-primary)'
                }}
              >
                LBS
              </button>
            </div>
          ) : (
            <div className="py-3" style={{ color: 'var(--workout-text-primary)' }}>
              {profile.unit === 'kg' ? 'KG' : 'LBS'}
            </div>
          )}
        </div>

        {/* Weekly Workout Goal */}
        <div 
          className="rounded-2xl p-5"
          style={{ 
            backgroundColor: 'var(--workout-bg-elevated)',
            border: '1px solid var(--workout-border)'
          }}
        >
          <Label className="text-sm mb-2 block" style={{ color: 'var(--workout-text-muted)' }}>
            Weekly Workout Goal
          </Label>
          {isEditing ? (
            <div className="space-y-3">
              <Input
                type="number"
                value={editedProfile.weeklyGoal}
                onChange={(e) => updateField('weeklyGoal', e.target.value)}
                min="1"
                max="7"
                placeholder="Target workouts per week"
                className="h-12"
                style={{
                  backgroundColor: 'var(--workout-bg-primary)',
                  border: '1px solid var(--workout-border)',
                  color: 'var(--workout-text-primary)'
                }}
              />
              <div className="text-xs" style={{ color: 'var(--workout-text-muted)' }}>
                Set your target number of workouts per week (1-7)
              </div>
            </div>
          ) : (
            <div className="py-3" style={{ color: 'var(--workout-text-primary)' }}>
              {profile.weeklyGoal} {parseInt(profile.weeklyGoal) === 1 ? 'workout' : 'workouts'} per week
            </div>
          )}
        </div>

        {/* Cancel Button (only in edit mode) */}
        {isEditing && (
          <button
            onClick={handleCancel}
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
            Cancel Changes
          </button>
        )}
      </div>
    </div>
  );
}