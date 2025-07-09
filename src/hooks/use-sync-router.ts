import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

/**
 * Custom hook that synchronizes the browser URL with React Router's state.
 * This is useful for handling URL changes that occur outside React Router's control,
 * such as from third-party libraries or direct browser history manipulations.
 */
export function useSyncRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  // Track window.location.pathname with a state variable
  const [currentWindowPath, setCurrentWindowPath] = useState(window.location.pathname);
  const routerPath = location.pathname;

  // Set up an event listener for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const newPath = window.location.pathname;
      setCurrentWindowPath(newPath);

      if (newPath !== routerPath) {
        navigate(newPath, { replace: true });
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", handleUrlChange);

    // Create a MutationObserver to detect DOM changes that might indicate a URL change
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentWindowPath) {
        handleUrlChange();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      observer.disconnect();
    };
  }, [currentWindowPath, routerPath, navigate]);

  // Poll for URL changes as a fallback method
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.location.pathname !== currentWindowPath) {
        setCurrentWindowPath(window.location.pathname);
        if (window.location.pathname !== routerPath) {
          navigate(window.location.pathname, { replace: true });
        }
      }
    }, 200); // Check every 200ms

    return () => clearInterval(interval);
  }, [currentWindowPath, routerPath, navigate]);

  // Return the current paths in case they're needed by the component
  return {
    windowPath: currentWindowPath,
    routerPath,
  };
}
