import * as React from 'react'
import { FormikErrors, FormikTouched } from 'formik'
import { Textarea } from 'edikit'
import { IMappingFormValues } from '../../types'
import { ImagePreviewContainer, ImagePreview, ImagePreviewImg } from './ImagePreview_styled'
import { FileInputWrapper, FileInput } from './FileInput_styled'

interface IResponseImageProps {
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
    sync(): void
}

export default class ResponseImage extends React.Component<IResponseImageProps> {
    getBase64String = (event: Event): string => {
        if (!event || !event.target) {
            return ''
        }
        
        const target = event.target
        if (!(target instanceof FileReader)) {
            return ''
        }
        
        const result = target.result
        if (typeof result !== 'string') {
            return ''
        }
        
        return result
    }

    updateHeadersForFile = (fileType: string, fileName: string): void => {
        const updatedHeaders = [...this.props.values.responseHeaders]
        let headersUpdated = false

        // Update Content-Type header if it exists
        const contentTypeIndex = updatedHeaders.findIndex(
            header => header.key.toLowerCase() === 'content-type'
        )
        if (contentTypeIndex !== -1) {
            updatedHeaders[contentTypeIndex] = {
                ...updatedHeaders[contentTypeIndex],
                value: fileType
            }
            headersUpdated = true
        }

        // Update Content-Disposition header if it exists
        const contentDispositionIndex = updatedHeaders.findIndex(
            header => header.key.toLowerCase() === 'content-disposition'
        )
        if (fileName && contentDispositionIndex !== -1) {
            const currentValue = updatedHeaders[contentDispositionIndex].value
            // Format: "attachment; filename=\"image1.png\"" or "inline; filename=\"image1.png\""
            let newValue = currentValue
            if (currentValue.includes('filename=')) {
                newValue = currentValue.replace(/filename="[^"]*"/, `filename="${fileName}"`)
            } else {
                // If no filename exists, append it
                const dispositionType = currentValue.split(';')[0].trim() || 'attachment'
                newValue = `${dispositionType}; filename="${fileName}"`
            }
            updatedHeaders[contentDispositionIndex] = {
                ...updatedHeaders[contentDispositionIndex],
                value: newValue
            }
            headersUpdated = true
        }

        if (headersUpdated) {
            const headersEvent = {
                target: {
                    name: 'responseHeaders',
                    value: updatedHeaders,
                }
            } as any
            this.props.onChange(headersEvent)
        }
    }

    handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return

        const fileType = file.type || 'application/octet-stream'
        const fileName = file.name

        this.updateHeadersForFile(fileType, fileName)

        const reader = new FileReader()
        reader.onload = (event) => {
            const base64String = this.getBase64String(event)
            if (!base64String) return
            
            // Remove data URL prefix (e.g., "data:image/png;base64,")
            const base64Data = base64String.split(',')[1] || base64String
            
            // Create a synthetic event to update form values
            const syntheticEvent = {
                target: {
                    name: 'responseBase64Body',
                    value: base64Data,
                }
            } as React.ChangeEvent<HTMLInputElement>
            
            this.props.onChange(syntheticEvent)
            this.props.sync()
        }
        reader.readAsDataURL(file)
    }

    getContentType = (): string => {
        const contentTypeHeader = this.props.values.responseHeaders.find(
            header => header.key.toLowerCase() === 'content-type'
        )
        return (contentTypeHeader && contentTypeHeader.value) || 'image/jpeg'
    }

    render() {
        const {
            values,
            errors,
            touched,
            onChange,
            onBlur,
        } = this.props

        return (
            <>
                <FileInputWrapper>
                    <FileInput
                        type="file"
                        accept="image/*"
                        onChange={this.handleFileUpload}
                    />
                </FileInputWrapper>
                {values.responseBase64Body ? (
                    <ImagePreviewContainer>
                        <Textarea
                            id="responseBase64Body"
                            name="responseBase64Body"
                            value={values.responseBase64Body || ''}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder="Base64 encoded image data"
                            style={{
                                flex: 1,
                                minHeight: '120px',
                                resize: 'vertical'
                            }}
                        />
                        <ImagePreview>
                            <ImagePreviewImg
                                src={`data:${this.getContentType()};base64,${values.responseBase64Body}`}
                                alt="Image preview"
                            />
                        </ImagePreview>
                    </ImagePreviewContainer>
                ) : (
                    <Textarea
                        id="responseBase64Body"
                        name="responseBase64Body"
                        value={values.responseBase64Body || ''}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="Base64 encoded image data"
                        style={{
                            gridColumnStart: 1,
                            gridColumnEnd: 9,
                            minHeight: '120px',
                            resize: 'vertical'
                        }}
                    />
                )}
                {errors.responseBase64Body && touched.responseBase64Body && (
                    <div style={{ color: 'red', gridColumnStart: 1, gridColumnEnd: 9 }}>
                        {errors.responseBase64Body}
                    </div>
                )}
            </>
        )
    }
}

