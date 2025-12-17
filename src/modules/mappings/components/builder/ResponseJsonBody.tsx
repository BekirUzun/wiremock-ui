import * as React from 'react'
import { withTheme } from 'styled-components'
import AceEditor from 'react-ace'
import { FormikErrors, FormikTouched } from 'formik'
import { ITheme } from 'edikit'
import { IMappingFormValues } from '../../types'

interface IResponseJsonBodyProps {
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
    sync(): void
    theme: ITheme
}

interface IResponseJsonBodyState {
    jsonValue: string
    jsonError: string | null
}

class ResponseJsonBody extends React.Component<IResponseJsonBodyProps, IResponseJsonBodyState> {
    constructor(props: IResponseJsonBodyProps) {
        super(props)
        
        const initialValue = props.values.responseBody || ''
        this.state = {
            jsonValue: this.formatJson(initialValue),
            jsonError: null,
        }
    }

    componentDidUpdate(prevProps: IResponseJsonBodyProps) {
        if (this.props.values.responseBody !== prevProps.values.responseBody) {
            const newValue = this.props.values.responseBody || ''
            if (newValue !== this.state.jsonValue) {
                this.setState({
                    jsonValue: this.formatJson(newValue),
                    jsonError: null,
                })
            }
        }
    }

    formatJson = (value: string): string => {
        if (!value || value.trim() === '') {
            return ''
        }
        
        try {
            const parsed = JSON.parse(value)
            return JSON.stringify(parsed, null, 4)
        } catch {
            return value
        }
    }

    validateJson = (value: string): string | null => {
        if (!value || value.trim() === '') {
            return null
        }
        
        try {
            JSON.parse(value)
            return null
        } catch (err) {
            return err.message || 'Invalid JSON'
        }
    }

    handleChange = (value: string) => {
        const jsonError = this.validateJson(value)
        
        this.setState({
            jsonValue: value,
            jsonError,
        })

        if (!jsonError) {
            const syntheticEvent = {
                target: {
                    name: 'responseBody',
                    value,
                }
            } as React.ChangeEvent<HTMLInputElement>
            
            this.props.onChange(syntheticEvent)
            this.props.sync()
        }
    }

    render() {
        const {
            errors,
            touched,
            theme,
        } = this.props

        const { jsonValue, jsonError } = this.state
        const displayError = jsonError || (errors.responseBody && touched.responseBody ? errors.responseBody : null)

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
                    Body (JSON)
                </label>
                <div
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 9,
                        minHeight: '200px',
                        border: displayError ? `2px solid rgba(255, 0, 0, 0.4)` : '2px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                    }}
                >
                    <AceEditor
                        mode="json"
                        theme={theme.editor.theme}
                        value={jsonValue}
                        onChange={this.handleChange}
                        readOnly={false}
                        name="responseJsonBody"
                        showPrintMargin={false}
                        showGutter={true}
                        
                        highlightActiveLine={true}
                        editorProps={{
                            $blockScrolling: Infinity,
                        }}
                        fontSize={12}
                        wrapEnabled={false}
                        width="100%"
                        height="300px"
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 4,
                        }}
                    />
                </div>
            </>
        )
    }
}

export default withTheme(ResponseJsonBody)

