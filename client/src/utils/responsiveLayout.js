import { useMediaQuery, useTheme } from '@mui/material';
import { useSidebar } from '../contexts/SidebarContext';

/**
 * Hook to get responsive layout values for sidebar and main content
 * @returns {Object} Layout configuration object
 */
export const useResponsiveLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { collapsed } = useSidebar();
  
  const getMainContentMargin = () => {
    if (isMobile) {
      return 0; // No margin on mobile since sidebar is overlay
    }
    return collapsed ? 7.5 : 30; // Desktop margins
  };

  const getTopBarLeft = () => {
    if (isMobile) {
      return 0; // Start from left edge on mobile
    }
    return collapsed ? 60 : 240; // Desktop positioning
  };

  return {
    isMobile,
    collapsed,
    getMainContentMargin,
    getTopBarLeft
  };
};

/**
 * Get main content margin based on sidebar state and screen size
 * @param {boolean} sidebarCollapsed - Whether sidebar is collapsed
 * @param {boolean} isMobile - Whether on mobile screen
 * @returns {number} Margin value in theme units
 */
export const getMainContentMargin = (sidebarCollapsed = true, isMobile = false) => {
  if (isMobile) {
    return 0; // No margin on mobile since sidebar is overlay
  }
  return sidebarCollapsed ? 7.5 : 30; // Desktop margins
};

/**
 * Get top bar left position based on sidebar state and screen size
 * @param {boolean} sidebarCollapsed - Whether sidebar is collapsed
 * @param {boolean} isMobile - Whether on mobile screen
 * @returns {number} Left position value in theme units
 */
export const getTopBarLeft = (sidebarCollapsed = true, isMobile = false) => {
  if (isMobile) {
    return 0; // Start from left edge on mobile
  }
  return sidebarCollapsed ? 60 : 240; // Desktop positioning
};
