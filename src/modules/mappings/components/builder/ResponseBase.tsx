import * as React from 'react'
import { Trash2, PlusCircle } from 'react-feather'
import { FieldArray, FormikErrors, FormikTouched, getIn } from 'formik'
import { Button, Input, Select } from 'edikit'
import { IMappingFormValues } from '../../types'
import ResponseTextBody from './ResponseTextBody'
import ResponseImageBody from './ResponseImageBody'
import ResponseJsonBody from './ResponseJsonBody'

interface IResponseBaseProps {
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
    sync(): void
}

export default class ResponseBase extends React.Component<IResponseBaseProps> {
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

        return (
            <FieldArray
                name="responseHeaders"
                render={helpers => {
                    return (
                        <React.Fragment>

                            <label
                                htmlFor="responseStatus"
                            >
                                Status
                            </label>
                            <Input
                                id="responseStatus"
                                value={values.responseStatus}
                                onChange={onChange}
                                onBlur={onBlur}
                            />

                            <label
                                htmlFor="responseType"
                                style={{
                                    gridColumnStart: 4,
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
                            >
                                <option value="text">Text</option>
                                <option value="json">JSON</option>
                                <option value="image">Image</option>
                            </Select>
                            {errors.responseStatus && touched.responseStatus && (
                                <div style={{ color: 'red', gridColumnStart: 6, gridColumnEnd: 9 }}>
                                    {errors.responseStatus}
                                </div>
                            )}

                            <Button
                                variant="primary"
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
                                Add header
                            </Button>
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
                            {responseType === 'image' && (
                                <ResponseImageBody
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    sync={sync}
                                />
                            )}

                            {responseType === 'text' && (
                                <ResponseTextBody
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    sync={sync}
                                />
                            )}

                            {responseType === 'json' && (
                                <ResponseJsonBody
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    sync={sync}
                                />
                            )}
                        </React.Fragment>
                    )
                }}
            />
        )
    }
}