import * as React from 'react'
import { withTheme } from 'styled-components'
import AceEditor from 'react-ace'
import { FormikErrors, FormikTouched } from 'formik'
import { ITheme, Button } from 'edikit'
import { IMappingFormValues } from '../../types'
import { Terminal as BeautifyIcon } from 'react-feather'
import { beautifyJson } from '../../../../utils/beautifyUtils'

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

    onEditorLoad = (editor: any) => {
        // Add keyboard shortcut for beautify (Shift+Alt+F)
        editor.commands.addCommand({
            name: 'beautify',
            bindKey: { win: 'Alt-Shift-F', mac: 'Command-Shift-F' },
            exec: () => this.handleChange(beautifyJson(this.state.jsonValue)),
        })
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
                <div
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 9,
                        marginTop: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <label htmlFor="responseBody">
                        Body (JSON)
                    </label>
                    <Button
                        onClick={() => this.handleChange(beautifyJson(this.state.jsonValue))}
                        style={{
                            fontSize: '11px',
                            lineHeight: '1.6em',
                            height: '28px',
                            padding: '0 8px',
                        }}
                        variant="default"
                        icon={<BeautifyIcon size={14} style={{ marginRight: '4px' }}/>}
                    >
                        Beautify
                    </Button>
                </div>
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
                        onLoad={this.onEditorLoad}
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

