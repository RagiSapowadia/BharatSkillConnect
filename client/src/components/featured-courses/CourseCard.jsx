import { Button } from "@/components/ui/button";

function CourseCard({
  id,
  title,
  instructor,
  instructorAvatar,
  thumbnail,
  price,
  originalPrice,
  rating,
  studentCount,
  duration,
  level,
  onClick,
}) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
      data-testid={`course-card-${id}`}
    >
      <div className="relative overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 rounded-full bg-white/90 text-xs font-medium text-gray-700 capitalize">
            {level}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {instructorAvatar ? (
            <img src={instructorAvatar} alt={instructor} className="w-5 h-5 rounded-full" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">{instructor.charAt(0)}</span>
            </div>
          )}
          <span className="font-medium text-gray-700">{instructor}</span>
        </div>
        <h3 className="font-semibold text-gray-900 leading-snug min-h-[48px] line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">{rating}</span>
          </div>
          <span>{studentCount.toLocaleString()} students</span>
          {duration && <span>{duration}</span>}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="space-x-2">
            {originalPrice > price && originalPrice > 0 && (
              <span className="line-through text-gray-400 text-sm">₹{originalPrice.toFixed(0)}</span>
            )}
            <span className="text-lg font-bold text-gray-900">
              {price > 0 ? `₹${price.toFixed(0)}` : 'Free'}
            </span>
          </div>
          <Button 
            size="sm" 
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs px-3 py-1"
          >
            {price > 0 ? 'Enroll Now' : 'Start Free'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;


