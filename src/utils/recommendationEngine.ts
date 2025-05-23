
import { Course } from '@/components/CourseCard';
import { UserPreference } from '@/components/UserPreferences';

interface UserInteraction {
  courseId: string;
  rating: number;
  enrolled: boolean;
  completionRate: number;
}

export class RecommendationEngine {
  private courses: Course[];
  private userInteractions: UserInteraction[];

  constructor(courses: Course[], userInteractions: UserInteraction[] = []) {
    this.courses = courses;
    this.userInteractions = userInteractions;
  }

  // Content-based filtering
  getContentBasedRecommendations(preferences: UserPreference, limit: number = 10): Course[] {
    return this.courses
      .map(course => ({
        ...course,
        recommendation_score: this.calculateContentScore(course, preferences)
      }))
      .sort((a, b) => (b.recommendation_score || 0) - (a.recommendation_score || 0))
      .slice(0, limit);
  }

  // Collaborative filtering simulation
  getCollaborativeRecommendations(limit: number = 10): Course[] {
    // Simulate collaborative filtering by finding courses with high ratings
    // that the user hasn't interacted with
    const interactedCourseIds = new Set(this.userInteractions.map(i => i.courseId));
    
    return this.courses
      .filter(course => !interactedCourseIds.has(course.id))
      .map(course => ({
        ...course,
        recommendation_score: this.calculateCollaborativeScore(course)
      }))
      .sort((a, b) => (b.recommendation_score || 0) - (a.recommendation_score || 0))
      .slice(0, limit);
  }

  // Hybrid recommendation combining both approaches
  getHybridRecommendations(preferences: UserPreference, limit: number = 10): Course[] {
    const contentRecommendations = this.getContentBasedRecommendations(preferences, limit * 2);
    const collaborativeRecommendations = this.getCollaborativeRecommendations(limit * 2);
    
    // Combine scores with weights
    const hybridScores = new Map<string, number>();
    
    contentRecommendations.forEach(course => {
      hybridScores.set(course.id, (course.recommendation_score || 0) * 0.7);
    });
    
    collaborativeRecommendations.forEach(course => {
      const existingScore = hybridScores.get(course.id) || 0;
      hybridScores.set(course.id, existingScore + (course.recommendation_score || 0) * 0.3);
    });
    
    return this.courses
      .map(course => ({
        ...course,
        recommendation_score: hybridScores.get(course.id) || 0
      }))
      .filter(course => (course.recommendation_score || 0) > 0)
      .sort((a, b) => (b.recommendation_score || 0) - (a.recommendation_score || 0))
      .slice(0, limit);
  }

  private calculateContentScore(course: Course, preferences: UserPreference): number {
    let score = 0;
    
    // Interest matching
    const interestMatch = preferences.interests.some(interest => 
      course.category.toLowerCase().includes(interest.toLowerCase()) ||
      course.title.toLowerCase().includes(interest.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
    );
    if (interestMatch) score += 0.4;
    
    // Skill level matching
    if (course.level === preferences.skillLevel) score += 0.2;
    
    // Budget consideration
    if (course.price <= preferences.budget) score += 0.2;
    else if (course.price > preferences.budget) score -= 0.1;
    
    // Course rating weight
    score += (course.rating / 5) * 0.1;
    
    // Popularity weight (based on student count)
    const popularityScore = Math.min(course.students / 10000, 1) * 0.1;
    score += popularityScore;
    
    return Math.max(0, Math.min(1, score));
  }

  private calculateCollaborativeScore(course: Course): number {
    // Simulate collaborative filtering score based on course popularity and rating
    const ratingScore = course.rating / 5;
    const popularityScore = Math.min(course.students / 50000, 1);
    
    // Add some randomness to simulate user similarity
    const similarityScore = Math.random() * 0.3;
    
    return (ratingScore * 0.5 + popularityScore * 0.3 + similarityScore) / 1.8;
  }

  // Add user interaction
  addUserInteraction(interaction: UserInteraction): void {
    const existingIndex = this.userInteractions.findIndex(i => i.courseId === interaction.courseId);
    if (existingIndex >= 0) {
      this.userInteractions[existingIndex] = interaction;
    } else {
      this.userInteractions.push(interaction);
    }
  }

  // Get trending courses
  getTrendingCourses(limit: number = 5): Course[] {
    return this.courses
      .sort((a, b) => {
        const scoreA = a.rating * Math.log(a.students + 1);
        const scoreB = b.rating * Math.log(b.students + 1);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  // Search courses
  searchCourses(query: string): Course[] {
    const searchTerms = query.toLowerCase().split(' ');
    return this.courses.filter(course => 
      searchTerms.some(term => 
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term) ||
        course.tags.some(tag => tag.toLowerCase().includes(term)) ||
        course.instructor.toLowerCase().includes(term)
      )
    );
  }
}
