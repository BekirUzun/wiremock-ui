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

