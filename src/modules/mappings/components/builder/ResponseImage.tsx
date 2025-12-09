import * as React from 'react'
import { FormikErrors, FormikTouched } from 'formik'
import { Textarea } from 'edikit'
import { IMappingFormValues } from '../../types'
import { ImagePreview, ImagePreviewImg } from './ImagePreview_styled'
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

    handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return

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
                {values.responseBase64Body && (
                    <ImagePreview>
                        <ImagePreviewImg
                            src={`data:${this.getContentType()};base64,${values.responseBase64Body}`}
                            alt="Image preview"
                        />
                    </ImagePreview>
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

