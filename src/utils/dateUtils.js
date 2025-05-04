/**
 * Format a date string to a human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  // If less than 24 hours ago
  if (diff < 24 * 60 * 60 * 1000) {
    // If less than 1 minute ago
    if (diff < 60 * 1000) {
      return 'Just now'
    }
    
    // If less than 1 hour ago
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    
    // Less than 24 hours ago
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
  
  // If within the last week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
  
  // Otherwise return the date in a standard format
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  })
}