import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCard, { Course } from '@/components/CourseCard';
import UserPreferences, { UserPreference } from '@/components/UserPreferences';
import SearchAndFilters from '@/components/SearchAndFilters';
import { RecommendationEngine } from '@/utils/recommendationEngine';
import { mockCourses } from '@/data/mockCourses';
import { toast } from 'sonner';
import { BookOpen, Users, Star, TrendingUp, Sparkles, Brain } from 'lucide-react';

const Index = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreference>({
    interests: [],
    skillLevel: '',
    learningStyle: '',
    timeCommitment: 5,
    budget: 100,
    preferredLanguage: 'English',
    goals: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all_categories');
  const [selectedLevel, setSelectedLevel] = useState('all_levels');
  const [priceFilter, setPriceFilter] = useState('all_prices');
  const [recommendationEngine] = useState(() => new RecommendationEngine(mockCourses));
  const [showTrending, setShowTrending] = useState(false);

  // Get unique categories from courses
  const categories = useMemo(() => 
    Array.from(new Set(mockCourses.map(course => course.category))).sort(),
    []
  );

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    let courses = showTrending 
      ? recommendationEngine.getTrendingCourses(12)
      : mockCourses;

    // Apply search
    if (searchQuery) {
      courses = recommendationEngine.searchCourses(searchQuery);
    }

    // Apply filters
    return courses.filter(course => {
      if (selectedCategory && selectedCategory !== 'all_categories' && course.category !== selectedCategory) return false;
      if (selectedLevel && selectedLevel !== 'all_levels' && course.level !== selectedLevel) return false;
      
      if (priceFilter && priceFilter !== 'all_prices') {
        switch (priceFilter) {
          case 'free':
            return course.price === 0;
          case 'paid':
            return course.price > 0;
          case 'under50':
            return course.price < 50;
          case 'under100':
            return course.price < 100;
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [searchQuery, selectedCategory, selectedLevel, priceFilter, showTrending, recommendationEngine]);

  // Get recommendations
  const recommendations = useMemo(() => {
    if (userPreferences.interests.length === 0 || !userPreferences.skillLevel) {
      return [];
    }
    return recommendationEngine.getHybridRecommendations(userPreferences, 8);
  }, [userPreferences, recommendationEngine]);

  const handleEnrollCourse = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      toast.success(`Successfully enrolled in "${course.title}"!`, {
        description: 'Course has been added to your learning dashboard.'
      });
      
      // Add interaction to recommendation engine
      recommendationEngine.addUserInteraction({
        courseId,
        rating: 0,
        enrolled: true,
        completionRate: 0
      });
    }
  };

  const handleRateCourse = (courseId: string, rating: number) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      toast.success(`Rated "${course.title}" ${rating} stars!`);
      
      // Add rating to recommendation engine
      recommendationEngine.addUserInteraction({
        courseId,
        rating,
        enrolled: false,
        completionRate: 0
      });
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all_categories');
    setSelectedLevel('all_levels');
    setPriceFilter('all_prices');
    setSearchQuery('');
    setShowTrending(false);
  };

  const handleShowTrending = () => {
    setShowTrending(!showTrending);
    setSearchQuery('');
  };

  // Calculate stats
  const totalCourses = mockCourses.length;
  const totalStudents = mockCourses.reduce((sum, course) => sum + course.students, 0);
  const averageRating = (mockCourses.reduce((sum, course) => sum + course.rating, 0) / mockCourses.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  CourseAI
                </h1>
                <p className="text-gray-600">Intelligent Course Recommendations</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{totalCourses.toLocaleString()} Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{totalStudents.toLocaleString()} Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{averageRating} Avg Rating</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Discover Courses
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              My Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
              priceFilter={priceFilter}
              onPriceFilterChange={setPriceFilter}
              onClearFilters={clearFilters}
              onShowTrending={handleShowTrending}
              categories={categories}
            />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {showTrending ? 'Trending Courses' : 'All Courses'}
                </h2>
                {showTrending && <TrendingUp className="w-5 h-5 text-orange-500" />}
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredCourses.length} courses found
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnrollCourse}
                  onRate={handleRateCourse}
                />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            {recommendations.length > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Personalized Recommendations for You
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommendations.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnrollCourse}
                      onRate={handleRateCourse}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Brain className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                  <CardTitle className="text-xl mb-2">Set Your Preferences</CardTitle>
                  <p className="text-gray-600 mb-4">
                    Tell us about your interests and goals to get personalized course recommendations
                  </p>
                  <Button onClick={() => {
                    // Switch to preferences tab
                    const preferencesTab = document.querySelector('[value="preferences"]') as HTMLElement;
                    preferencesTab?.click();
                  }}>
                    Configure Preferences
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <UserPreferences
              preferences={userPreferences}
              onPreferencesChange={setUserPreferences}
            />
            
            {userPreferences.interests.length > 0 && userPreferences.skillLevel && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Preview: Your Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.slice(0, 3).map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onEnroll={handleEnrollCourse}
                        onRate={handleRateCourse}
                      />
                    ))}
                  </div>
                  {recommendations.length > 3 && (
                    <div className="text-center mt-6">
                      <Button onClick={() => {
                        const recommendationsTab = document.querySelector('[value="recommendations"]') as HTMLElement;
                        recommendationsTab?.click();
                      }}>
                        View All {recommendations.length} Recommendations
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
