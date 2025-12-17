import * as React from 'react'
import { FormikErrors, FormikTouched } from 'formik'
import { Input, Select } from 'edikit'
import { IMappingFormValues, mappingRequestMethods } from '../../types'

interface IRequetsUrlProps {
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
}

export default class RequestUrl extends React.Component<IRequetsUrlProps> {
    handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        if (value && !value.startsWith('/')) {
            value = '/' + value
        }
        if (value === '') {
            value = '/'
        }
        e.target.value = value
        this.props.onChange(e)
    }

    render() {
        const {
            values,
            onChange,
            onBlur,
        } = this.props

        const urlValue = values.url && values.url.startsWith('/') ? values.url : '/'

        return (
            <React.Fragment>
                <Select
                    name="method"
                    value={values.method}
                    onChange={onChange}
                    onBlur={onBlur}
                >
                    {mappingRequestMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </Select>
                <Input
                    name="url"
                    value={urlValue}
                    onChange={this.handleUrlChange}
                    onBlur={onBlur}
                    style={{
                        gridColumnStart: 2,
                        gridColumnEnd: 9,
                    }}
                />
            </React.Fragment>
        )
    }
}
