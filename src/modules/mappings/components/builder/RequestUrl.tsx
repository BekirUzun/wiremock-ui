import * as React from 'react'
import { FormikErrors, FormikTouched } from 'formik'
import { Input, Select, Button } from 'edikit'
import { ExternalLink } from 'react-feather'
import { IMappingFormValues, mappingRequestMethods } from '../../types'
import { IServer } from '../../../servers'

interface IRequetsUrlProps {
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
    server?: IServer
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

    handleOpenUrl = () => {
        let urlValue = this.props.values.url && this.props.values.url.startsWith('/') 
            ? this.props.values.url 
            : '/'
        
        if (this.props.values.urlMatchType === 'urlPathTemplate') {
            urlValue = urlValue.replace(/\{[^}]+\}/g, '1')
        }
        
        let baseUrl: string
        if (this.props.server) {
            baseUrl = this.props.server.port 
                ? `${this.props.server.url}:${this.props.server.port}` 
                : this.props.server.url
        } else {
            baseUrl = `${window.location.protocol}//${window.location.host}`
        }
        
        const fullUrl = `${baseUrl}${urlValue}`
        window.open(fullUrl, '_blank')
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
                        gridColumnEnd: 8,
                    }}
                />
                <Button
                    onClick={this.handleOpenUrl}
                    variant="default"
                    size="normal"
                    icon={<ExternalLink size={14} />}
                    style={{
                        gridColumnStart: 8,
                        gridColumnEnd: 9,
                        height: '32px',
                        width: '32px',
                        padding: 0,
                        justifyContent: 'center',
                    }}
                />
            </React.Fragment>
        )
    }
}
