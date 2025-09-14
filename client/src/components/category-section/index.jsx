import { Card, CardContent } from "@/components/ui/card";

import {
  Code,
  Briefcase,
  Palette,
  Music,
  Camera,
  Heart,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "development",
    name: "Development",
    icon: Code,
   
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
     
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: TrendingUp,
    
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    
    color:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
  },
  {
    id: "health",
    name: "Health & Fitness",
    icon: Heart,
  
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
  {
    id: "it-software",
    name: "IT & Software",
    icon: Cpu,
    
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400",
  },
];

function CategorySection() {
  const navigate = useNavigate();

  function handleCategoryClick(categoryId) {
    // Optionally persist filter to session and go to courses page
    try {
      const currentFilter = { category: [categoryId] };
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    } catch {
      console.log("Error");
    }
    navigate("/courses");
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Explore Top Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover courses across various fields and start your learning journey today
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => handleCategoryClick(category.id)}
                data-testid={`card-category-${category.id}`}
              >
                <CardContent className="p-14 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3
                    className="font-semibold text-lg mb-2"
                    data-testid={`text-category-name-${category.id}`}
                  >
                    {category.name}
                  </h3>
                  
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;


