import { IMapping, IMappingRequestParams } from '../types'
import { IServer } from '../../servers'
import { getMappingUrl } from '../dto'

const buildBaseUrl = (server?: IServer): string => {
    if (!server) {
        return 'http://localhost:8080'
    }
    return server.port ? `${server.url}:${server.port}` : server.url
}

const normalizePath = (url: string): { baseUrl: string; path: string } => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        const parts = url.split('/')
        return {
            baseUrl: parts.slice(0, 3).join('/'),
            path: '/' + parts.slice(3).join('/')
        }
    }
    return {
        baseUrl: '',
        path: url.startsWith('/') ? url : `/${url}`
    }
}

const extractParamValue = (param: IMappingRequestParams[string]): string | undefined => {
    if (param.equalTo !== undefined) return param.equalTo
    if (param.matches !== undefined) return param.matches
    if (param.contains !== undefined) return param.contains
    return undefined
}

const buildQueryParams = (queryParameters?: IMappingRequestParams): string[] => {
    if (!queryParameters) return []

    const params: string[] = []
    Object.keys(queryParameters).forEach(key => {
        const value = extractParamValue(queryParameters[key])
        if (value !== undefined) {
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        }
    })
    return params
}

const buildFullUrl = (baseUrl: string, path: string, queryParams: string[]): string => {
    const fullPath = queryParams.length > 0
        ? `${path}?${queryParams.join('&')}`
        : path
    return `${baseUrl}${fullPath}`
}

const addHeaders = (parts: string[], headers?: IMappingRequestParams): void => {
    if (!headers) return

    Object.keys(headers).forEach(key => {
        const value = extractParamValue(headers[key])
        if (value !== undefined) {
            parts.push(`--header '${key}: ${value}'`)
        }
    })
}

const addContentTypeIfNeeded = (parts: string[], method: string, headers?: IMappingRequestParams): void => {
    const hasContentType = headers && Object.keys(headers).some(key => 
        key.toLowerCase() === 'content-type'
    )

    if (['POST', 'PUT', 'PATCH'].includes(method) && !hasContentType) {
        parts.push(`--header 'Content-Type: application/json'`)
    }
}

const addCookies = (parts: string[], cookies?: IMappingRequestParams): void => {
    if (!cookies) return

    const cookiePairs: string[] = []
    Object.keys(cookies).forEach(key => {
        const value = extractParamValue(cookies[key])
        if (value !== undefined) {
            cookiePairs.push(`${key}=${value}`)
        }
    })

    if (cookiePairs.length > 0) {
        parts.push(`--header 'Cookie: ${cookiePairs.join('; ')}'`)
    }
}

const valueToString = (val: any): string => {
    if (typeof val === 'string') return val
    if (typeof val === 'object' && val !== null) return JSON.stringify(val)
    return String(val)
}

const formatJsonBody = (body: string): string => {
    try {
        const parsed = JSON.parse(body)
        return JSON.stringify(parsed, null, 4)
    } catch {
        return body
    }
}

const extractBodyValue = (bodyPattern: any): string | undefined => {
    if (bodyPattern.equalToJson !== undefined) return valueToString(bodyPattern.equalToJson)
    if (bodyPattern.contains !== undefined) return valueToString(bodyPattern.contains)
    if (bodyPattern.matchesJsonPath !== undefined) return valueToString(bodyPattern.matchesJsonPath)
    if (bodyPattern.equalTo !== undefined) return valueToString(bodyPattern.equalTo)
    if (bodyPattern.matches !== undefined) return valueToString(bodyPattern.matches)
    if (bodyPattern.matchesXPath !== undefined) return valueToString(bodyPattern.matchesXPath)
    if (bodyPattern.matchesXml !== undefined) return valueToString(bodyPattern.matchesXml)
    if (bodyPattern.equalToXml !== undefined) return valueToString(bodyPattern.equalToXml)

    return undefined
}

const addBody = (parts: string[], method: string, bodyPatterns?: any[]): void => {
    if (!['POST', 'PUT', 'PATCH'].includes(method) || !bodyPatterns || bodyPatterns.length === 0) {
        return
    }

    const bodyValue = extractBodyValue(bodyPatterns[0])
    if (bodyValue !== undefined) {
        const formattedBody = formatJsonBody(bodyValue)
        const escapedBody = formattedBody.replace(/'/g, "'\\''")
        parts.push(`--data '${escapedBody}'`)
    }
}

export const generateCurlCommand = (mapping: IMapping, server?: IServer): string => {
    const method = mapping.request.method === 'ANY' ? 'GET' : mapping.request.method
    let url = getMappingUrl(mapping)

    if (mapping.request.urlPathTemplate !== undefined) {
        url = url.replace(/\{[^}]+\}/g, '1')
    }

    const serverBaseUrl = buildBaseUrl(server)
    const { baseUrl: urlBaseUrl, path } = normalizePath(url)
    const baseUrl = urlBaseUrl || serverBaseUrl

    const queryParams = buildQueryParams(mapping.request.queryParameters)
    const fullUrl = buildFullUrl(baseUrl, path, queryParams)

    const parts: string[] = [`curl --location --request ${method} '${fullUrl}'`]
    
    addHeaders(parts, mapping.request.headers)
    addContentTypeIfNeeded(parts, method, mapping.request.headers)
    addCookies(parts, mapping.request.cookies)
    addBody(parts, method, mapping.request.bodyPatterns)

    return parts.join(' \\\n')
}

