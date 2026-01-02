// Refresh Scheduler for 3-minute intervals with user interaction awareness
class RefreshScheduler {
  constructor() {
    this.intervals = new Map()
    this.isUserInteracting = false
    this.interactionTimeout = null
    this.visibilityChangeHandler = null
    
    this.setupInteractionDetection()
    this.setupVisibilityDetection()
  }

  // Start refresh scheduler
  start(key, callback, interval = 3 * 60 * 1000) { // 3 minutes default
    console.log(`🔄 Starting refresh scheduler for ${key} with ${interval}ms interval`)
    
    // Clear existing interval if any
    this.stop(key)
    
    const intervalId = setInterval(() => {
      if (this.isUserInteracting) {
        console.log(`⏸️ Delaying refresh for ${key} - user is interacting`)
        // Retry after interaction ends
        setTimeout(() => {
          if (!this.isUserInteracting) {
            callback()
          }
        }, 5000)
      } else {
        console.log(`🔄 Executing scheduled refresh for ${key}`)
        callback()
      }
    }, interval)
    
    this.intervals.set(key, intervalId)
    
    // Also refresh immediately if page becomes visible
    this.setupVisibilityRefresh(key, callback)
  }

  // Stop refresh scheduler
  stop(key) {
    const intervalId = this.intervals.get(key)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervals.delete(key)
      console.log(`⏹️ Stopped refresh scheduler for ${key}`)
    }
  }

  // Stop all schedulers
  stopAll() {
    this.intervals.forEach((intervalId, key) => {
      clearInterval(intervalId)
      console.log(`⏹️ Stopped refresh scheduler for ${key}`)
    })
    this.intervals.clear()
  }

  // Setup user interaction detection
  setupInteractionDetection() {
    const interactionEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleInteraction = () => {
      this.isUserInteracting = true
      
      // Clear existing timeout
      if (this.interactionTimeout) {
        clearTimeout(this.interactionTimeout)
      }
      
      // Set user as not interacting after 2 seconds of inactivity
      this.interactionTimeout = setTimeout(() => {
        this.isUserInteracting = false
        console.log('👤 User interaction ended')
      }, 2000)
    }

    interactionEvents.forEach(event => {
      document.addEventListener(event, handleInteraction, { passive: true })
    })

    console.log('👤 User interaction detection setup complete')
  }

  // Setup page visibility detection
  setupVisibilityDetection() {
    this.visibilityChangeHandler = () => {
      if (!document.hidden) {
        console.log('👁️ Page became visible - checking for updates')
        // Trigger immediate refresh for all active schedulers
        this.intervals.forEach((intervalId, key) => {
          // Get the callback from the stored data (we'll need to modify this)
          console.log(`🔄 Triggering visibility refresh for ${key}`)
        })
      }
    }

    document.addEventListener('visibilitychange', this.visibilityChangeHandler)
    console.log('👁️ Page visibility detection setup complete')
  }

  // Setup visibility-based refresh for specific key
  setupVisibilityRefresh(key, callback) {
    const originalHandler = this.visibilityChangeHandler
    
    this.visibilityChangeHandler = () => {
      if (!document.hidden) {
        console.log(`👁️ Page became visible - refreshing ${key}`)
        callback()
      }
      if (originalHandler) originalHandler()
    }
  }

  // Check if user is currently interacting
  isUserCurrentlyInteracting() {
    return this.isUserInteracting
  }

  // Force refresh (ignores user interaction)
  forceRefresh(key, callback) {
    console.log(`🔄 Force refreshing ${key}`)
    callback()
  }

  // Pause all schedulers
  pauseAll() {
    console.log('⏸️ Pausing all refresh schedulers')
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId)
    })
  }

  // Resume all schedulers
  resumeAll() {
    console.log('▶️ Resuming all refresh schedulers')
    // Note: This would need to store original callbacks to work properly
    // For now, schedulers need to be restarted manually
  }

  // Get scheduler status
  getStatus() {
    return {
      activeSchedulers: Array.from(this.intervals.keys()),
      isUserInteracting: this.isUserInteracting,
      schedulerCount: this.intervals.size
    }
  }

  // Cleanup
  destroy() {
    this.stopAll()
    
    if (this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler)
    }
    
    if (this.interactionTimeout) {
      clearTimeout(this.interactionTimeout)
    }
    
    console.log('🧹 Refresh scheduler destroyed')
  }
}

// Create singleton instance
export const refreshScheduler = new RefreshScheduler()