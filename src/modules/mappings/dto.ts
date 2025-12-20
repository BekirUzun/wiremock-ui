import {
    MappingRequestUrlMatchType,
    IMapping,
    IMappingRequestParams,
    IMappingRequestBodyPattern,
    IMappingFormValues,
    IMappingRequestParamFormValue,
    IMappingRequestBodyPatternFormValue,
    IMappingResponseHeaderFormValue,
    mappingRequestParamMatchTypes,
    mappingRequestBodyPatternMatchTypes,
    MappingResponseType,
} from './types'

export const mappingRequestParamsToFormValue = (params?: IMappingRequestParams): IMappingRequestParamFormValue[] => {
    const formValue: IMappingRequestParamFormValue[] = []

    if (params !== undefined) {
        Object.keys(params).forEach(key => {
            const val = params[key]
            mappingRequestParamMatchTypes.forEach(matchType => {
                if (val[matchType] !== undefined) {
                    formValue.push({
                        key,
                        matchType,
                        value: matchType === 'absent' ? '' : val[matchType]!
                    })
                }
            })
        })
    }

    return formValue
}

export const mappingRequestBodyPatternsToFormValue = (bodyPatterns?: IMappingRequestBodyPattern[]): IMappingRequestBodyPatternFormValue[] => {
    const bodyPatternsFormValue: IMappingRequestBodyPatternFormValue[] = []
    if (bodyPatterns === undefined || bodyPatterns.length === 0) {
        return bodyPatternsFormValue
    }

    bodyPatterns.forEach(bodyPattern => {
        mappingRequestBodyPatternMatchTypes.forEach(matchType => {
            const val: any = (bodyPattern as any)[matchType]
            if (val !== undefined) {
                const value = matchType === 'absent' ? '' : (typeof val === 'string' ? val : JSON.stringify(val, null, 2))
                bodyPatternsFormValue.push({
                    matchType,
                    value,
                })
            }
        })
    })

    return bodyPatternsFormValue
}

export const mappingToFormValues = (mapping: IMapping): IMappingFormValues => {
    let url = ''
    let urlMatchType: MappingRequestUrlMatchType = mapping.isCreated === false ? 'url' : 'anyUrl'

    if (mapping.request.url !== undefined) {
        url = mapping.request.url
        urlMatchType = 'url'
    } else if (mapping.request.urlPattern !== undefined) {
        url = mapping.request.urlPattern
        urlMatchType = 'urlPattern'
    } else if (mapping.request.urlPath !== undefined) {
        url = mapping.request.urlPath
        urlMatchType = 'urlPath'
    } else if (mapping.request.urlPathPattern !== undefined) {
        url = mapping.request.urlPathPattern
        urlMatchType = 'urlPathPattern'
    } else if (mapping.request.urlPathTemplate !== undefined) {
        url = mapping.request.urlPathTemplate
        urlMatchType = 'urlPathTemplate'
    }

    const responseHeaders: IMappingResponseHeaderFormValue[] = []
    if (mapping.response.headers !== undefined) {
        Object.keys(mapping.response.headers).forEach(key => {
            responseHeaders.push({
                key,
                value: mapping.response.headers![key]
            })
        })
    }
    return {
        id: mapping.id,
        uuid: mapping.uuid,
        name: mapping.name,
        priority: mapping.priority !== undefined ? mapping.priority : 'auto',
        method: mapping.request.method,
        url,
        urlMatchType,
        queryParameters: mappingRequestParamsToFormValue(mapping.request.queryParameters),
        requestHeaders: mappingRequestParamsToFormValue(mapping.request.headers),
        requestCookies: mappingRequestParamsToFormValue(mapping.request.cookies),
        requestBodyPatterns: mappingRequestBodyPatternsToFormValue(mapping.request.bodyPatterns),
        responseStatus: mapping.response.status,
        responseFault: mapping.response.fault,
        responseHeaders,
        responseBody: mapping.response.body,
        responseJsonBody: mapJsonBody(mapping),
        responseBase64Body: mapping.response.base64Body,
        responseType: mapResponseType(mapping),
        responseBodyFileName: mapping.response.bodyFileName,
        responseDelayMilliseconds: mapping.response.fixedDelayMilliseconds,
        responseDelayDistribution: mapping.response.delayDistribution,
        folder: mapping.metadata ? mapping.metadata.folder : undefined,
    }
}
const mapJsonBody = (mapping: IMapping): string | undefined => {
    if (mapping.response.jsonBody) {
        try {
            return JSON.stringify(mapping.response.jsonBody, null, 4)
        } catch {
            return mapping.response.body
        }
    }
    return mapping.response.body
}

const mapResponseType = (mapping: IMapping): MappingResponseType => {
    if (mapping.metadata && mapping.metadata.responseType) { 
        return mapping.metadata.responseType
    }

    // fallback to content-type header
    const contentType = getResponseHeader(mapping, 'content-type')
    if (!contentType) {
        return mapping.response.base64Body !== undefined ? 'image' : 'json'
    }
    if (contentType.includes('image')) {
        return 'image'
    }
    if (contentType.includes('json')) {
        return 'json'
    }
    if (contentType.includes('html')) {
        return 'html'
    }
    return 'json'
}

const getResponseHeader = (mapping: IMapping, header: string): string | undefined => {
    if (mapping.response.headers && mapping.response.headers[header]) {
        return mapping.response.headers[header]
    }
    return undefined
}

export const mappingRequestParamsFormValueToRequestParams = (params: IMappingRequestParamFormValue[]): IMappingRequestParams => {
    return params.reduce((agg: IMappingRequestParams, param: IMappingRequestParamFormValue): IMappingRequestParams => {
        return {
            ...agg,
            [param.key]: {
                [param.matchType]: param.value,
            },
        }
    }, {})
}

export const mappingRequestBodyPatternsFormValueToBodyPatterns = (bodyPatterns: IMappingRequestBodyPatternFormValue[]): IMappingRequestBodyPattern[] => {
    return bodyPatterns.map((bodyPattern: IMappingRequestBodyPatternFormValue): IMappingRequestBodyPattern => {
        const raw = bodyPattern.value === undefined ? '' : String(bodyPattern.value).trim()
        let parsed: any = raw
        if (raw.length > 0 && (raw.charAt(0) === '{' || raw.charAt(0) === '[')) {
            try {
                parsed = JSON.parse(raw)
            } catch (e) {
                // keep as string if JSON parse fails
                parsed = raw
            }
        }

        // cast to any to allow object values when necessary
        return ({
            [bodyPattern.matchType]: parsed as any,
        } as any)
    })
}

const getResponseBody = (formValues: IMappingFormValues): { body?: string; jsonBody?: any; base64Body?: string } => {
    if (formValues.responseType === 'image') {
        return { base64Body: formValues.responseBase64Body }
    }
    
    if (formValues.responseType === 'json') {
        const jsonBody = formValues.responseJsonBody ? formValues.responseJsonBody : formValues.responseBody
        if (jsonBody) {
            try {
                return { jsonBody: JSON.parse(jsonBody) }
            } catch {
                console.error('Failed to parse response JSON body', jsonBody);
                return { jsonBody }
            }
        }
        return { jsonBody }
    }
    
    return { body: formValues.responseBody }
}

const determineTransformers = (formValues: IMappingFormValues): string[] => {
    const transformers: string[] = []
    
    if (formValues.responseType === 'json') {
        const responseBody = formValues.responseJsonBody || formValues.responseBody || ''
        if (responseBody.includes('{{')) {
            transformers.push('response-template')
        }
    }
    
    return transformers
}

export const mappingFormValuesToMapping = (formValues: IMappingFormValues): IMapping => {
    let url: { [matchType: string]: string } = {}
    if (formValues.urlMatchType !== 'anyUrl') {
        url = {
            [formValues.urlMatchType]: formValues.url
        }
    }

    const mapping: IMapping = {
        id: formValues.id,
        uuid: formValues.uuid,
        name: formValues.name,
        priority: formValues.priority === 'auto' ? undefined : Number(formValues.priority),
        request: {
            method: formValues.method,
            ...url,
            queryParameters: mappingRequestParamsFormValueToRequestParams(
                formValues.queryParameters
            ),
            headers: mappingRequestParamsFormValueToRequestParams(
                formValues.requestHeaders
            ),
            cookies: mappingRequestParamsFormValueToRequestParams(
                formValues.requestCookies
            ),
            bodyPatterns: mappingRequestBodyPatternsFormValueToBodyPatterns(
                formValues.requestBodyPatterns
            ),
        },
        response: {
            status: formValues.responseStatus,
            fault: formValues.responseFault,
            ...getResponseBody(formValues),
            bodyFileName: formValues.responseBodyFileName,
            headers: formValues.responseHeaders.reduce((acc, header) => ({
                ...acc,
                [header.key]: header.value,
            }), {}),
            fixedDelayMilliseconds: formValues.responseDelayMilliseconds,
            delayDistribution: formValues.responseDelayDistribution,
            transformers: determineTransformers(formValues),
        },
        metadata: {
            folder: formValues.folder !== '' ? formValues.folder : undefined,
            responseType: formValues.responseType,
        }
    }

    return mapping
}

export const getMappingUrl = (mapping: IMapping): string => {
    let url = '*'
    if (mapping.request.url !== undefined) {
        url = mapping.request.url
    } else if (mapping.request.urlPattern !== undefined) {
        url = mapping.request.urlPattern
    } else if (mapping.request.urlPath !== undefined) {
        url = mapping.request.urlPath
    } else if (mapping.request.urlPathPattern !== undefined) {
        url = mapping.request.urlPathPattern
    } else if (mapping.request.urlPathTemplate !== undefined) {
        url = mapping.request.urlPathTemplate
    }

    return url
}

export const getMappingLabel = (mapping: IMapping): string => {
    if (mapping.name !== undefined) return mapping.name
    return `${mapping.request.method} ${getMappingUrl(mapping)}`
}