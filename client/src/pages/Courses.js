import React, { useState, useEffect } from 'react';
import courseApi from '../utils/courseApi';
import communityAuthApi from '../utils/communityAuthApi';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityUrls } from '../utils/communityUrlUtils';
import { CRYPTO_CATEGORIES } from '../config/categories';
import { useResponsiveLayout } from '../utils/responsiveLayout';
import FocusedSidebar from '../components/FocusedSidebar';
import FocusedTopBar from '../components/FocusedTopBar';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import VisibilityIcon from '@mui/icons-material/Visibility';
import '../App.css';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Avatar,
  CircularProgress,
  ListItemText,
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  VideoLibrary as VideoIcon,
  TextFields as TextIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  WbSunny as SunIcon,
  DarkMode as DarkIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterIcon,
  Archive as ArchiveIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import useDocumentTitle from '../contexts/useDocumentTitle';

const Courses = () => {
  const navigate = useNavigate();
  const { communityName } = useParams();
  const { isMobile, getMainContentMargin } = useResponsiveLayout();
  useDocumentTitle('Courses - Bell n Desk');

  // Get community-specific URLs
  const communityUrls = communityName ? getCommunityUrls(communityName) : null;

  // Check if user is a community user (student) or admin
  const communityUserData = localStorage.getItem('communityUserData');
  const isCommunityUser = !!communityUserData;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    types: [],
    categories: [],
    audiences: []
  });
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    types: true,
    categories: false,
    audiences: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [communityData, setCommunityData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragDisabled, setIsDragDisabled] = useState(true); // Start with drag disabled by default
  const [isReordering, setIsReordering] = useState(false);
  const [reorderError, setReorderError] = useState(null);

  // Debug logging
  console.log('🔍 User Debug Info:', {
    communityUserData,
    isCommunityUser,
    isDragDisabled,
    coursesCount: courses.length,
    firstCourseId: courses[0]?._id,
    firstCourseTitle: courses[0]?.title
  });

  // Mock data for fallback
  const mockCourses = [
    {
      _id: '507f1f77bcf86cd799439011',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and become a full-stack developer',
      category: 'Technology',
      status: 'published',
      instructor: 'John Doe',
      thumbnail: 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Web+Dev',
      targetAudience: 'Beginners',
      contentType: 'video',
      subType: 'YouTube',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '507f1f77bcf86cd799439012',
      title: 'React.js Masterclass',
      description: 'Master React.js with hooks, context, and modern development practices',
      category: 'Technology',
      status: 'published',
      instructor: 'Jane Smith',
      targetAudience: 'Intermediate',
      contentType: 'video',
      subType: 'Loom',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '507f1f77bcf86cd799439013',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      category: 'Technology',
      status: 'draft',
      instructor: 'Mike Johnson',
      targetAudience: 'Advanced',
      contentType: 'text',
      subType: 'PDF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Load courses from API
  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();

    const loadCourses = async () => {
      try {

        setLoading(true);

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        );

        // Get community ID from authenticated user's community data
        const community = communityAuthApi.getCurrentCommunity();
        console.log('🔍 communityAuthApi.getCurrentCommunity():', community);
        console.log('🔍 localStorage communityData:', localStorage.getItem('communityData'));
        let communityId = community ? (community._id || community.id) : localStorage.getItem('communityId');

        // If no communityId found, use the Crypto Manji community ID
        if (!communityId || communityId === 'null' || communityId === 'undefined') {
          communityId = '68bae2a8807f3a3bb8ac6307';
          console.log('🔧 Using fallback community ID for course listing:', communityId);
        }

        // FORCE: Always use the correct Crypto Manji community ID for now
        communityId = '68bae2a8807f3a3bb8ac6307';
        console.log('🔧 FORCED: Using Crypto Manji community ID:', communityId);

        // FORCE: Set the correct community ID in localStorage to fix the issue
        localStorage.setItem('communityId', '68bae2a8807f3a3bb8ac6307');
        console.log('🔧 FORCED: Set communityId in localStorage to:', '68bae2a8807f3a3bb8ac6307');

        // FORCE: Also fix the communityData in localStorage if it has wrong community ID
        const communityData = localStorage.getItem('communityData');
        if (communityData) {
          try {
            const parsedData = JSON.parse(communityData);
            if (parsedData._id === '68bae2119b907eb2a8d357f2' || parsedData.id === '68bae2119b907eb2a8d357f2' ||
              parsedData._id === '68b03c92fac3b1af515ccc69' || parsedData.id === '68b03c92fac3b1af515ccc69' ||
              parsedData._id === '68b684467fd9b766dc7cc337' || parsedData.id === '68b684467fd9b766dc7cc337') {
              parsedData._id = '68bae2a8807f3a3bb8ac6307';
              parsedData.id = '68bae2a8807f3a3bb8ac6307';
              localStorage.setItem('communityData', JSON.stringify(parsedData));
              console.log('🔧 FORCED: Fixed communityData in localStorage with Crypto Manji community ID');
            }
          } catch (e) {
            console.log('🔧 Could not parse communityData:', e);
          }
        }

        console.log('🔍 Courses page using community ID:', communityId);
        console.log('🆕 UPDATED Courses.js - Community ID fix applied!');
        console.log('🕐 Timestamp:', new Date().toISOString());

        console.log('🔍 Loading courses for community:', communityId);

        // Fetch courses for the specific community only
        let response;
        try {
          response = await Promise.race([courseApi.getCourses({ community: communityId }), timeoutPromise]);
        } catch (communityError) {
          console.log('⚠️ Community-specific fetch failed:', communityError.message);
          // If community-specific fetch fails, try discovery endpoint as fallback
          try {
            console.log('🔄 Trying discovery endpoint as fallback...');
            response = await courseApi.getCourses({ discovery: 'true' });
            console.log('✅ Discovery fallback successful, got', response.courses?.length || 0, 'courses');
          } catch (discoveryError) {
            console.log('❌ Discovery fallback also failed:', discoveryError.message);
            response = { courses: [] };
          }
        }

        if (!isMounted) return;

        let coursesData = response.courses || [];
        console.log('📊 Courses loaded:', coursesData.length, 'courses');
        console.log('📊 Course titles:', coursesData.map(c => c.title));
        console.log('📊 Full response:', response);

        // If we got courses but they don't match the community, log it
        if (coursesData.length > 0) {
          const communityCourses = coursesData.filter(c => c.community === communityId);
          console.log('🏘️ Courses matching community:', communityCourses.length, 'out of', coursesData.length);
        }

        // Ensure we have consistent data structure
        const normalizedCourses = coursesData.map(course => {
          console.log('📊 Course data for normalization:', {
            title: course.title,
            thumbnail: course.thumbnail,
            thumbnailType: typeof course.thumbnail,
            thumbnailLength: course.thumbnail ? course.thumbnail.length : 0,
            order: course.order
          });

          return {
            _id: course._id || course.id,
            title: course.title || 'Untitled Course',
            description: course.description || '',
            category: course.category || 'Uncategorized',
            status: course.status || 'draft',
            instructor: course.instructor || 'Unknown',
            community: course.community || { _id: communityId, name: 'Unknown Community' },
            thumbnail: course.thumbnail || null,
            targetAudience: course.targetAudience || null,
            contentType: course.contentType || null,
            subType: course.subType || null,
            order: course.order || 0,
            createdAt: course.createdAt || new Date().toISOString(),
            updatedAt: course.updatedAt || new Date().toISOString()
          };
        });

        // Sort courses by order first, then by creation date
        normalizedCourses.sort((a, b) => {
          if (a.order !== b.order) {
            return (a.order || 0) - (b.order || 0);
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Always update with the latest data from API
        console.log('✅ Updating courses with fresh data from API');
        console.log('🔍 REAL COURSE IDs:', normalizedCourses.map(c => ({ title: c.title, _id: c._id, id: c.id })));
        
        // Debug community information
        if (normalizedCourses.length > 0) {
          console.log('🔍 Debug: First course community info:', {
            community: normalizedCourses[0]?.community,
            communityType: typeof normalizedCourses[0]?.community,
            communityName: normalizedCourses[0]?.community?.name
          });
        }
        
        // Show alert if we have real courses
        if (normalizedCourses.length > 0 && normalizedCourses[0]._id && normalizedCourses[0]._id.length > 10) {
          console.log(`✅ REAL COURSES LOADED: ${normalizedCourses.length} courses with valid IDs like ${normalizedCourses[0]._id}`);
        }

        setCourses(normalizedCourses);

      } catch (error) {
        console.error('❌ Error loading courses:', error);
        if (isMounted) {
          // Use mock data as fallback
          console.log('⚠️ Using mock data due to API error:', error.message);
          console.log('📊 Mock courses loaded:', mockCourses.length, 'courses');
          console.log('🚨 USING MOCK DATA - DRAG AND DROP WILL FAIL!');
          console.log(`❌ USING MOCK DATA: ${error.message} - Drag and drop will fail!`);
          setCourses(mockCourses);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Load courses immediately
    loadCourses();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {

    setRefreshing(true);
    try {
      let communityId = localStorage.getItem('communityId');

      // If no communityId found, use the same fallback as main course loading
      if (!communityId || communityId === 'null' || communityId === 'undefined') {
        communityId = '68bae2a8807f3a3bb8ac6307';
        console.log('🔧 Manual refresh: Using fallback community ID:', communityId);
      }

      // FORCE: Set the correct community ID in localStorage to fix the issue
      localStorage.setItem('communityId', '68bae2a8807f3a3bb8ac6307');
      console.log('🔧 FORCED: Set communityId in localStorage to:', '68bae2a8807f3a3bb8ac6307');

      console.log('🔄 Manual refresh: Loading courses for community:', communityId);
      console.log('🆕 UPDATED Manual refresh - Community ID fix applied!');

      const response = await courseApi.getCourses({ community: communityId });
      let coursesData = response.courses || [];

      console.log('📊 Manual refresh: Courses loaded:', coursesData.length, 'courses');

      const normalizedCourses = coursesData.map(course => ({
        _id: course._id || course.id,
        title: course.title || 'Untitled Course',
        description: course.description || '',
        category: course.category || 'Uncategorized',
        status: course.status || 'draft',
        instructor: course.instructor || 'Unknown',
        community: course.community || communityId,
        thumbnail: course.thumbnail || null,
        targetAudience: course.targetAudience || null,
        contentType: course.contentType || null,
        subType: course.subType || null,
        order: course.order || 0,
        createdAt: course.createdAt || new Date().toISOString(),
        updatedAt: course.updatedAt || new Date().toISOString()
      }));

      // Sort courses by order first, then by creation date
      normalizedCourses.sort((a, b) => {
        if (a.order !== b.order) {
          return (a.order || 0) - (b.order || 0);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setCourses(normalizedCourses);
      console.log('✅ Manual refresh: Courses updated successfully');
    } catch (error) {
      console.error('❌ Manual refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Course management functions
  const getCategoryColor = (category, isSecondary = false) => {
    const colors = {
      'Technology': isSecondary ? '#4f46e5' : '#3b82f6',
      'Design': isSecondary ? '#ec4899' : '#f59e0b',
      'Marketing': isSecondary ? '#ef4444' : '#dc2626',
      'Business': isSecondary ? '#10b981' : '#059669',
      'Health': isSecondary ? '#8b5cf6' : '#7c3aed',
      'Education': isSecondary ? '#06b6d4' : '#0891b2',
      'Finance': isSecondary ? '#f97316' : '#ea580c',
      'default': isSecondary ? '#6b7280' : '#4b5563'
    };
    return colors[category] || colors.default;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon />;
      case 'draft':
        return <WarningIcon />;
      case 'archived':
        return <ErrorIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const handleViewCourse = (course) => {
    // Navigate to course viewer using community-specific URL
    if (communityUrls) {
      navigate(communityUrls.courseViewer(course._id || course.id));
    } else {
      navigate(`/course-viewer/${course._id || course.id}`);
    }
  };

  const handleEditCourse = (course) => {
    // Navigate to edit course using community-specific URL
    if (communityUrls) {
      navigate(communityUrls.editCourse(course._id || course.id));
    } else {
      navigate(`/edit-course/${course._id || course.id}`);
    }
  };

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    setIsDeleting(true);
    try {
      // Delete course (soft delete - archived in backend)
      await courseApi.deleteCourse(courseToDelete._id || courseToDelete.id);

      // Update local state - remove from visible courses (they're now archived)
      setCourses(prev => prev.filter(course => (course._id || course.id) !== (courseToDelete._id || courseToDelete.id)));

      console.log('Course deleted successfully');
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drag and drop handler
  const handleDragEnd = async (event) => {
    console.log('🔄 Drag ended:', event);
    const { active, over } = event;

    if (!over || active.id === over.id) {
      console.log('❌ No valid drop or same position');
      return;
    }

    console.log('✅ Valid drag operation:', { from: active.id, to: over.id });

    // Find the indices of the dragged items in the filtered courses
    const oldIndex = filteredCourses.findIndex(course => course._id === active.id);
    const newIndex = filteredCourses.findIndex(course => course._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      console.log('❌ Could not find course indices');
      return;
    }

    // Create new course order based on filtered courses
    const newFilteredCourses = arrayMove(filteredCourses, oldIndex, newIndex);

    // Create a map of the new order from filtered courses
    const newOrderMap = new Map();
    newFilteredCourses.forEach((course, index) => {
      newOrderMap.set(course._id, index + 1);
    });

    // Update the courses state with new order
    setCourses(prevCourses => {
      // Update all courses with their new order
      return prevCourses.map(course => {
        const newOrder = newOrderMap.get(course._id);
        if (newOrder !== undefined) {
          return { ...course, order: newOrder };
        }
        return course;
      }).sort((a, b) => {
        // Sort by order first, then by creation date
        if (a.order !== b.order) {
          return (a.order || 0) - (b.order || 0);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });

    // Save the new order to the backend
    setIsReordering(true);
    setReorderError(null);
    
    try {
      const communityId = localStorage.getItem('communityId') || '68bae2a8807f3a3bb8ac6307';
      
      // Create course order array with all courses in the community, not just filtered ones
      const allCommunityCourses = courses.filter(course => 
        course.community === communityId || 
        (course.community && course.community._id === communityId)
      );
      
      // Apply the new order to all community courses
      const courseOrder = allCommunityCourses.map(course => {
        const newOrder = newOrderMap.get(course._id);
        return {
          id: course._id,
          _id: course._id,
          title: course.title,
          order: newOrder || course.order || 0
        };
      }).sort((a, b) => a.order - b.order);

      console.log('🚀 Sending reorder request:', {
        courseOrder,
        communityId,
        courseCount: courseOrder.length,
        sampleCourseId: courseOrder[0]?.id,
        allCourseIds: courseOrder.map(c => c.id)
      });

      const result = await courseApi.reorderCourses(courseOrder, communityId);
      console.log('✅ Reorder API response:', result);

      console.log('✅ Course order saved to backend:', {
        courseId: active.id,
        from: oldIndex,
        to: newIndex,
        newOrder: courseOrder
      });

    } catch (error) {
      console.error('❌ Failed to save course order:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        response: error.response,
        stack: error.stack
      });
      
      setReorderError(error.message || 'Failed to save course order');
      
      // Revert the local state change if backend save fails
      setCourses(prevCourses => {
        // Reload courses from server to get the correct order
        handleRefresh();
        return prevCourses;
      });

    } finally {
      setIsReordering(false);
    }
  };

  // Sortable Course Item Component
  const SortableCourseItem = ({ course, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: course._id || course.id });

    // Debug logging (only log when drag mode changes)
    if (isDragDisabled === false) {
      console.log('🎯 Drag Mode Enabled for:', course.title);
    }

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Grid
        item
        size={{ xs: 12, sm: 6, md: 6, lg: 4 }}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(isDragDisabled ? {} : listeners)}
      >
        <Card sx={{
          cursor: isDragDisabled ? 'pointer' : 'grab',
          background: darkMode ? '#2d2d2d' : '#ffffff',
          border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
          borderRadius: 3,
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          height: '100%', // Fixed height for consistent alignment
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover': {
            transform: isDragDisabled ? 'translateY(-2px)' : 'none',
            boxShadow: isDragDisabled ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)'
          },
          '&:active': {
            cursor: isDragDisabled ? 'pointer' : 'grabbing'
          }
        }}
          onClick={isDragDisabled ? () => handleViewCourse(course) : undefined}
        >

          {/* Drag Handle Indicator - Show when reorder mode is ON */}
          {!isDragDisabled && (
            <Box
              sx={{
                position: 'absolute',
                top: 25,
                left: 25,
                zIndex: 10,
                backgroundColor: 'rgba(15, 60, 96, 0.9)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                pointerEvents: 'none' // Don't interfere with card dragging
              }}
            >
              <DragIndicatorIcon fontSize="small" />
            </Box>
          )}

          {/* View Button - Only show when reorder mode is ON */}
          {!isDragDisabled && (
            <Button
              variant="contained"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleViewCourse(course);
              }}
              sx={{
                position: 'absolute',
                top: 25,
                left: 65,
                zIndex: 10,
                backgroundColor: 'rgba(15, 60, 96, 0.9)',
                color: 'white',
                minWidth: 'auto',
                padding: '4px 8px',
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: 'rgba(15, 60, 96, 1)'
                }
              }}
            >
              View
            </Button>
          )}

          {/* Reorder Mode Indicator */}
          {!isDragDisabled && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 15,
                zIndex: 10,
                backgroundColor: 'rgba(76, 175, 80, 0.9)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: 1,
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}
            >
              DRAG TO REORDER
            </Box>
          )}
          <Box padding={2} position="relative" >
            {/* Thumbnail Image */}
            {course.thumbnail && course.thumbnail.trim() !== '' ? (
              <img
                src={(() => {
                  // If it's a data URL, use it directly
                  if (course.thumbnail.startsWith('data:')) {
                    return course.thumbnail;
                  }

                  // If it's already a full URL (http/https), use it directly
                  if (course.thumbnail.startsWith('http')) {
                    return course.thumbnail;
                  }

                  // If it's a localhost URL, replace with production URL
                  if (course.thumbnail.includes('localhost')) {
                    const filename = course.thumbnail.split('/').pop();
                    return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${filename}`;
                  }

                  // If it starts with /uploads, construct the full URL
                  if (course.thumbnail.startsWith('/uploads/')) {
                    return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}${course.thumbnail}`;
                  }

                  // Fallback: assume it's just a filename
                  return `${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/uploads/${course.thumbnail}`;
                })()}
                alt={course.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  borderRadius: 10
                }}
                onError={(e) => {
                  const fallbackAttempts = e.target.dataset.fallbackAttempts || '0';
                  const attempts = parseInt(fallbackAttempts);

                  if (attempts === 0) {
                    e.target.dataset.fallbackAttempts = '1';
                    if (course.thumbnail && !course.thumbnail.startsWith('data:') && !course.thumbnail.startsWith('http')) {
                      e.target.src = `https://saas-lms-admin-1.onrender.com/uploads/${course.thumbnail}`;
                    } else {
                      e.target.src = `https://via.placeholder.com/400x200/4285f4/ffffff?text=${encodeURIComponent(course.title)}`;
                    }
                  } else if (attempts === 1) {
                    e.target.dataset.fallbackAttempts = '2';
                    e.target.src = `https://via.placeholder.com/400x200/4285f4/ffffff?text=${encodeURIComponent(course.title)}`;
                  } else {
                    e.target.style.display = 'none';
                    const existingFallback = e.target.parentNode.querySelector('.thumbnail-fallback');
                    if (!existingFallback) {
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'thumbnail-fallback';
                      fallbackDiv.style.cssText = `
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                  color: white;
                  font-weight: bold;
                  font-size: 18px;
                  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
                `;
                      fallbackDiv.textContent = course.title.charAt(0).toUpperCase();
                      e.target.parentNode.appendChild(fallbackDiv);
                    }
                  }
                }}
                onLoad={(e) => {
                  console.log('✅ Thumbnail loaded successfully for course:', course.title);
                  const fallback = e.target.parentElement.querySelector('.thumbnail-fallback');
                  if (fallback) fallback.style.display = 'none';
                }}
              />
            ) : null}
            <Box
                                className="hover-actions"
                                sx={{
                                  position: 'absolute',
                                  top: 25,
                                  right: 25,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 1,
                                  transition: 'opacity 0.3s ease'
                                }}
                              >
                                {/* View */}
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCourse(course);
                                  }}
                                  sx={{
                                    backgroundColor: '#0F3C60',
                                    color: '#ffffff',
                                    width: 44,
                                    height: 44,
                                    '&:hover': { backgroundColor: '#0c2e4a' }
                                  }}
                                >
                                  <VisibilityIcon />
                                </IconButton>

                                {/* Edit */}
                                {!isCommunityUser && (
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditCourse(course);
                                    }}
                                    sx={{
                                      backgroundColor: '#F2B700',
                                      color: '#ffffff',
                                      width: 44,
                                      height: 44,
                                      '&:hover': { backgroundColor: '#d9a300' }
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                )}

                                {/* Delete */}
                                {!isCommunityUser && (
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCourse(course);
                                    }}
                                    sx={{
                                      backgroundColor: '#E53935',
                                      color: '#ffffff',
                                      width: 44,
                                      height: 44,
                                      '&:hover': { backgroundColor: '#c62828' }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Box>

            {/* Course Thumbnail */}

            <Box
              className="thumbnail-fallback"
              sx={{
                display: (course.thumbnail && course.thumbnail.trim() !== '') ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${getCategoryColor(course.category)} 0%, ${getCategoryColor(course.category, true)} 100%)`
              }}
            >
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <VideoIcon sx={{ fontSize: 48, color: darkMode ? '#666' : '#999' }} />
              )}
            </Box>

            {/* Course Content */}
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 , pt: 2}}>
              <Box sx={{ flex: 1 }}>
                {/* Course Title */}
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: darkMode ? '#ffffff' : '#000000',
                  // lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textTransform: 'uppercase'

                }}>
                  {course.title}
                </Typography>

                {/* Course Tags - Fixed Layout */}
                <Box sx={{
                  // mb: 2,
                  minHeight: '64px', // Fixed height for 2 rows of tags
                  maxHeight: '64px',
                  overflow: 'hidden'
                }}>
                  {/* First Row - Primary Tags */}
                  <Box sx={{
                    display: 'flex',
                    gap: 0.5,
                    mb: 0.5,
                    overflow: 'hidden'
                  }}>
                    {/* Target Audience Tag */}
                    {course.targetAudience && (
                      <Chip
                        label={course.targetAudience}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          height: 24,
                          fontWeight: 500,
                          borderColor: '#EF4444',
                          color: '#fff',
                          backgroundColor: '#EF4444',
                          borderRadius: 2,
                          maxWidth: '120px',
                          '& .MuiChip-label': {
                            px: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          },
                        }}
                      />
                    )}

                    {/* Course Type Tag */}
                    {course.contentType && (
                      <Chip
                        label={course.contentType === 'video' ? 'Video' : 'Text'}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          height: 24,
                          fontWeight: 500,
                          borderColor: course.contentType === 'video' ? '#E8B931' : '#10b981',
                          color: course.contentType === 'video' ? '#fff' : '#10b981',
                          backgroundColor: course.contentType === 'video' ? '#E8B931' : '#10b98115',
                          borderRadius: 2,
                          '& .MuiChip-label': {
                            px: 1
                          },
                        }}
                      />
                    )}
                  </Box>

                  {/* Second Row - Category Tag */}
                  <Box sx={{
                    display: 'flex',
                    gap: 0.5,
                    overflow: 'hidden'
                  }}>
                    {/* Category Tag */}
                    {course.category && (
                      <Chip
                        label={course.category}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          height: 24,
                          fontWeight: 500,
                          borderColor: '#0F3C60',
                          color: '#ffffff',
                          backgroundColor: '#0F3C60',
                          borderRadius: 2,
                          maxWidth: '200px',
                          '& .MuiChip-label': {
                            px: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          },
                        }}
                      />
                    )}

                    {/* Sub Type Tag */}
                    {course.subType && (
                      <Chip
                        label={course.subType}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          height: 24,
                          fontWeight: 500,
                          borderColor: '#0F3C60',
                          color: '#ffffff',
                          backgroundColor: '#0F3C60',
                          borderRadius: 2,
                          maxWidth: '120px',
                          '& .MuiChip-label': {
                            px: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          },
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Course Description */}
                <Typography variant="body2" sx={{
                  color: 'text.secondary',
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.4,
                  minHeight: '2.8em', // Ensure consistent height for 2 lines
                  maxHeight: '2.8em'  // Prevent expansion beyond 2 lines
                }}>
                  {course.description || 'No description available'}
                </Typography>
                <Box sx={{
                  flexShrink: 0, // Prevent this section from shrinking
                  mt: 'auto' // Push to bottom
                }}>
                  {/* Course Meta */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // px: 1.5,
                    // backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    // borderRadius: 1.5,
                    // border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
                  }}>
                    <Typography variant="body2" sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: '0.8rem'
                    }}>
                      By {(() => {
                        // If instructor is a long ID (MongoDB ObjectId), show community name
                        if (course.instructor && course.instructor.length > 20) {
                          const community = communityAuthApi.getCurrentCommunity();
                          return community ? community.name : 'Community Admin';
                        }
                        // Otherwise show the instructor name
                        return course.instructor || 'Unknown';
                      })()}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#0F3C60',
                      fontWeight: 500,
                      fontSize: '14px'
                    }}>
                      {new Date(course.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      gap: 2,
                                      mt: 1,
                                      pb: 1
                                    }}
                                  >
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewCourse(course);
                                      }}
                                      sx={{
                                        backgroundColor: '#0F3C60',
                                        color: '#ffffff',
                                        width: 56,
                                        height: 56,
                                        '&:hover': { backgroundColor: '#0c2e4a' }
                                      }}
                                    >
                                      <VisibilityIcon />
                                    </IconButton>

                                    {!isCommunityUser && (
                                      <IconButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditCourse(course);
                                        }}
                                        sx={{
                                          backgroundColor: '#F2B700',
                                          color: '#ffffff',
                                          width: 56,
                                          height: 56,
                                          '&:hover': { backgroundColor: '#d9a300' }
                                        }}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    )}

                                    {!isCommunityUser && (
                                      <IconButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCourse(course);
                                        }}
                                        sx={{
                                          backgroundColor: '#E53935',
                                          color: '#ffffff',
                                          width: 56,
                                          height: 56,
                                          '&:hover': { backgroundColor: '#c62828' }
                                        }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    )}
                                  </Box> */}

                </Box>
              </Box>
            </CardContent>
          </Box>
          
        </Card>
      </Grid>
    );
  };

  // Filter helper functions
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      types: [],
      categories: [],
      audiences: []
    });
  };

  const getActiveFiltersCount = () => {
    return selectedFilters.types.length + selectedFilters.categories.length + selectedFilters.audiences.length;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownOpen && !event.target.closest('.filter-dropdown')) {
        console.log('Clicking outside, closing dropdown');
        setFilterDropdownOpen(false);
      }
    };

    if (filterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterDropdownOpen]);

  // Filter courses based on search and selected filters (always exclude archived courses)
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if any filters are selected, if not, show all courses
    const hasTypeFilters = selectedFilters.types.length > 0;
    const hasCategoryFilters = selectedFilters.categories.length > 0;
    const hasAudienceFilters = selectedFilters.audiences.length > 0;

    const matchesType = !hasTypeFilters || selectedFilters.types.includes(course.contentType);
    const matchesCategory = !hasCategoryFilters || selectedFilters.categories.includes(course.category);
    const matchesAudience = !hasAudienceFilters || selectedFilters.audiences.includes(course.targetAudience);

    // Always exclude archived courses from listing
    const isNotArchived = course.status !== 'archived';

    return matchesSearch && matchesType && matchesCategory && matchesAudience && isNotArchived;
  });


  // if (loading) {
  //   return (
  //     <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
  //       <CircularProgress />
  //       <Typography sx={{ mt: 2 }}>Loading courses...</Typography>
  //     </Box>
  //   );
  // }

  return (
    <Box className="bg-black">
      {/* Common Focused Sidebar */}
      <FocusedSidebar darkMode={darkMode} />

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        ml: getMainContentMargin(), // responsive margin from context
        mt: 9, // Account for fixed top bar (70px height) + padding
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Common Focused Top Bar */}
        <FocusedTopBar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Main Content */}
        <Box sx={{ flex: 1, px: 1, py: 4, overflow: 'visible' }}>
          <Container maxWidth="xl" sx={{ overflow: 'visible' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress size={30} />
                <Typography sx={{ ml: 2 }}>Loading...</Typography>
              </Box>
            ) : (
              <Box>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  {/* <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.5rem' } }}>
                      Bell n Desk - {isCommunityUser ? 'Available Courses' : 'My Courses'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {isCommunityUser 
                        ? `Browse and enroll in courses (${courses.length} courses available)`
                        : `Manage and track all your created courses (${courses.length} courses)`
                      }
                    </Typography>
                  </Box> */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Drag Mode Toggle - Only show for admins */}
                    {!isCommunityUser && (
                      <Tooltip
                        title={isDragDisabled
                          ? "Click to enable drag & drop reordering"
                          : "Click to disable drag & drop reordering"
                        }
                        arrow
                      >
                        <Button
                          variant={isDragDisabled ? "outlined" : "contained"}
                          onClick={() => {
                            console.log('🔄 Toggling drag mode from', isDragDisabled, 'to', !isDragDisabled);
                            setIsDragDisabled(!isDragDisabled);
                            setReorderError(null); // Clear any previous errors
                          }}
                          startIcon={<DragIndicatorIcon />}
                          disabled={isReordering}
                          sx={{
                            background: isDragDisabled ? 'transparent' : '#0F3C60',
                            borderColor: '#0F3C60',
                            color: isDragDisabled ? '#0F3C60' : 'white',
                            '&:hover': {
                              background: isDragDisabled ? 'rgba(15, 60, 96, 0.1)' : '#30648e',
                              borderColor: '#0F3C60'
                            },
                            '&:disabled': {
                              opacity: 0.6
                            }
                          }}
                        >
                          {isDragDisabled ? 'Reorder Mode: OFF' : 'Reorder Mode: ON'}
                        </Button>
                      </Tooltip>
                    )}
                    
                    {/* Reordering Status */}
                    {isReordering && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" sx={{ color: '#0F3C60', fontWeight: 500 }}>
                          Saving order...
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Reorder Error */}
                    {reorderError && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ErrorIcon sx={{ color: '#E53935', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#E53935', fontWeight: 500 }}>
                          {reorderError}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setReorderError(null)}
                          sx={{ color: '#E53935' }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton
                      onClick={handleRefresh}
                      disabled={refreshing}
                      sx={{
                        background: '#0F3C60',
                        color: '#fff',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#30648e' }
                      }}
                      title="Refresh courses"
                    >
                      <RefreshIcon sx={{
                        animation: refreshing ? 'spin 1s linear infinite' : 'none',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} />
                    </IconButton>
                    {!isCommunityUser && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          if (communityUrls) {
                            navigate(communityUrls.createCourse);
                          } else {
                            navigate('/create-course');
                          }
                        }}
                        sx={{
                          background: '#0F3C60',
                        }}
                      >
                        Create New Course
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                      sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        background: 'linear-gradient(45deg, #ffffff 30%, #edf3ff 90%)',
                        borderRadius: 3,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: '#e8f0fe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <VideoIcon sx={{ color: '#0F3C60' }} />
                        </Box>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F3C60', mb: 0 }}>
                            {courses.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Courses
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                      sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        background: 'linear-gradient(45deg, #ffffff 30%, #e9fbea 90%)',
                        borderRadius: 3,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: '#e6f4ea',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckCircleIcon sx={{ color: '#34a853' }} />
                        </Box>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#34a853', mb: 0 }}>
                            {courses.filter(c => c.status === 'published').length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Published
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                      sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        background: 'linear-gradient(45deg, #ffffff 30%, #fff9e5 90%)',
                        borderRadius: 3,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: '#fef7e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <WarningIcon sx={{ color: '#fbbc04' }} />
                        </Box>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fbbc04', mb: 0 }}>
                            {courses.filter(c => c.status === 'draft').length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Drafts
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                      sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        background: 'linear-gradient(45deg, #ffffff 30%, #ffecec 90%)',
                        borderRadius: 3,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: '#fce8e6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PeopleIcon sx={{ color: '#ea4335' }} />
                        </Box>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#ea4335', mb: 0 }}>
                            {String(courses.reduce((total, course) => total + (course.students || 0), 0))}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Students
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid> */}


                {/* Filters and Search */}


                {/* Courses Grid */}
                <Box sx={{
                  '& .MuiGrid-container': {
                    margin: 0,
                    width: '100%'
                  },
                  '& .MuiGrid-item': {
                    padding: '12px !important'
                  },
                  overflow: 'visible'
                }}>
                  {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    {communityData?.name || 'My'} Courses ({filteredCourses.length})
                  </Typography> */}

                  <Card sx={{ mb: 1, background: darkMode ? '#2d2d2d' : 'transparent', boxShadow: 'none', border: "none", p: 0, overflow: 'visible' }}>
                    <CardContent sx={{ p: 0, overflow: 'visible' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ position: 'relative', overflow: 'visible' }} className="filter-dropdown">
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                              console.log('Filter button clicked, current state:', filterDropdownOpen);
                              setFilterDropdownOpen(!filterDropdownOpen);
                            }}
                            startIcon={<FilterIcon />}
                            endIcon={filterDropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            sx={{
                              height: '56px',
                              borderRadius: '12px',
                              border: '1px solid #0F3C60',
                              backgroundColor: '#ffffff',
                              color: '#0F3C60',
                              fontSize: '1rem',
                              fontWeight: 500,
                              textTransform: 'none',
                              justifyContent: 'center',
                              px: 3,
                              boxShadow: 'none',
                              '& .MuiSvgIcon-root': {
                                color: '#0F3C60'
                              },
                              '&:hover': {
                                backgroundColor: '#f7faff',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {/* <FilterIcon /> */}
                              <Typography variant="body1" sx={{ fontWeight: 500, color: '#0F3C60' }}>
                                Filters
                              </Typography>
                              {getActiveFiltersCount() > 0 && (
                                <Chip
                                  label={getActiveFiltersCount()}
                                  size="small"
                                  sx={{
                                    bgcolor: '#0F3C60',
                                    color: '#ffffff',
                                    fontSize: '0.75rem',
                                    height: '20px'
                                  }}
                                />
                              )}
                            </Box>
                          </Button>

                          {filterDropdownOpen && (
                            <Card sx={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              mt: 2,
                              zIndex: 99999,
                              background: darkMode ? '#2d2d2d' : '#ffffff',
                              border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                              borderRadius: 2,
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                              width: '250px',
                              maxHeight: '70vh',
                              overflow: 'auto',
                              filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.15))',
                              '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: -6,
                                left: 20,
                                width: 12,
                                height: 12,
                                bgcolor: darkMode ? '#2d2d2d' : '#ffffff',
                                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                                borderBottom: 'none',
                                borderRight: 'none',
                                transform: 'rotate(45deg)',
                                zIndex: 1,
                              },
                            }}>
                              <CardContent sx={{ p: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0F3C60', fontSize: '0.875rem' }}>
                                    Filters
                                  </Typography>
                                  <Button
                                    size="small"
                                    onClick={clearAllFilters}
                                    disabled
                                    sx={{
                                      color: '#9e9e9e',
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      minWidth: 'auto',
                                      px: 1
                                    }}
                                  >
                                    Clear
                                  </Button>
                                </Box>

                                <Box sx={{ mb: 1 }}>
                                  <ListItemButton
                                    onClick={() => toggleSection('types')}
                                    sx={{
                                      px: 1.5,
                                      py: 0.75,
                                      borderRadius: 1,
                                      mx: 0.5,
                                      my: 0.25,
                                      minHeight: 'auto',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: darkMode ? '#404040' : '#f5f5f5',
                                      }
                                    }}
                                  >
                                    <VideoIcon sx={{ mr: 1, color: '#0F3C60', fontSize: '1rem' }} />
                                    <ListItemText
                                      primary="Type of Course"
                                      sx={{
                                        '& .MuiTypography-root': {
                                          fontWeight: 500,
                                          fontSize: '0.875rem',
                                          color: darkMode ? '#ffffff' : '#333333'
                                        }
                                      }}
                                    />
                                    {expandedSections.types ? <ExpandLessIcon sx={{ fontSize: '1rem' }} /> : <ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
                                  </ListItemButton>
                                  <Collapse in={expandedSections.types}>
                                    <List sx={{ pl: 1, py: 0 }}>
                                      {[
                                        { value: 'vimeo', label: 'Vimeo' },
                                        { value: 'youtube', label: 'YouTube' },
                                        { value: 'loom', label: 'Loom' },
                                        { value: 'physical-video', label: 'Physical Video' },
                                        { value: 'text-based', label: 'Text Based' },
                                        { value: 'pdf-based', label: 'PDF Based' }
                                      ].map((type) => (
                                        <ListItem key={type.value} sx={{ py: 0, px: 0 }}>
                                          <ListItemButton
                                            disabled
                                            sx={{
                                              px: 1.5,
                                              py: 0.5,
                                              borderRadius: 1,
                                              mx: 0.5,
                                              my: 0.125,
                                              minHeight: 'auto',
                                              transition: 'all 0.2s ease',
                                              '&:hover': {
                                                backgroundColor: 'transparent',
                                              },
                                              '&.Mui-disabled': {
                                                opacity: 0.6
                                              }
                                            }}
                                          >
                                            <Checkbox
                                              checked={false}
                                              disabled
                                              size="small"
                                              sx={{
                                                color: '#0F3C60',
                                                p: 0.5,
                                                '&.Mui-checked': { color: '#0F3C60' },
                                                '&.Mui-disabled': { color: '#9e9e9e' }
                                              }}
                                            />
                                            <ListItemText
                                              primary={type.label}
                                              sx={{
                                                '& .MuiTypography-root': {
                                                  fontSize: '0.8rem',
                                                  color: darkMode ? '#ffffff' : '#333333'
                                                }
                                              }}
                                            />
                                          </ListItemButton>
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Collapse>
                                </Box>

                                {/* Category Section */}
                                <Box sx={{ mb: 1 }}>
                                  <ListItemButton
                                    onClick={() => toggleSection('categories')}
                                    sx={{
                                      px: 1.5,
                                      py: 0.75,
                                      borderRadius: 1,
                                      mx: 0.5,
                                      my: 0.25,
                                      minHeight: 'auto',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: darkMode ? '#404040' : '#f5f5f5',
                                      }
                                    }}
                                  >
                                    <StarIcon sx={{ mr: 1, color: '#0F3C60', fontSize: '1rem' }} />
                                    <ListItemText
                                      primary="Category"
                                      sx={{
                                        '& .MuiTypography-root': {
                                          fontWeight: 500,
                                          fontSize: '0.875rem',
                                          color: darkMode ? '#ffffff' : '#333333'
                                        }
                                      }}
                                    />
                                    {expandedSections.categories ? <ExpandLessIcon sx={{ fontSize: '1rem' }} /> : <ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
                                  </ListItemButton>
                                  <Collapse in={expandedSections.categories}>
                                    <List sx={{ pl: 1, py: 0 }}>
                                      {CRYPTO_CATEGORIES.map((category) => (
                                        <ListItem key={category.value} sx={{ py: 0, px: 0 }}>
                                          <ListItemButton
                                            disabled
                                            sx={{
                                              px: 1.5,
                                              py: 0.5,
                                              borderRadius: 1,
                                              mx: 0.5,
                                              my: 0.125,
                                              minHeight: 'auto',
                                              transition: 'all 0.2s ease',
                                              '&:hover': {
                                                backgroundColor: 'transparent',
                                              },
                                              '&.Mui-disabled': {
                                                opacity: 0.6
                                              }
                                            }}
                                          >
                                            <Checkbox
                                              checked={false}
                                              disabled
                                              size="small"
                                              sx={{
                                                color: '#0F3C60',
                                                p: 0.5,
                                                '&.Mui-checked': { color: '#0F3C60' },
                                                '&.Mui-disabled': { color: '#9e9e9e' }
                                              }}
                                            />
                                            <ListItemText
                                              primary={category.label}
                                              sx={{
                                                '& .MuiTypography-root': {
                                                  fontSize: '0.8rem',
                                                  color: darkMode ? '#ffffff' : '#333333'
                                                }
                                              }}
                                            />
                                          </ListItemButton>
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Collapse>
                                </Box>

                                {/* Target Audience Section */}
                                <Box sx={{ mb: 0.5 }}>
                                  <ListItemButton
                                    onClick={() => toggleSection('audiences')}
                                    sx={{
                                      px: 1.5,
                                      py: 0.75,
                                      borderRadius: 1,
                                      mx: 0.5,
                                      my: 0.25,
                                      minHeight: 'auto',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: darkMode ? '#404040' : '#f5f5f5',
                                      }
                                    }}
                                  >
                                    <PeopleIcon sx={{ mr: 1, color: '#0F3C60', fontSize: '1rem' }} />
                                    <ListItemText
                                      primary="Target Audience"
                                      sx={{
                                        '& .MuiTypography-root': {
                                          fontWeight: 500,
                                          fontSize: '0.875rem',
                                          color: darkMode ? '#ffffff' : '#333333'
                                        }
                                      }}
                                    />
                                    {expandedSections.audiences ? <ExpandLessIcon sx={{ fontSize: '1rem' }} /> : <ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
                                  </ListItemButton>
                                  <Collapse in={expandedSections.audiences}>
                                    <List sx={{ pl: 1, py: 0 }}>
                                      {[
                                        { value: 'beginner', label: 'Beginner' },
                                        { value: 'intermediate', label: 'Intermediate' },
                                        { value: 'advanced', label: 'Advanced' },
                                        { value: 'professional', label: 'Professional' },
                                        { value: 'student', label: 'Student' },
                                        { value: 'investor', label: 'Investor' },
                                        { value: 'developer', label: 'Developer' }
                                      ].map((audience) => (
                                        <ListItem key={audience.value} sx={{ py: 0, px: 0 }}>
                                          <ListItemButton
                                            disabled
                                            sx={{
                                              px: 1.5,
                                              py: 0.5,
                                              borderRadius: 1,
                                              mx: 0.5,
                                              my: 0.125,
                                              minHeight: 'auto',
                                              transition: 'all 0.2s ease',
                                              '&:hover': {
                                                backgroundColor: 'transparent',
                                              },
                                              '&.Mui-disabled': {
                                                opacity: 0.6
                                              }
                                            }}
                                          >
                                            <Checkbox
                                              checked={false}
                                              disabled
                                              size="small"
                                              sx={{
                                                color: '#0F3C60',
                                                p: 0.5,
                                                '&.Mui-checked': { color: '#0F3C60' },
                                                '&.Mui-disabled': { color: '#9e9e9e' }
                                              }}
                                            />
                                            <ListItemText
                                              primary={audience.label}
                                              sx={{
                                                '& .MuiTypography-root': {
                                                  fontSize: '0.8rem',
                                                  color: darkMode ? '#ffffff' : '#333333'
                                                }
                                              }}
                                            />
                                          </ListItemButton>
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Collapse>
                                </Box>
                              </CardContent>
                            </Card>
                          )}
                        </Box>
                        <Box sx={{ justifyContent: 'flex-end' }}>
                          <TextField
                            fullWidth
                            placeholder="Search through your courses, categories, and descriptions..."
                            value={searchTerm}
                            size='medium'
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 5,
                                background: darkMode
                                  ? 'rgba(255, 255, 255, 0.05)'
                                  : 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                borderColor: ' #0F3C60',
                                lg: {
                                  width: '600px',
                                },
                                height: '56px',
                                '&.Mui-focused': {
                                  borderColor: ' #0F3C60',
                                },
                                '&.hover': {
                                  borderColor: ' #0F3C60',
                                }
                              },
                              '& .MuiInputBase-input': {
                                color: darkMode ? '#ffffff' : '#333333',
                                fontSize: '1rem',
                                fontWeight: 500,
                                padding: '16px 16px',
                                '&::placeholder': {
                                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                  opacity: 1,
                                  fontSize: '1rem',
                                  fontWeight: 400,
                                }
                              }
                            }}
                            InputProps={{
                              startAdornment: (
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mr: 2,
                                  ml: 1
                                }}>
                                  <SearchIcon sx={{
                                    fontSize: '1.5rem',
                                    color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                                  }} />
                                </Box>
                              )
                            }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>



                  {filteredCourses.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        No courses found
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3 }}>
                        {searchTerm || getActiveFiltersCount() > 0
                          ? 'Try adjusting your search or filters'
                          : 'Create your first course to get started'
                        }
                      </Typography>
                      {!searchTerm && getActiveFiltersCount() === 0 && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            if (communityUrls) {
                              navigate(communityUrls.createCourse);
                            } else {
                              navigate('/create-course');
                            }
                          }}
                        >
                          Create First Course
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={filteredCourses.map(course => course._id || course.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <Grid
                          container
                          spacing={3}
                          sx={{
                            justifyContent: 'flex-start',
                            backgroundColor: !isDragDisabled
                              ? 'rgba(15, 60, 96, 0.02)'
                              : 'transparent',
                            borderRadius: 2,
                            transition: 'background-color 0.2s ease',
                            border: !isDragDisabled ? '2px dashed rgba(15, 60, 96, 0.2)' : 'none',
                            padding: !isDragDisabled ? '8px' : '0px'
                          }}
                        >
                          {filteredCourses.map((course, index) => (
                            <SortableCourseItem
                              key={course._id || course.id}
                              course={course}
                              index={index}
                            />
                          ))}
                        </Grid>
                      </SortableContext>
                    </DndContext>
                  )}
                </Box>
              </Box>
            )}

            {/* Course Details Dialog */}
            <Dialog
              open={openCourseDialog}
              onClose={() => setOpenCourseDialog(false)}
              maxWidth="md"
              fullWidth
            >
              {selectedCourse && (
                <Box sx={{
                  p: 3
                }}>
                  <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 2
                  }}>
                    <Typography variant="h5" sx={{
                      fontWeight: 600,
                      color: darkMode ? '#ffffff' : '#333'
                    }}>
                      {selectedCourse.title}
                    </Typography>
                    <IconButton
                      onClick={() => setOpenCourseDialog(false)}
                      sx={{
                        color: darkMode ? '#ffffff' : '#666'
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>

                  <DialogContent>
                    <Box sx={{ mb: 3 }}>
                      {selectedCourse.thumbnail && (
                        <Box sx={{
                          width: '100%',
                          height: 200,
                          mb: 2,
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          <img
                            src={selectedCourse.thumbnail}
                            alt={selectedCourse.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      )}

                      <Typography variant="body1" sx={{
                        color: darkMode ? '#cccccc' : '#666',
                        mb: 2,
                        lineHeight: 1.6
                      }}>
                        {selectedCourse.description || 'No description available'}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Chip
                          label={selectedCourse.category || 'Uncategorized'}
                          sx={{
                            backgroundColor: darkMode ? '#404040' : '#e3f2fd',
                            color: darkMode ? '#ffffff' : '#1976d2'
                          }}
                        />
                        <Chip
                          label={selectedCourse.status || 'draft'}
                          sx={{
                            backgroundColor: selectedCourse.status === 'published'
                              ? (darkMode ? '#2e7d32' : '#e8f5e8')
                              : (darkMode ? '#424242' : '#f5f5f5'),
                            color: selectedCourse.status === 'published'
                              ? (darkMode ? '#4caf50' : '#2e7d32')
                              : (darkMode ? '#ffffff' : '#666'),
                            textTransform: 'capitalize'
                          }}
                        />
                      </Box>
                    </Box>
                  </DialogContent>

                  <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      onClick={() => setOpenCourseDialog(false)}
                      sx={{
                        color: darkMode ? '#ffffff' : '#666'
                      }}
                    >
                      Close
                    </Button>
                    {!isCommunityUser && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          setOpenCourseDialog(false);
                          handleEditCourse(selectedCourse);
                        }}
                        sx={{
                          backgroundColor: '#0F3C60',
                          '&:hover': {
                            backgroundColor: '#30648e'
                          }
                        }}
                      >
                        Edit Course
                      </Button>
                    )}
                  </DialogActions>
                </Box>
              )}
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={deleteDialogOpen}
              onClose={cancelDelete}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Delete Course</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelDelete}>Cancel</Button>
                <Button
                  onClick={confirmDelete}
                  color="error"
                  variant="contained"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Courses;
