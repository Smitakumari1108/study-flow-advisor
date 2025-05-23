
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Users, BookOpen } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  duration: string;
  students: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  tags: string[];
  price: number;
  thumbnail: string;
  recommendation_score?: number;
}

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
  onRate: (courseId: string, rating: number) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, onRate }) => {
  const [userRating, setUserRating] = React.useState(0);

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
    onRate(course.id, rating);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs">
            {course.category}
          </Badge>
          <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
            {course.level}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2 text-gray-800">
          {course.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          by {course.instructor}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-1">
          {course.description}
        </p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">
              ${course.price === 0 ? 'Free' : course.price}
            </span>
            {course.recommendation_score && (
              <span className="text-xs text-green-600 font-medium">
                {Math.round(course.recommendation_score * 100)}% match
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 cursor-pointer transition-colors ${
                    star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
            <Button 
              onClick={() => onEnroll(course.id)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Enroll
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
