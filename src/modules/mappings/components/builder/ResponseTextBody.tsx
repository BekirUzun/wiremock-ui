import * as React from 'react'
import { FormikErrors, FormikTouched } from 'formik'
import { Textarea } from 'edikit'
import { IMappingFormValues } from '../../types'

interface IResponseTextBodyProps {
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
    sync(): void
}

export default class ResponseTextBody extends React.Component<IResponseTextBodyProps> {
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
                <label
                    htmlFor="responseBody"
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 9,
                        marginTop: '6px'
                    }}
                >
                    Body
                </label>
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
        )
    }
}

