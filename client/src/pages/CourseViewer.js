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
  Link
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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const CourseViewer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { courseId } = useParams();

  // State management
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [activeLectureId, setActiveLectureId] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('courses');

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

  // Enhanced helper functions to extract video IDs from URLs
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*&v=)([^#&?]{11})/,
      /youtube\.com\/watch\?.*v=([^#&?]{11})/,
      /youtu\.be\/([^#&?]{11})/,
      /youtube\.com\/embed\/([^#&?]{11})/,
      /youtube\.com\/v\/([^#&?]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }
    return null;
  };

  const getVimeoVideoId = (url) => {
    if (!url) return null;
    
    // Handle various Vimeo URL formats
    const patterns = [
      /vimeo\.com\/([0-9]+)/,
      /vimeo\.com\/groups\/[^\/]+\/videos\/([0-9]+)/,
      /vimeo\.com\/channels\/[^\/]+\/([0-9]+)/,
      /player\.vimeo\.com\/video\/([0-9]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const getLoomVideoId = (url) => {
    if (!url) return null;
    
    // Handle various Loom URL formats
    const patterns = [
      /loom\.com\/share\/([a-zA-Z0-9]+)/,
      /loom\.com\/embed\/([a-zA-Z0-9]+)/,
      /useloom\.com\/share\/([a-zA-Z0-9]+)/,
      /useloom\.com\/embed\/([a-zA-Z0-9]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // Enhanced get embed URL for video content
  const getEmbedUrl = (url) => {
    console.log('Processing URL:', url);
    if (!url) return "";

    const trimmedUrl = url.trim();
    
    // Check for YouTube URLs
    const youtubeId = getYouTubeVideoId(trimmedUrl);
    if (youtubeId) {
      const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
      console.log('YouTube embed URL:', embedUrl);
      return embedUrl;
    }

    // Check for Vimeo URLs
    const vimeoId = getVimeoVideoId(trimmedUrl);
    if (vimeoId) {
      const embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
      console.log('Vimeo embed URL:', embedUrl);
      return embedUrl;
    }

    // Check for Loom URLs
    const loomId = getLoomVideoId(trimmedUrl);
    if (loomId) {
      const embedUrl = `https://www.loom.com/embed/${loomId}`;
      console.log('Loom embed URL:', embedUrl);
      return embedUrl;
    }

    console.log('Returning original URL:', url);
    return url;
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
      {/* Left Navigation Bar */}
      <Box sx={{
        width: 80,
        background: darkMode ? '#2d2d2d' : '#ffffff',
        borderRight: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
      }}>
        {/* Hamburger Menu */}
        <IconButton sx={{ mb: 4, color: darkMode ? '#ffffff' : '#000000' }}>
          <MenuIcon />
        </IconButton>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <Box key={item.id} sx={{ mb: 2, position: 'relative' }}>
            <IconButton
              onClick={() => {
                if (item.id === 'home') {
                  navigate('/community-dashboard');
                } else if (item.id === 'courses') {
                  navigate('/courses');
                } else {
                  setActiveNav(item.id);
                }
              }}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: activeNav === item.id
                  ? (darkMode ? '#404040' : '#000000')
                  : 'transparent',
                color: activeNav === item.id
                  ? '#ffffff'
                  : (darkMode ? '#ffffff' : '#000000'),
                '&:hover': {
                  backgroundColor: activeNav === item.id
                    ? (darkMode ? '#404040' : '#000000')
                    : (darkMode ? '#404040' : '#f0f0f0'),
                }
              }}
            >
              {item.icon}
            </IconButton>
          </Box>
        ))}

        {/* Logout Button */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <IconButton
            onClick={handleLogout}
            sx={{ color: darkMode ? '#ffffff' : '#000000' }}
            title="Logout"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        ml: 10, // Account for fixed sidebar
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header */}
        <Box sx={{
          height: 80,
          background: darkMode ? '#2d2d2d' : '#ffffff',
          borderBottom: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          {/* Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link
                underline="hover"
                color="inherit"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/courses');
                }}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Courses
              </Link>
              <Typography color="text.primary">
                {selectedCourse?.title || 'Course Viewer'}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Right side buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Refresh Button */}
            <IconButton
              onClick={handleRefresh}
              title="Refresh course data"
              sx={{
                color: darkMode ? '#ffffff' : '#000000',
                '&:hover': {
                  backgroundColor: darkMode ? '#404040' : '#f0f0f0',
                }
              }}
            >
              <RefreshIcon />
            </IconButton>

            {/* Theme Toggle */}
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              sx={{
                color: darkMode ? '#ffffff' : '#000000',
                '&:hover': {
                  backgroundColor: darkMode ? '#404040' : '#f0f0f0',
                }
              }}
            >
              {darkMode ? <SunIcon /> : <DarkIcon />}
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/courses')}
            >
              Back to Courses
            </Button>

            {/* Theme Toggle */}
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{ color: darkMode ? '#ffffff' : '#000000' }}
            >
              {darkMode ? <SunIcon /> : <DarkIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Course Content */}
        <Box sx={{ p: 3, flex: 1, overflow: 'hidden' }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>

            {/* Sidebar - Courses and Lectures */}
            <Grid item size={{xs: 12, md: 4, lg: 4 }} sx={{ height: '100%' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, overflow: 'hidden', p: 0 }}>
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Courses & Lectures
                    </Typography>
                  </Box>

                  <Box sx={{ overflow: 'auto', height: 'calc(100% - 80px)' }}>
                    {courses.map((course, index) => (
                      <Accordion
                        key={course._id}
                        expanded={expandedAccordion === `panel${index}`}
                        onChange={handleAccordionChange(`panel${index}`)}
                        sx={{
                          '&:before': { display: 'none' },
                          boxShadow: 'none',
                          borderBottom: 1,
                          borderColor: 'divider'
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            '&:hover': { backgroundColor: 'action.hover' },
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Course selected:', course.title);
                            handleCourseSelect(course);
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            {/* Course Thumbnail */}
                            <Box
                              sx={{
                                width: 60,
                                height: 40,
                                borderRadius: 1,
                                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 600
                              }}
                            >
                              {course.title.charAt(0)}
                            </Box>

                            {/* Course Info */}
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {course.title}
                              </Typography>
                              <Chip
                                label={course.status}
                                size="small"
                                color={getStatusColor(course.status)}
                                sx={{ fontSize: '10px' }}
                              />
                            </Box>
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 0 }}>
                          <Box sx={{ pl: 2 }}>
                            {course.chapters?.map((chapter) => (
                              <Box key={chapter._id} sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{
                                  color: 'text.secondary',
                                  fontWeight: 600,
                                  display: 'block',
                                  mb: 1
                                }}>
                                  {chapter.title}
                                </Typography>

                                {chapter.videos?.map((video) => (
                                  <Box
                                    key={video._id}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      p: 1,
                                      borderRadius: 1,
                                      cursor: 'pointer',
                                      backgroundColor: activeLectureId === video._id ? 'action.selected' : 'transparent',
                                      '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log('Video clicked:', video.title, video._id);
                                      handleLectureSelect(video);
                                    }}
                                  >
                                    {video.completed ? (
                                      <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                    ) : (
                                      <CircleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    )}

                                    {video.type === 'VIDEO' ? (
                                      <VideoIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    ) : (
                                      <TextIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    )}

                                    <Typography variant="caption" sx={{
                                      flexGrow: 1,
                                      color: activeLectureId === video._id ? 'primary.main' : 'text.primary'
                                    }}>
                                      {video.title}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Main Content Area */}
            <Grid item size={{xs: 12, md: 8, lg: 8 }} sx={{ height: '100%' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>

                  {selectedLecture ? (
                    <>
                      {/* Debug info */}
                      <Box sx={{ p: 1, backgroundColor: '#f0f0f0', fontSize: '12px' }}>
                        Debug: {selectedLecture.title} | Type: {selectedLecture.type} | Content: {selectedLecture.content?.substring(0, 50)}...
                      </Box>

                      {/* Video/Content Player */}
                      <Box sx={{
                        height: '60%',
                        backgroundColor: '#000',
                        position: 'relative'
                      }}>
                        {selectedLecture.type === 'VIDEO' ? (
                          <iframe
                            key={selectedLecture._id} // Force re-render when video changes
                            src={getEmbedUrl(selectedLecture.content)}
                            title={selectedLecture.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none'
                            }}
                            allowFullScreen
                          />
                        ) : (
                          <Box sx={{
                            p: 3,
                            height: '100%',
                            overflow: 'auto',
                            backgroundColor: 'background.paper'
                          }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                              {selectedLecture.title}
                            </Typography>
                            <Typography variant="body1">
                              {selectedLecture.content}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Lecture Details */}
                      <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                              {selectedLecture.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                              {selectedLecture.description}
                            </Typography>
                          </Box>

                          <Button
                            variant="contained"
                            startIcon={selectedLecture.completed ? <CheckIcon /> : <PlayIcon />}
                            onClick={() => {
                              const newCompletedStatus = !selectedLecture.completed;
                              // Update the selected lecture state
                              setSelectedLecture({
                                ...selectedLecture,
                                completed: newCompletedStatus
                              });
                              // Update the completion status in the course data structure
                              updateVideoCompletion(selectedLecture._id, newCompletedStatus);
                            }}
                          >
                            {selectedLecture.completed ? 'Completed' : 'Mark Complete'}
                          </Button>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Chip
                            icon={<VideoIcon />}
                            label={selectedLecture.type}
                            size="small"
                            variant="outlined"
                          />
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
