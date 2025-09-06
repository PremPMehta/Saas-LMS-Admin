import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Tooltip
} from '@mui/material'; 
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  VideoLibrary as VideoIcon,
  Description as TextIcon,
  CheckCircle as CheckIcon,
  Circle as CircleIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  FlashOn as FlashIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Chat as ChatIcon,
  WbSunny as SunIcon,
  DarkMode as DarkIcon,
  VideoLibrary as VideoLibraryIcon,
  Description as DescriptionIcon,
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityUrls } from '../utils/communityUrlUtils';
import FocusedSidebar from '../components/FocusedSidebar';
import FocusedTopBar from '../components/FocusedTopBar';



const CourseViewer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { courseId, communityName } = useParams();

  // Get community-specific URLs
  const communityUrls = communityName ? getCommunityUrls(communityName) : null;

  // State management
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [activeLectureId, setActiveLectureId] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('courses');
  
  // PDF state
  const [pdfLoading, setPdfLoading] = useState(false);

  // Mock data for testing with 3-4 videos per lecture
  const mockCourses = [
    {
      _id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and become a full-stack developer',
      thumbnail: 'https://via.placeholder.com/300x200/4285f4/ffffff?text=Web+Dev',
      status: 'published',
      chapters: [
        {
          _id: '1-1',
          title: 'HTML Fundamentals',
          videos: [
            {
              _id: '1-1-1',
              title: 'Introduction to HTML',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              description: 'Learn the basics of HTML structure and elements.',
              duration: '15:30',
              completed: false
            },
            {
              _id: '1-1-2',
              title: 'HTML Elements and Tags',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
              description: 'Understanding different HTML elements and their usage.',
              duration: '20:45',
              completed: false
            },
            {
              _id: '1-1-3',
              title: 'Forms and Input Elements',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
              description: 'Creating interactive forms with various input types.',
              duration: '25:10',
              completed: false
            },
            {
              _id: '1-1-4',
              title: 'Semantic HTML',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
              description: 'Using semantic HTML for better accessibility and SEO.',
              duration: '18:20',
              completed: false
            },
            {
              _id: '1-1-5',
              title: 'HTML Best Practices',
              type: 'TEXT',
              content: `<h2>HTML Best Practices</h2>
<p>Here are some essential HTML best practices to follow:</p>
<ul>
<li><strong>Use semantic elements:</strong> Choose the right HTML element for the job</li>
<li><strong>Write clean, readable code:</strong> Proper indentation and formatting</li>
<li><strong>Include alt attributes:</strong> Always add alt text to images</li>
<li><strong>Validate your HTML:</strong> Use W3C validator to check your code</li>
<li><strong>Optimize for accessibility:</strong> Use proper heading hierarchy</li>
</ul>
<p>Following these practices will make your HTML more maintainable and accessible.</p>`,
              description: 'Learn the best practices for writing clean and semantic HTML code.',
              duration: '15:00',
              completed: false
            }
          ]
        },
        {
          _id: '1-2',
          title: 'CSS Styling',
          videos: [
            {
              _id: '1-2-1',
              title: 'CSS Basics and Selectors',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=1PnVor36_40',
              description: 'Introduction to CSS and different types of selectors.',
              duration: '22:15',
              completed: false
            },
            {
              _id: '1-2-2',
              title: 'Box Model and Layout',
              type: 'VIDEO',
              content: 'https://www.youtube.com/watch?v=Wm6CUkswsNw',
              description: 'Understanding CSS box model and layout properties.',
              duration: '28:30',
              completed: false
            },
            {
              _id: '1-2-3',
              title: 'Flexbox Layout',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Mastering CSS Flexbox for responsive layouts.',
              duration: '32:45',
              completed: false
            },
            {
              _id: '1-2-4',
              title: 'CSS Grid System',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Creating complex layouts with CSS Grid.',
              duration: '35:20',
              completed: false
            }
          ]
        },
        {
          _id: '1-3',
          title: 'JavaScript Programming',
          videos: [
            {
              _id: '1-3-1',
              title: 'JavaScript Fundamentals',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Variables, data types, and basic JavaScript syntax.',
              duration: '30:10',
              completed: false
            },
            {
              _id: '1-3-2',
              title: 'Functions and Scope',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Understanding functions, parameters, and scope in JavaScript.',
              duration: '25:45',
              completed: false
            },
            {
              _id: '1-3-3',
              title: 'DOM Manipulation',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Interacting with the Document Object Model.',
              duration: '28:30',
              completed: false
            },
            {
              _id: '1-3-4',
              title: 'ES6+ Features',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Modern JavaScript features like arrow functions, destructuring, and modules.',
              duration: '33:15',
              completed: false
            }
          ]
        }
      ]
    },
    {
      _id: '2',
      title: 'React.js Masterclass',
      description: 'Master React.js with hooks, context, and modern development practices',
      thumbnail: 'https://via.placeholder.com/300x200/ea4335/ffffff?text=React',
      status: 'published',
      chapters: [
        {
          _id: '2-1',
          title: 'React Basics',
          videos: [
            {
              _id: '2-1-1',
              title: 'What is React?',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Introduction to React and its core concepts.',
              duration: '20:30',
              completed: false
            },
            {
              _id: '2-1-2',
              title: 'Components and JSX',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Creating React components and understanding JSX syntax.',
              duration: '25:45',
              completed: false
            },
            {
              _id: '2-1-3',
              title: 'Props and State',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Managing component data with props and state.',
              duration: '30:20',
              completed: false
            },
            {
              _id: '2-1-4',
              title: 'Event Handling',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Handling user interactions and events in React.',
              duration: '22:15',
              completed: false
            }
          ]
        },
        {
          _id: '2-2',
          title: 'React Hooks',
          videos: [
            {
              _id: '2-2-1',
              title: 'useState Hook',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Managing state in functional components with useState.',
              duration: '28:40',
              completed: false
            },
            {
              _id: '2-2-2',
              title: 'useEffect Hook',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Handling side effects and lifecycle events with useEffect.',
              duration: '32:15',
              completed: false
            },
            {
              _id: '2-2-3',
              title: 'useContext Hook',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Sharing data across components with Context API.',
              duration: '26:30',
              completed: false
            },
            {
              _id: '2-2-4',
              title: 'Custom Hooks',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Creating reusable custom hooks for common functionality.',
              duration: '29:45',
              completed: false
            },
            {
              _id: '2-2-5',
              title: 'Hooks Best Practices',
              type: 'TEXT',
              content: `<h2>React Hooks Best Practices</h2>
<p>When working with React Hooks, follow these guidelines:</p>
<ul>
<li><strong>Only call hooks at the top level:</strong> Don't call hooks inside loops, conditions, or nested functions</li>
<li><strong>Only call hooks from React functions:</strong> Call hooks from React function components or custom hooks</li>
<li><strong>Use the dependency array correctly:</strong> Include all dependencies in useEffect</li>
<li><strong>Customize the ESLint rules:</strong> Use the exhaustive-deps rule</li>
<li><strong>Keep hooks simple:</strong> Each hook should have a single responsibility</li>
</ul>
<p>Following these practices will help you avoid common pitfalls and write better React code.</p>`,
              description: 'Learn the best practices for using React Hooks effectively.',
              duration: '20:00',
              completed: false
            }
          ]
        },
        {
          _id: '2-3',
          title: 'Advanced React Patterns',
          videos: [
            {
              _id: '2-3-1',
              title: 'Higher-Order Components',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Creating reusable component logic with HOCs.',
              duration: '35:20',
              completed: false
            },
            {
              _id: '2-3-2',
              title: 'Render Props Pattern',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Sharing code between components using render props.',
              duration: '28:15',
              completed: false
            },
            {
              _id: '2-3-3',
              title: 'Performance Optimization',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Optimizing React applications for better performance.',
              duration: '31:40',
              completed: false
            },
            {
              _id: '2-3-4',
              title: 'Error Boundaries',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Handling errors gracefully in React applications.',
              duration: '24:30',
              completed: false
            }
          ]
        }
      ]
    },
    {
      _id: '3',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      thumbnail: 'https://via.placeholder.com/300x200/34a853/ffffff?text=Node.js',
      status: 'published',
      chapters: [
        {
          _id: '3-1',
          title: 'Node.js Fundamentals',
          videos: [
            {
              _id: '3-1-1',
              title: 'Introduction to Node.js',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Understanding Node.js and its event-driven architecture.',
              duration: '25:30',
              completed: false
            },
            {
              _id: '3-1-2',
              title: 'Modules and NPM',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Working with Node.js modules and package management.',
              duration: '20:15',
              completed: false
            },
            {
              _id: '3-1-3',
              title: 'Asynchronous Programming',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Understanding callbacks, promises, and async/await.',
              duration: '35:45',
              completed: false
            },
            {
              _id: '3-1-4',
              title: 'File System Operations',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Reading and writing files with Node.js fs module.',
              duration: '28:20',
              completed: false
            }
          ]
        },
        {
          _id: '3-2',
          title: 'Express.js Framework',
          videos: [
            {
              _id: '3-2-1',
              title: 'Express.js Basics',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Setting up Express.js and creating your first server.',
              duration: '22:40',
              completed: false
            },
            {
              _id: '3-2-2',
              title: 'Routing and Middleware',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Creating routes and using middleware in Express.',
              duration: '30:15',
              completed: false
            },
            {
              _id: '3-2-3',
              title: 'Request and Response Handling',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Processing requests and sending responses.',
              duration: '26:30',
              completed: false
            },
            {
              _id: '3-2-4',
              title: 'Error Handling',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Implementing proper error handling in Express applications.',
              duration: '24:45',
              completed: false
            }
          ]
        },
        {
          _id: '3-3',
          title: 'Database Integration',
          videos: [
            {
              _id: '3-3-1',
              title: 'MongoDB with Mongoose',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Connecting to MongoDB and using Mongoose ODM.',
              duration: '32:20',
              completed: false
            },
            {
              _id: '3-3-2',
              title: 'CRUD Operations',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Implementing Create, Read, Update, Delete operations.',
              duration: '29:15',
              completed: false
            },
            {
              _id: '3-3-3',
              title: 'Data Validation',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Validating data with Mongoose schemas and middleware.',
              duration: '27:40',
              completed: false
            },
            {
              _id: '3-3-4',
              title: 'Advanced Queries',
              type: 'VIDEO',
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              description: 'Complex database queries and aggregation.',
              duration: '34:10',
              completed: false
            }
          ]
        }
      ]
    }
  ];

  // Load course data from API or fallback to mock data
  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);

      try {
        if (courseId) {
          // Fetch specific course from API
          console.log('🔄 CourseViewer: Loading specific course:', courseId);
          const response = await fetch(`http://localhost:5001/api/courses/${courseId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('communityToken') || localStorage.getItem('token')}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            const course = data.course;
            console.log('📊 CourseViewer: API course data:', course);

            if (course) {
              setSelectedCourse(course);
              if (course.chapters && course.chapters.length > 0) {
                const firstChapter = course.chapters[0];
                if (firstChapter.videos && firstChapter.videos.length > 0) {
                  setSelectedLecture(firstChapter.videos[0]);
                  setActiveLectureId(firstChapter.videos[0]._id);
                }
              }
            } else {
              console.log('⚠️ CourseViewer: No course found, using mock data');
              setCourses(mockCourses);
              findAndSelectCourse(mockCourses);
            }
          } else {
            console.log('⚠️ CourseViewer: API failed, using mock data');
            setCourses(mockCourses);
            findAndSelectCourse(mockCourses);
          }
        } else {
          // Fetch all courses from API
          console.log('🔄 CourseViewer: Loading all courses');
          const response = await fetch('http://localhost:5001/api/courses', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('communityToken') || localStorage.getItem('token')}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            const fetchedCourses = data.courses || [];
            console.log('📊 CourseViewer: API courses data:', fetchedCourses);

            if (fetchedCourses.length > 0) {
              setCourses(fetchedCourses);
              findAndSelectCourse(fetchedCourses);
            } else {
              console.log('⚠️ CourseViewer: No courses from API, using mock data');
              setCourses(mockCourses);
              findAndSelectCourse(mockCourses);
            }
          } else {
            console.log('⚠️ CourseViewer: API failed, using mock data');
            setCourses(mockCourses);
            findAndSelectCourse(mockCourses);
          }
        }
      } catch (error) {
        console.error('❌ CourseViewer: Error loading course data:', error);
        console.log('⚠️ CourseViewer: Using mock data due to error');
        setCourses(mockCourses);
        findAndSelectCourse(mockCourses);
      } finally {
        setLoading(false);
      }
    };

    // Helper function to find and select course
    const findAndSelectCourse = (coursesList) => {
      if (courseId && coursesList.length > 0) {
        const targetCourse = coursesList.find(course => course._id === courseId);
        if (targetCourse) {
          setSelectedCourse(targetCourse);
          if (targetCourse.chapters && targetCourse.chapters.length > 0) {
            const firstChapter = targetCourse.chapters[0];
            if (firstChapter.videos && firstChapter.videos.length > 0) {
              setSelectedLecture(firstChapter.videos[0]);
              setActiveLectureId(firstChapter.videos[0]._id);
            }
          }
          return true;
        }
      }
      return false;
    };

    loadCourseData();
  }, [courseId]);

  // Debug effect to monitor selectedLecture changes
  useEffect(() => {
    console.log('selectedLecture changed:', selectedLecture?.title);
  }, [selectedLecture]);

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    if (course.chapters && course.chapters.length > 0) {
      const firstChapter = course.chapters[0];
      if (firstChapter.videos && firstChapter.videos.length > 0) {
        setSelectedLecture(firstChapter.videos[0]);
        setActiveLectureId(firstChapter.videos[0]._id);
      }
    } else {
      setSelectedLecture(null);
      setActiveLectureId(null);
    }
  };

  // Handle lecture selection
  const handleLectureSelect = (lecture) => {
    console.log('Lecture selected:', lecture.title); // Debug log
    console.log('Setting selectedLecture to:', lecture);
    console.log('Setting activeLectureId to:', lecture._id);
    setSelectedLecture(lecture);
    setActiveLectureId(lecture._id);
    
    // Reset PDF state when switching lectures
    setPdfLoading(false);
    
    // Set video loading state for video lectures
    if (lecture.type === 'VIDEO' || lecture.videoType) {
      setVideoLoading(true);
    }
  };

  // Update video completion status in the course data
  const updateVideoCompletion = (videoId, completed) => {
    setCourses(prevCourses =>
      prevCourses.map(course => ({
        ...course,
        chapters: course.chapters?.map(chapter => ({
          ...chapter,
          videos: chapter.videos?.map(video =>
            video._id === videoId
              ? { ...video, completed }
              : video
          )
        }))
      }))
    );

    // Also update the selected course
    setSelectedCourse(prevCourse => {
      if (!prevCourse) return prevCourse;
      return {
        ...prevCourse,
        chapters: prevCourse.chapters?.map(chapter => ({
          ...chapter,
          videos: chapter.videos?.map(video =>
            video._id === videoId
              ? { ...video, completed }
              : video
          )
        }))
      };
    });
  };

  // Handle accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    console.log('Accordion changed:', panel, isExpanded);
    setExpandedAccordion(isExpanded ? panel : false);
  };

  // Navigation items
  const navItems = [
    { id: 'home', icon: <HomeIcon />, label: 'Home' },
    { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'courses', icon: <VideoLibraryIcon />, label: 'Courses' },
    { id: 'analytics', icon: <FlashIcon />, label: 'Analytics' },
    { id: 'content', icon: <DescriptionIcon />, label: 'Content' },
  ];

  const handleLogout = () => {
    navigate('/community-login');
  };

  // Refresh course data
  const handleRefresh = () => {
    console.log('🔄 CourseViewer: Manual refresh triggered');
    // Trigger the useEffect by updating a dependency
    setLoading(true);
    // Force re-fetch by temporarily clearing the course
    setSelectedCourse(null);
    setSelectedLecture(null);
    setActiveLectureId(null);

    // Re-trigger the useEffect
    setTimeout(() => {
      const loadCourseData = async () => {
        try {
          if (courseId) {
            console.log('🔄 CourseViewer: Refreshing specific course:', courseId);
            const response = await fetch(`http://localhost:5001/api/courses/${courseId}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('communityToken') || localStorage.getItem('token')}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              const course = data.course;
              console.log('📊 CourseViewer: Refreshed course data:', course);

              if (course) {
                setSelectedCourse(course);
                if (course.chapters && course.chapters.length > 0) {
                  const firstChapter = course.chapters[0];
                  if (firstChapter.videos && firstChapter.videos.length > 0) {
                    setSelectedLecture(firstChapter.videos[0]);
                    setActiveLectureId(firstChapter.videos[0]._id);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('❌ CourseViewer: Error refreshing course:', error);
        } finally {
          setLoading(false);
        }
      };

      loadCourseData();
    }, 100);
  };

  // Get embed URL for video content
  const getEmbedUrl = (url) => {
    console.log('Processing URL:', url);
    if (!url) return "";

    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      console.log('YouTube embed URL:', embedUrl);
      return embedUrl;
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      console.log('YouTube short embed URL:', embedUrl);
      return embedUrl;
    }

    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1].split("?")[0];
      const embedUrl = `https://player.vimeo.com/video/${videoId}`;
      console.log('Vimeo embed URL:', embedUrl);
      return embedUrl;
    }

    if (url.includes("loom.com/")) {
      const videoId = url.split("loom.com/")[1].split("?")[0];
      const embedUrl = `https://www.loom.com/embed/${videoId}`;
      console.log('Loom embed URL:', embedUrl);
      return embedUrl;
    }

    console.log('Returning original URL:', url);
    return url;
  };

  // Check if URL is an uploaded video file
  const isUploadedVideo = (url) => {
    if (!url) return false;
    return url.includes('/uploads/') && (
      url.includes('.mp4') || 
      url.includes('.mov') || 
      url.includes('.avi') || 
      url.includes('.webm') || 
      url.includes('.mkv')
    );
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading courses...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: darkMode ? '#1a1a1a' : '#f8f9fa',
      display: 'flex'
    }}>
      {/* Common Focused Sidebar */}
      <FocusedSidebar darkMode={darkMode} />

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        ml: { xs: 0, md: 10 }, // Account for fixed sidebar
        mt: { xs: 8, md: 9 }, // Account for mobile top navigation and fixed top bar (70px) + padding
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Common Focused Top Bar */}
        <FocusedTopBar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Course Content */}
        <Box sx={{ p: { xs: 1, md: 3 }, flex: 1, overflow: 'hidden' }}>
          <Grid container spacing={2}>
            {/* Sidebar - Courses and Lectures */}
            <Grid size={{xs:12, md:4, lg:3}} sx={{ height: { xs: 'auto', md: '100%' } }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, overflow: 'hidden', p: 0 }}>
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Courses & Lectures
                    </Typography>
                  </Box>

                  <Box sx={{ overflow: 'auto', height: 'calc(100% - 80px)' }}>
                    {selectedCourse && (
                      <Box>
                        {/* Simple Course Header */}
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                            {selectedCourse.title}
                          </Typography>
                          
                          {/* Course Content Type Indicator */}
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              icon={selectedCourse.contentType === 'video' ? <VideoIcon fontSize="small" /> : <TextIcon fontSize="small" />}
                              label={selectedCourse.contentType === 'video' ? 'Video Course' : 'Text Course'}
                              size="small"
                              variant="outlined"
                              color={selectedCourse.contentType === 'video' ? 'primary' : 'warning'}
                              sx={{ fontSize: '12px', px: 1, py: 0.5 }}
                            />
                            <Chip
                              label={selectedCourse.status}
                              size="small"
                              variant="outlined"
                              color={selectedCourse.status === 'published' ? 'success' : 'warning'}
                            />
                          </Box>
                        </Box>

                        {/* Simple List of Chapters and Videos */}
                        {selectedCourse.chapters?.map((chapter) => (
                          <Box key={chapter._id} sx={{ mb: 3, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                              📚 {chapter.title}
                            </Typography>
                            
                            {chapter.videos?.map((video) => (
                              <Box
                                key={video._id}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  p: 1.5,
                                  cursor: 'pointer',
                                  backgroundColor: activeLectureId === video._id ? 'action.selected' : 'transparent',
                                  '&:hover': { backgroundColor: 'action.hover' },
                                  mb: 0.5,
                                  ml: 2,
                                  borderRadius: 1,
                                  border: activeLectureId === video._id ? 1 : 0,
                                  borderColor: 'primary.main'
                                }}
                                onClick={() => handleLectureSelect(video)}
                              >
                                {video.completed ? (
                                  <CheckIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                ) : (
                                  <CircleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                )}

                                {/* Content Type Icon */}
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  backgroundColor: (video.type === 'VIDEO' || video.videoType) ? '#4285f4' : 
                                                   video.type === 'PDF' ? '#34a853' : '#f59e0b',
                                  color: 'white',
                                  fontSize: '12px'
                                }}>
                                  {(video.type === 'VIDEO' || video.videoType) ? '▶️' : 
                                   video.type === 'PDF' ? '📄' : '📝'}
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {video.title}
                                  </Typography>
                                                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {video.type === 'PDF' ? 'PDF Document' : video.duration || 'Text Content'}
                                </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Main Content Area */}
            <Grid size={{xs:12, md:8, lg:9}} sx={{ height: { xs: 'auto', md: '100%' } }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                  {selectedLecture ? (
                    <>
                      {/* Debug Info */}
                      <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '12px' }}>
                          Debug: Video Type: {selectedLecture.type || 'undefined'}, VideoType: {selectedLecture.videoType || 'undefined'}, URL: {selectedLecture.type === 'PDF' ? selectedLecture.content : selectedLecture.videoUrl || 'none'}
                        </Typography>
                      </Box>
                      
                      {/* Video/Content Player */}
                      <Box sx={{
                        height: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
                        maxHeight: '70vh',
                        minHeight: '300px',
                        backgroundColor: '#000',
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                        aspectRatio: { xs: '4/3', sm: '16/10', md: '16/9' },
                        width: '100%',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                      }}>
                        {selectedLecture.type === 'PDF' ? (
                          // Enhanced PDF Viewer with react-pdf
                          <Box sx={{
                            height: '100%',
                            overflow: 'hidden',
                            backgroundColor: 'background.paper',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            {/* PDF Header with Controls */}
                            <Box sx={{
                              p: 2,
                              borderBottom: 1,
                              borderColor: 'divider',
                              backgroundColor: 'background.paper',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: 1
                            }}>
                              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                📄 {selectedLecture.title}
                              </Typography>
                              
                              {/* PDF Controls */}
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                {/* Simple PDF Controls */}
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  PDF Document Viewer
                                </Typography>
                                
                                {/* Fullscreen Button */}
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => {
                                    const iframe = document.getElementById('pdf-iframe');
                                    if (iframe) {
                                      if (iframe.requestFullscreen) {
                                        iframe.requestFullscreen();
                                      } else if (iframe.webkitRequestFullscreen) {
                                        iframe.webkitRequestFullscreen();
                                      } else if (iframe.msRequestFullscreen) {
                                        iframe.msRequestFullscreen();
                                      }
                                    }
                                  }}
                                  startIcon={<FullscreenIcon />}
                                  sx={{
                                    background: '#4285f4',
                                    '&:hover': { background: '#3367d6' }
                                  }}
                                >
                                  Fullscreen
                                </Button>
                              </Box>
                            </Box>
                            
                            {/* PDF Viewer - Simple iframe approach for demo */}
                            <Box sx={{ 
                              flex: 1, 
                              p: 2, 
                              overflow: 'hidden',
                              backgroundColor: '#f5f5f5'
                            }}>
                              <iframe
                                id="pdf-iframe"
                                src={`http://localhost:5001${selectedLecture.content}#toolbar=1&navpanes=1&scrollbar=1`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  border: 'none',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                title="PDF Viewer"
                                onLoad={() => {
                                  console.log('PDF iframe loaded successfully');
                                  console.log('PDF source:', selectedLecture.content);
                                  setPdfLoading(false);
                                }}
                                onError={(error) => {
                                  console.error('PDF iframe error:', error);
                                  console.error('PDF source:', selectedLecture.content);
                                  setPdfLoading(false);
                                }}
                              />
                              
                              {/* Debug info */}
                              <Box sx={{ 
                                position: 'absolute', 
                                top: 10, 
                                right: 10, 
                                backgroundColor: 'rgba(0,0,0,0.7)', 
                                color: 'white', 
                                p: 1, 
                                borderRadius: 1,
                                fontSize: '12px',
                                fontFamily: 'monospace'
                              }}>
                                PDF: http://localhost:5001{selectedLecture.content}
                              </Box>
                            </Box>
                          </Box>
                        ) : (selectedLecture.type === 'VIDEO' || selectedLecture.videoType) ? (
                          // Video Player
                          <Box sx={{ 
                            position: 'relative', 
                            width: '100%', 
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {/* Video Player - Always Visible */}
                            <Box
                              id="video-player-container"
                              sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: { xs: 1, sm: 2 },
                                minHeight: { xs: '250px', sm: '300px' },
                                maxWidth: '100%',
                                maxHeight: '100%',
                                cursor: 'pointer',
                                '&:focus': {
                                  outline: '2px solid #1976d2',
                                  outlineOffset: '2px'
                                }
                              }}
                              tabIndex={0}
                              role="button"
                              aria-label="Video player container"
                            >
                              {(selectedLecture.type === 'PDF' ? selectedLecture.content : selectedLecture.videoUrl) || selectedLecture.content ? (
                                <>
                                  {/* Loading State */}
                                  {videoLoading && (
                                    <Box 
                                      role="status"
                                      aria-label="Loading video content"
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        zIndex: 1,
                                        backdropFilter: 'blur(2px)',
                                        transition: 'opacity 0.3s ease-in-out',
                                        animation: 'fadeIn 0.3s ease-in-out',
                                        '@keyframes fadeIn': {
                                          from: { opacity: 0 },
                                          to: { opacity: 1 }
                                        }
                                    }}>
                                      <CircularProgress size={60} sx={{ color: 'white' }} />
                                      <Typography variant="h6" sx={{ ml: 2, color: 'white', fontWeight: 500 }}>
                                        Loading Video...
                                      </Typography>
                                    </Box>
                                  )}
                                  
                                  {/* Check if it's an uploaded video file */}
                                  {isUploadedVideo(selectedLecture.type === 'PDF' ? selectedLecture.content : selectedLecture.videoUrl) ? (
                                    <video
                                      key={selectedLecture._id}
                                      controls
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                      }}
                                      onLoadStart={() => setVideoLoading(true)}
                                      onLoadedData={() => {
                                        console.log('Uploaded video loaded successfully');
                                        setVideoLoading(false);
                                      }}
                                      onError={(error) => {
                                        console.error('Uploaded video error:', error);
                                        setVideoLoading(false);
                                      }}
                                    >
                                      <source src={selectedLecture.videoUrl} type="video/mp4" />
                                      <source src={selectedLecture.videoUrl} type="video/mov" />
                                      <source src={selectedLecture.videoUrl} type="video/avi" />
                                      <source src={selectedLecture.videoUrl} type="video/webm" />
                                      Your browser does not support the video tag.
                                    </video>
                                  ) : (
                                    <iframe
                                      key={selectedLecture._id}
                                      src={getEmbedUrl(selectedLecture.type === 'PDF' ? selectedLecture.content : selectedLecture.videoUrl)}
                                      title={selectedLecture.title}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                        borderRadius: '8px'
                                      }}
                                      allowFullScreen
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      onLoadStart={() => setVideoLoading(true)}
                                      onLoad={() => setVideoLoading(false)}
                                      onError={() => {
                                        setVideoLoading(false);
                                        console.error('Video failed to load');
                                      }}
                                      loading="lazy"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                </>
                              ) : (
                                <Box sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                  color: 'white',
                                  textAlign: 'center',
                                  p: 3,
                                  backgroundColor: 'rgba(0,0,0,0.6)'
                                }}>
                                  <VideoIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
                                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                    No Video Available
                                  </Typography>
                                  <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: '300px' }}>
                                    This lecture doesn't have a video attached. Please select a different lecture or contact support.
                                  </Typography>
                                </Box>
                              )}
                              {/* Video Controls Overlay */}
                              <Box sx={{
                                position: 'absolute',
                                top: { xs: 5, sm: 10 },
                                right: { xs: 5, sm: 10 },
                                display: 'flex',
                                gap: { xs: 0.5, sm: 1 },
                                flexDirection: { xs: 'column', sm: 'row' }
                              }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => {
                                    const iframe = document.querySelector('iframe');
                                    if (iframe) {
                                      if (iframe.requestFullscreen) {
                                        iframe.requestFullscreen();
                                      } else if (iframe.webkitRequestFullscreen) {
                                        iframe.webkitRequestFullscreen();
                                      } else if (iframe.msRequestFullscreen) {
                                        iframe.msRequestFullscreen();
                                      }
                                    }
                                  }}
                                  sx={{
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    fontSize: { xs: '10px', sm: '12px' },
                                    px: { xs: 1, sm: 2 },
                                    py: { xs: 0.5, sm: 1 },
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' }
                                  }}
                                >
                                  Fullscreen
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => {
                                    const videoContainer = document.getElementById('video-player-container');
                                    if (videoContainer) {
                                      videoContainer.style.display = 'none';
                                    }
                                  }}
                                  sx={{
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    borderColor: 'white',
                                    fontSize: { xs: '10px', sm: '12px' },
                                    px: { xs: 1, sm: 2 },
                                    py: { xs: 0.5, sm: 1 },
                                    '&:hover': { 
                                      backgroundColor: 'rgba(0,0,0,0.9)',
                                      borderColor: 'white'
                                    }
                                  }}
                                >
                                  Back to Preview
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        ) : (
                          // Text Content Display
                          <Box sx={{
                            height: '100%',
                            overflow: 'hidden',
                            backgroundColor: 'background.paper',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            {/* Text Content Header */}
                            <Box sx={{ 
                              p: 2, 
                              borderBottom: 1, 
                              borderColor: 'divider',
                              backgroundColor: 'background.paper',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                  📝 {selectedLecture.title}
                                </Typography>
                                <Chip
                                  icon={<TextIcon />}
                                  label="Rich Text Content"
                                  size="small"
                                  variant="outlined"
                                  color="warning"
                                />
                              </Box>
                            </Box>
                            
                            {/* Text Content Display */}
                            <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                              <Box
                                dangerouslySetInnerHTML={{ __html: selectedLecture.content }}
                                sx={{
                                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                                    color: 'primary.main',
                                    marginTop: 2,
                                    marginBottom: 1
                                  },
                                  '& p': {
                                    marginBottom: 1.5,
                                    lineHeight: 1.6
                                  },
                                  '& ul, & ol': {
                                    marginBottom: 1.5,
                                    paddingLeft: 3
                                  },
                                  '& li': {
                                    marginBottom: 0.5
                                  },
                                  '& strong': {
                                    fontWeight: 600
                                  },
                                  '& blockquote': {
                                    borderLeft: '4px solid #4285f4',
                                    paddingLeft: 2,
                                    marginLeft: 0,
                                    fontStyle: 'italic',
                                    backgroundColor: '#f8f9fa'
                                  },
                                  '& code': {
                                    backgroundColor: '#f1f3f4',
                                    padding: '2px 4px',
                                    borderRadius: 2,
                                    fontFamily: 'monospace'
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>

                      {/* Lecture Details */}
                      <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                              {selectedLecture.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                              {selectedLecture.description}
                            </Typography>
                            
                            {/* Content Type Specific Info */}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                              <Chip
                                icon={selectedLecture.type === 'VIDEO' ? <VideoIcon fontSize="small" /> : 
                                      selectedLecture.type === 'PDF' ? <DescriptionIcon fontSize="small" /> : <TextIcon fontSize="small" />}
                                label={selectedLecture.type}
                                size="small"
                                variant="outlined"
                                color={selectedLecture.type === 'VIDEO' ? 'primary' : 
                                       selectedLecture.type === 'PDF' ? 'secondary' : 'warning'}
                                        sx={{ fontSize: '12px', px: 1, py: 0.5 }}
                              />
                              {selectedLecture.type === 'VIDEO' && (
                                <Chip
                                  icon={<PlayIcon />}
                                  label="Video Player"
                                  size="small"
                                  variant="outlined"
                                  color="success"
                                />
                              )}
                              {selectedLecture.type === 'TEXT' && (
                                <Chip
                                  icon={<TextIcon />}
                                  label="Rich Text Content"
                                  size="small"
                                  variant="outlined"
                                  color="warning"
                                />
                              )}
                              {selectedLecture.type === 'PDF' && (
                                <Chip
                                  icon={<DescriptionIcon />}
                                  label="PDF Document"
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                />
                              )}
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                            <Button
                              variant="contained"
                              startIcon={selectedLecture.completed ? <CheckIcon /> : <PlayIcon />}
                              onClick={() => {
                                const newCompletedStatus = !selectedLecture.completed;
                                setSelectedLecture({
                                  ...selectedLecture,
                                  completed: newCompletedStatus
                                });
                                updateVideoCompletion(selectedLecture._id, newCompletedStatus);
                              }}
                              sx={{
                                minWidth: 140,
                                backgroundColor: selectedLecture.completed ? 'success.main' : 'primary.main',
                                '&:hover': {
                                  backgroundColor: selectedLecture.completed ? 'success.dark' : 'primary.dark'
                                }
                              }}
                            >
                              {selectedLecture.completed ? 'Completed' : 'Mark Complete'}
                            </Button>
                            
                            {selectedLecture.type === 'VIDEO' && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  const iframe = document.querySelector('iframe');
                                  if (iframe && iframe.requestFullscreen) {
                                    iframe.requestFullscreen();
                                  }
                                }}
                              >
                                Fullscreen
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      p: 3
                    }}>
                      <VideoIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Select a lecture to start learning
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                        Choose a course and lecture from the sidebar to begin your learning journey
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseViewer;
