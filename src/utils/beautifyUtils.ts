import * as beautify from 'js-beautify'

/**
 * Beautifies a JSON string by parsing and reformatting it with proper indentation.
 * @param jsonString - The JSON string to beautify
 * @returns The beautified JSON string, or null if the input is empty/invalid
 */
export const beautifyJson = (jsonString: string): string => {
    if (!jsonString || jsonString.trim() === '') {
        return jsonString
    }
    
    try {
        const parsed = JSON.parse(jsonString)
        return JSON.stringify(parsed, null, 4)
    } catch {
        // If JSON is invalid, beautify won't work
        return jsonString
    }
}

/**
 * Beautifies an HTML string using js-beautify.
 * @param htmlString - The HTML string to beautify
 * @returns The beautified HTML string
 */
export const beautifyHtml = (htmlString: string): string => {
    if (!htmlString || htmlString.trim() === '') {
        return htmlString
    }
    
    try {
        return beautify.html(htmlString, {
            indent_size: 4,
            indent_char: ' ',
            max_preserve_newlines: 2,
            preserve_newlines: true,
            indent_scripts: 'normal',
            wrap_line_length: 0,
            wrap_attributes: 'auto',
            wrap_attributes_indent_size: 4,
            end_with_newline: false,
        })
    } catch {
        // If beautification fails, return original string
        return htmlString
    }
}

