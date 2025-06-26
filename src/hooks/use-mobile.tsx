import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with false, which will be the value on the server.
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // This effect runs only on the client.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Handler for media query changes
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    // Set the initial state on the client
    setIsMobile(mql.matches)

    // Add the event listener
    mql.addEventListener('change', handleMediaChange)

    // Cleanup the event listener on unmount
    return () => {
      mql.removeEventListener('change', handleMediaChange)
    }
  }, []) // Empty dependency array ensures this effect runs once on mount.

  return isMobile
}
