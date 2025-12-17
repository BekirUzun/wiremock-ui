import { AjaxError } from 'rxjs/ajax'
import { triggerNotification } from 'edikit'

export const formatNetworkError = (error: any): string => {
    if (error instanceof AjaxError) {
        if (error.status === 0) {
            return `Network error: ${error.message}`
        }
        if (error.status >= 400 && error.status < 500) {
            return `Client error (${error.status}): ${error.message || 'Request failed'}`
        }
        if (error.status >= 500) {
            return `Server error (${error.status}): ${error.message || 'Server error occurred'}`
        }
        return `Request failed: ${error.message || 'Unknown error'}`
    }
    
    if (error && error.message) {
        return error.message
    }
    
    return 'An unexpected error occurred'
}

export const handleNetworkError = (error: any, defaultMessage?: string) => {
    const message = defaultMessage || formatNetworkError(error)
    return triggerNotification({
        type: 'danger',
        content: message,
        ttl: 10000,
    })
}

