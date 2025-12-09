import * as React from 'react'
import { Trash2, PlusCircle } from 'react-feather'
import { FieldArray, FormikErrors, FormikTouched, getIn } from 'formik'
import { Button, Input, Textarea, Select } from 'edikit'
import { IMappingFormValues } from '../../types'
import { ImagePreview, ImagePreviewImg } from './ImagePreview_styled'
import { FileInputWrapper, FileInput } from './FileInput_styled'

interface IResponseBaseProps {
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
    sync(): void
}

export default class ResponseBase extends React.Component<IResponseBaseProps> {
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
            sync,
        } = this.props

        const responseType = values.responseType || 'text'
        const isImageMode = responseType === 'image'

        return (
            <FieldArray
                name="responseHeaders"
                render={helpers => {
                    return (
                        <React.Fragment>
                            <Button
                                variant="default"
                                icon={<PlusCircle size={14}/>}
                                iconPlacement="append"
                                style={{
                                    height: '30px',
                                    gridColumnStart: 1,
                                    gridColumnEnd: 3,
                                }}
                                onClick={() => {
                                    helpers.push({ key: '', value: '' })
                                    sync()
                                }}
                            >
                                Header
                            </Button>
                            <label
                                htmlFor="responseStatus"
                                style={{
                                    gridColumnStart: 4
                                }}
                            >
                                Status
                            </label>
                            <Input
                                id="responseStatus"
                                value={values.responseStatus}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                            {errors.responseStatus && touched.responseStatus && (
                                <div style={{ color: 'red', gridColumnStart: 6, gridColumnEnd: 9 }}>
                                    {errors.responseStatus}
                                </div>
                            )}
                            {values.responseHeaders && values.responseHeaders.length > 0 && values.responseHeaders.map((header, index) => (
                                <React.Fragment key={index}>
                                    <Input
                                        name={`responseHeaders.${index}.key`}
                                        value={header.key}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        placeholder="header name"
                                        style={{
                                            gridColumnStart: 1,
                                            gridColumnEnd: 4,
                                        }}
                                    />
                                    <Input
                                        name={`responseHeaders.${index}.value`}
                                        value={header.value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        placeholder="header value"
                                        style={{
                                            gridColumnStart: 4,
                                            gridColumnEnd: 8,
                                        }}
                                    />
                                    <div>
                                        <Button
                                            onClick={() => {
                                                helpers.remove(index)
                                                sync()
                                            }}
                                            variant="danger"
                                            icon={<Trash2 size={16}/>}
                                            style={{
                                                height: '30px',
                                            }}
                                        />
                                    </div>
                                    {getIn(errors, `responseHeaders.${index}.key`) && getIn(touched, `responseHeaders.${index}.key`) && (
                                        <div style={{ color: 'red', gridColumnStart: 1, gridColumnEnd: 4 }}>
                                            {getIn(errors, `responseHeaders.${index}.key`)}
                                        </div>
                                    )}
                                    {getIn(errors, `responseHeaders.${index}.value`) && getIn(touched, `responseHeaders.${index}.value`) && (
                                        <div style={{ color: 'red', gridColumnStart: 4, gridColumnEnd: 8 }}>
                                            {getIn(errors, `responseHeaders.${index}.value`)}
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                            <label
                                htmlFor="responseType"
                                style={{
                                    gridColumnStart: 1,
                                    gridColumnEnd: 3,
                                    marginTop: '6px'
                                }}
                            >
                                Response Type
                            </label>
                            <Select
                                id="responseType"
                                name="responseType"
                                value={responseType}
                                onChange={onChange}
                                onBlur={onBlur}
                                style={{
                                    gridColumnStart: 3,
                                    gridColumnEnd: 6,
                                }}
                            >
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                            </Select>
                            <label
                                htmlFor={isImageMode ? "responseBase64Body" : "responseBody"}
                                style={{
                                    gridColumnStart: 1,
                                    gridColumnEnd: 9,
                                    marginTop: '6px'
                                }}
                            >
                                {isImageMode ? 'Image Body (Base64)' : 'Body'}
                            </label>
                            {isImageMode ? (
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
                            ) : (
                                <>
                                    <Textarea
                                        id="responseBody"
                                        name="responseBody"
                                        value={values.responseBody || ''}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        placeholder="Response body"
                                        style={{
                                            gridColumnStart: 1,
                                            gridColumnEnd: 9,
                                            minHeight: '120px',
                                            resize: 'vertical'
                                        }}
                                    />
                                    {errors.responseBody && touched.responseBody && (
                                        <div style={{ color: 'red', gridColumnStart: 1, gridColumnEnd: 9 }}>
                                            {errors.responseBody}
                                        </div>
                                    )}
                                </>
                            )}
                        </React.Fragment>
                    )
                }}
            />
        )
    }
}