
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

export interface UserPreference {
  interests: string[];
  skillLevel: string;
  learningStyle: string;
  timeCommitment: number;
  budget: number;
  preferredLanguage: string;
  goals: string[];
}

interface UserPreferencesProps {
  preferences: UserPreference;
  onPreferencesChange: (preferences: UserPreference) => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ preferences, onPreferencesChange }) => {
  const interests = [
    'Programming', 'Data Science', 'Machine Learning', 'Web Development',
    'Mobile Development', 'DevOps', 'Cybersecurity', 'UI/UX Design',
    'Business', 'Marketing', 'Photography', 'Music', 'Languages'
  ];

  const goals = [
    'Career Change', 'Skill Enhancement', 'Personal Interest',
    'Academic Requirement', 'Professional Certification'
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    const updatedInterests = checked
      ? [...preferences.interests, interest]
      : preferences.interests.filter(i => i !== interest);
    
    onPreferencesChange({ ...preferences, interests: updatedInterests });
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    const updatedGoals = checked
      ? [...preferences.goals, goal]
      : preferences.goals.filter(g => g !== goal);
    
    onPreferencesChange({ ...preferences, goals: updatedGoals });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Tell us about your learning preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Areas of Interest</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {interests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={preferences.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label htmlFor={interest} className="text-sm">{interest}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">Learning Goals</Label>
            <div className="space-y-2">
              {goals.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={preferences.goals.includes(goal)}
                    onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                  />
                  <Label htmlFor={goal} className="text-sm">{goal}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="skillLevel" className="text-base font-medium">Skill Level</Label>
            <Select value={preferences.skillLevel} onValueChange={(value) => 
              onPreferencesChange({ ...preferences, skillLevel: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="learningStyle" className="text-base font-medium">Learning Style</Label>
            <Select value={preferences.learningStyle} onValueChange={(value) => 
              onPreferencesChange({ ...preferences, learningStyle: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select learning style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visual">Visual</SelectItem>
                <SelectItem value="Auditory">Auditory</SelectItem>
                <SelectItem value="Hands-on">Hands-on</SelectItem>
                <SelectItem value="Reading">Reading/Writing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language" className="text-base font-medium">Preferred Language</Label>
            <Select value={preferences.preferredLanguage} onValueChange={(value) => 
              onPreferencesChange({ ...preferences, preferredLanguage: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-base font-medium mb-3 block">
              Time Commitment (hours/week): {preferences.timeCommitment}
            </Label>
            <Slider
              value={[preferences.timeCommitment]}
              onValueChange={(value) => 
                onPreferencesChange({ ...preferences, timeCommitment: value[0] })
              }
              max={40}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">
              Budget ($): {preferences.budget === 0 ? 'Free only' : `Up to $${preferences.budget}`}
            </Label>
            <Slider
              value={[preferences.budget]}
              onValueChange={(value) => 
                onPreferencesChange({ ...preferences, budget: value[0] })
              }
              max={500}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;
