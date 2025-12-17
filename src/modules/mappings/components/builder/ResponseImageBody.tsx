import * as React from 'react'
import { FormikErrors, FormikTouched } from 'formik'
import { IMappingFormValues } from '../../types'
import ResponseImage from './ResponseImage'

interface IResponseImageBodyProps {
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
    sync(): void
}

export default class ResponseImageBody extends React.Component<IResponseImageBodyProps> {
    render() {
        const {
            values,
            errors,
            touched,
            onChange,
            onBlur,
            sync,
        } = this.props

        return (
            <>
                <label
                    htmlFor="responseBase64Body"
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 9,
                        marginTop: '6px'
                    }}
                >
                    Image Body (Base64)
                </label>
                <ResponseImage
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={onChange}
                    onBlur={onBlur}
                    sync={sync}
                />
            </>
        )
    }
}

