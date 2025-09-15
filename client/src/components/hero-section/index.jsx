import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search,  Users, Award, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerImage from "@/assets/banner-img.png";

// Use provided banner image from assets
const heroImageUrl = bannerImage;

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
  }

  return (
    <section className="relative overflow-hidden p-8">
      <div className="absolute inset-0">
        <img
          src={heroImageUrl}
          alt="Students learning online"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Learn Without Limits
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
            Join millions of learners worldwide. Access thousands of courses and live sessions from expert instructors.
          </p>

          <div className="flex gap-2 mb-8 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="What do you want to learn today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg bg-white/95 backdrop-blur-sm border-0"
                data-testid="input-hero-search"
              />
            </div>
            <Button
              size="lg"
              className="h-12 px-8 bg-primary/90 hover:bg-primary backdrop-blur-sm"
              onClick={handleSearch}
              data-testid="button-hero-search"
            >
              Search
            </Button>
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              data-testid="button-browse-courses"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Courses
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              data-testid="button-join-live-session"
            >
              <Play className="mr-2 h-5 w-5" />
              Join Live Session
            </Button>
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Users className="h-6 w-6" />
                <span className="text-3xl font-bold" data-testid="text-students-count">
                  2M+
                </span>
              </div>
              <p className="text-white/80">Students Worldwide</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <BookOpen className="h-6 w-6" />
                <span className="text-3xl font-bold" data-testid="text-courses-count">
                  50K+
                </span>
              </div>
              <p className="text-white/80">Courses Available</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Award className="h-6 w-6" />
                <span className="text-3xl font-bold" data-testid="text-instructors-count">
                  10K+
                </span>
              </div>
              <p className="text-white/80">Expert Instructors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;


