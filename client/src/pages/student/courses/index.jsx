import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Pagination from "@/components/ui/pagination";
import CourseCard from "@/components/featured-courses/CourseCard";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon, SearchIcon } from "lucide-react";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1) {
        cpyFilters = {
          ...cpyFilters,
          [getSectionId]: [...cpyFilters[getSectionId], getCurrentOption.id],
        };
      } else {
        cpyFilters = {
          ...cpyFilters,
          [getSectionId]: cpyFilters[getSectionId].filter(
            (id) => id !== getCurrentOption.id
          ),
        };
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  const fetchAllStudentViewCourses = useCallback(async (filters, sort, page = 1, search = "") => {
    // Create base query parameters manually
    const queryParams = [];

    // Add base parameters
    queryParams.push(`sortBy=${encodeURIComponent(sort)}`);
    queryParams.push(`page=${encodeURIComponent(page.toString())}`);
    queryParams.push(`limit=12`);

    if (search) {
      queryParams.push(`q=${encodeURIComponent(search)}`);
    }

    // Add filter parameters using the helper function
    const filterParams = createSearchParamsHelper(filters);
    if (filterParams) {
      queryParams.push(filterParams);
    }

    // Combine all parameters
    const queryString = queryParams.join("&");
    const query = new URLSearchParams(queryString);

    console.log("Query parameters:", queryString);
    console.log("Filters being sent:", filters);
    console.log("Search query:", search);
    console.log("Current page:", page);
    console.log("Sort:", sort);

    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setPagination(response?.pagination || {});
      setLoadingState(false);
    }
  }, [setStudentViewCoursesList, setLoadingState]);

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAllStudentViewCourses(filters, sort, page, searchQuery);
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setSearchQuery("");
    sessionStorage.removeItem("filters");
    // Reset URL parameters
    setSearchParams({});
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters !== null && sort !== null) {
        fetchAllStudentViewCourses(filters, sort, currentPage, searchQuery);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [filters, sort, currentPage, searchQuery, fetchAllStudentViewCourses]);

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters, setSearchParams]);

  useEffect(() => {
    setSort("price-lowtohigh");

    // Safely parse filters from sessionStorage
    try {
      const savedFilters = sessionStorage.getItem("filters");
      setFilters(savedFilters ? JSON.parse(savedFilters) : {});
    } catch (error) {
      console.error("Error parsing saved filters:", error);
      setFilters({});
    }

    // Initialize search query from URL params
    const urlSearchQuery = searchParams.get('q') || '';
    setSearchQuery(urlSearchQuery);

    // Initialize current page from URL params
    const urlPage = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(urlPage);
  }, [searchParams]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  console.log(loadingState, "loadingState");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
            {/* Clear All Filters Button */}
            {(Object.keys(filters).length >= 0 || searchQuery.trim() !== "") && (
              <div className="p-4 border-b">
                <Button
                  onClick={handleClearAllFilters}
                  variant="outline"
                  className="w-full bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          <div>
            {Object.keys(filterOptions).map((keyItem) => (
              <div className="p-4 border-b " key={keyItem}>
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label className="flex font-medium items-center gap-3" key={option.id}>
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(keyItem, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}

            
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-between items-center mb-4 gap-5 flex-wrap">
            <span className="text-sm text-black font-bold">
              {pagination.totalCourses || studentViewCoursesList.length} Results
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <CourseCard
                  key={courseItem?._id}
                  id={courseItem?._id}
                  title={courseItem?.title}
                  instructor={courseItem?.instructorName || "Instructor"}
                  instructorAvatar={courseItem?.instructorAvatar}
                  thumbnail={courseItem?.image}
                  price={Number(courseItem?.pricing) || 0}
                  originalPrice={Number(courseItem?.pricing) ? Number(courseItem?.pricing) * 1.5 : 0}
                  rating={courseItem?.rating || 4.8}
                  studentCount={(courseItem?.students && courseItem?.students.length) || 0}
                  duration={courseItem?.duration || ""}
                  level={courseItem?.level || ""}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                />
              ))
            ) : loadingState ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h1 className="font-extrabold text-4xl">No Courses Found</h1>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
