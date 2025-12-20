import * as React from 'react'
import { Trash2, PlusCircle } from 'react-feather'
import { FormikErrors, FormikTouched, FieldArray, getIn } from 'formik'
import { Button, Input, Select } from 'edikit'
import { IMappingFormValues, mappingRequestParamMatchTypes } from '../../types'

interface IRequestParamsProps {
    type: 'queryParameters' | 'requestHeaders' | 'requestCookies'
    label: string
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
}

export default class RequestParams extends React.Component<IRequestParamsProps> {
    private static readonly COMMON_REQUEST_HEADERS = [
        'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Authorization',
        'Cache-Control', 'Connection', 'Content-Length', 'Content-Type', 'Cookie',
        'Date', 'Expect', 'From', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match',
        'If-Range', 'If-Unmodified-Since', 'Max-Forwards', 'Origin', 'Pragma',
        'Proxy-Authorization', 'Range', 'Referer', 'TE', 'Upgrade', 'User-Agent',
        'Via', 'Warning', 'X-Requested-With', 'X-Forwarded-For', 'X-Forwarded-Proto',
        'X-Forwarded-Host', 'X-Real-IP', 'X-Api-Hash', 'X-Api-Key', 'X-Timestamp',
        'X-Shbdn-Export-Access', 'X-Shbdn-Export-Id',
    ]

    render() {
        const {
            type,
            label,
            values,
            errors,
            touched,
            onChange,
            onBlur,
        } = this.props

        return (
            <FieldArray
                name={type}
                render={arrayHelpers => (
                    <React.Fragment>
                        {type === 'requestHeaders' && (
                            <datalist id="common-request-headers">
                                {RequestParams.COMMON_REQUEST_HEADERS.map(header => (
                                    <option key={header} value={header} />
                                ))}
                            </datalist>
                        )}
                        {values[type].map((param, index) => (
                            <React.Fragment key={index}>
                                <Input
                                    name={`${type}.${index}.key`}
                                    value={param.key}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    placeholder={`${label} key`}
                                    list={type === 'requestHeaders' ? 'common-request-headers' : undefined}
                                    style={{
                                        gridColumnStart: 1,
                                        gridColumnEnd: 3,
                                    }}
                                />
                                <Select
                                    name={`${type}.${index}.matchType`}
                                    value={param.matchType}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    style={{
                                        gridColumnStart: 3,
                                        gridColumnEnd: 5,
                                    }}
                                >
                                    {mappingRequestParamMatchTypes.map(matchType => (
                                        <option key={matchType} value={matchType}>{matchType}</option>
                                    ))}
                                </Select>
                                <Input
                                    name={`${type}.${index}.value`}
                                    placeholder="expected value"
                                    value={param.value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    style={{
                                        gridColumnStart: 5,
                                        gridColumnEnd: 8,
                                    }}
                                />
                                <div>
                                    <Button
                                        onClick={() => { arrayHelpers.remove(index) }}
                                        variant="danger"
                                        icon={<Trash2 size={14} />}
                                        style={{
                                            height: '30px',
                                        }}
                                    />
                                </div>
                                {getIn(errors, `${type}.${index}.key`) && getIn(touched, `${type}.${index}.key`) && (
                                    <div style={{ color: 'red', gridColumnStart: 1, gridColumnEnd: 3 }}>
                                        {getIn(errors, `${type}.${index}.key`)}
                                    </div>
                                )}
                                {getIn(errors, `${type}.${index}.value`) && getIn(touched, `${type}.${index}.value`) && (
                                    <div style={{ color: 'red', gridColumnStart: 5, gridColumnEnd: 7 }}>
                                        {getIn(errors, `${type}.${index}.value`)}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        <Button
                            variant="primary"
                            icon={<PlusCircle size={14} />}
                            iconPlacement="append"
                            onClick={() => {
                                arrayHelpers.push({
                                    key: '',
                                    matchType: 'equalTo',
                                    value: '',
                                })
                            }}
                            style={{
                                gridColumnStart: 1,
                                gridColumnEnd: 3,
                                height: '30px',
                            }}
                        >
                            Add {label}
                        </Button>
                    </React.Fragment>
                )}
            />
        )
    }
}
