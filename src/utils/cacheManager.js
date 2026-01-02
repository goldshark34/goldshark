// Cache Management System for Product Loading Optimization
class CacheManager {
  constructor() {
    this.CACHE_PREFIX = 'yacht_cache_'
    this.DEFAULT_TTL = 3 * 60 * 1000 // 3 minutes in milliseconds
  }

  // Get cached data
  get(key) {
    try {
      const cacheKey = this.CACHE_PREFIX + key
      const cached = localStorage.getItem(cacheKey)
      
      if (!cached) {
        console.log(`🔍 Cache miss for key: ${key}`)
        return null
      }

      const data = JSON.parse(cached)
      
      // Check if cache is expired
      if (this.isExpired(data)) {
        console.log(`⏰ Cache expired for key: ${key}`)
        this.remove(key)
        return null
      }

      console.log(`✅ Cache hit for key: ${key}`)
      return data.value
    } catch (error) {
      console.error('❌ Cache get error:', error)
      return null
    }
  }

  // Set cached data
  set(key, value, ttl = this.DEFAULT_TTL) {
    try {
      const cacheKey = this.CACHE_PREFIX + key
      const data = {
        value,
        timestamp: Date.now(),
        ttl,
        version: '1.0'
      }

      localStorage.setItem(cacheKey, JSON.stringify(data))
      console.log(`💾 Cached data for key: ${key}, TTL: ${ttl}ms`)
      
      // Clean up old cache entries if storage is getting full
      this.cleanupIfNeeded()
    } catch (error) {
      console.error('❌ Cache set error:', error)
      // If storage is full, try to make space
      if (error.name === 'QuotaExceededError') {
        this.evictOldest()
        // Try again
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data))
        } catch (retryError) {
          console.error('❌ Cache set retry failed:', retryError)
        }
      }
    }
  }

  // Check if cached data is expired
  isExpired(data) {
    return Date.now() - data.timestamp > data.ttl
  }

  // Check if cached data is stale (older than 1 minute but not expired)
  isStale(key) {
    try {
      const cacheKey = this.CACHE_PREFIX + key
      const cached = localStorage.getItem(cacheKey)
      
      if (!cached) return true

      const data = JSON.parse(cached)
      const age = Date.now() - data.timestamp
      
      // Consider stale if older than 1 minute
      return age > 60 * 1000
    } catch (error) {
      return true
    }
  }

  // Remove cached data
  remove(key) {
    try {
      const cacheKey = this.CACHE_PREFIX + key
      localStorage.removeItem(cacheKey)
      console.log(`🗑️ Removed cache for key: ${key}`)
    } catch (error) {
      console.error('❌ Cache remove error:', error)
    }
  }

  // Clear all cache
  clear() {
    try {
      const keys = Object.keys(localStorage)
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX))
      
      cacheKeys.forEach(key => localStorage.removeItem(key))
      console.log(`🧹 Cleared ${cacheKeys.length} cache entries`)
    } catch (error) {
      console.error('❌ Cache clear error:', error)
    }
  }

  // Evict oldest cache entries (LRU strategy)
  evictOldest() {
    try {
      const keys = Object.keys(localStorage)
      const cacheEntries = []

      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          try {
            const data = JSON.parse(localStorage.getItem(key))
            cacheEntries.push({ key, timestamp: data.timestamp })
          } catch (e) {
            // Remove corrupted entries
            localStorage.removeItem(key)
          }
        }
      })

      // Sort by timestamp (oldest first)
      cacheEntries.sort((a, b) => a.timestamp - b.timestamp)

      // Remove oldest 25% of entries
      const toRemove = Math.ceil(cacheEntries.length * 0.25)
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(cacheEntries[i].key)
      }

      console.log(`🧹 Evicted ${toRemove} oldest cache entries`)
    } catch (error) {
      console.error('❌ Cache eviction error:', error)
    }
  }

  // Clean up if storage is getting full
  cleanupIfNeeded() {
    try {
      // Check if we're using more than 80% of available storage
      const used = new Blob(Object.values(localStorage)).size
      const quota = 5 * 1024 * 1024 // Assume 5MB quota
      
      if (used > quota * 0.8) {
        console.log('⚠️ Storage getting full, cleaning up...')
        this.evictOldest()
      }
    } catch (error) {
      // Fallback cleanup
      this.evictOldest()
    }
  }

  // Get cache statistics
  getStats() {
    try {
      const keys = Object.keys(localStorage)
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX))
      
      let totalSize = 0
      let expiredCount = 0
      let validCount = 0

      cacheKeys.forEach(key => {
        try {
          const item = localStorage.getItem(key)
          totalSize += item.length
          
          const data = JSON.parse(item)
          if (this.isExpired(data)) {
            expiredCount++
          } else {
            validCount++
          }
        } catch (e) {
          expiredCount++
        }
      })

      return {
        totalEntries: cacheKeys.length,
        validEntries: validCount,
        expiredEntries: expiredCount,
        totalSize: totalSize,
        hitRate: this.hitRate || 0
      }
    } catch (error) {
      console.error('❌ Cache stats error:', error)
      return null
    }
  }
}

// Create singleton instance
export const cacheManager = new CacheManager()