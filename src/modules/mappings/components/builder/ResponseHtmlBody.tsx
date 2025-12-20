import * as React from 'react'
import { withTheme } from 'styled-components'
import AceEditor from 'react-ace'
import { FormikErrors, FormikTouched } from 'formik'
import { ITheme, Button } from 'edikit'
import { IMappingFormValues } from '../../types'
import { Terminal as BeautifyIcon } from 'react-feather'
import { beautifyHtml } from '../../../../utils/beautifyUtils'

interface IResponseHtmlBodyProps {
    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>
    onChange(e: React.ChangeEvent<any>): void
    onBlur(e: any): void
    sync(): void
    theme: ITheme
}

interface IResponseHtmlBodyState {
    htmlValue: string
}

class ResponseHtmlBody extends React.Component<IResponseHtmlBodyProps, IResponseHtmlBodyState> {
    constructor(props: IResponseHtmlBodyProps) {
        super(props)
        
        const initialValue = props.values.responseBody || ''
        this.state = {
            htmlValue: initialValue,
        }
    }

    componentDidUpdate(prevProps: IResponseHtmlBodyProps) {
        if (this.props.values.responseBody !== prevProps.values.responseBody) {
            const newValue = this.props.values.responseBody || ''
            if (newValue !== this.state.htmlValue) {
                this.setState({
                    htmlValue: newValue,
                })
            }
        }
    }

    handleChange = (value: string) => {
        this.setState({
            htmlValue: value,
        })

        const syntheticEvent = {
            target: {
                name: 'responseBody',
                value,
            }
        } as React.ChangeEvent<HTMLInputElement>
        
        this.props.onChange(syntheticEvent)
        this.props.sync()
    }

    onEditorLoad = (editor: any) => {
        editor.commands.addCommand({
            name: 'beautify',
            bindKey: { win: 'Alt-Shift-F', mac: 'Command-Shift-F' },
            exec: () => this.handleChange(beautifyHtml(this.state.htmlValue)),
        })
    }

    render() {
        const {
            errors,
            touched,
            theme,
        } = this.props

        const { htmlValue } = this.state
        const displayError = errors.responseBody && touched.responseBody ? errors.responseBody : null

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
                        Body (HTML)
                    </label>
                    <Button
                        onClick={() => this.handleChange(beautifyHtml(this.state.htmlValue))}
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
                        mode="html"
                        theme={theme.editor.theme}
                        value={htmlValue}
                        onChange={this.handleChange}
                        onLoad={this.onEditorLoad}
                        readOnly={false}
                        name="responseHtmlBody"
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

export default withTheme(ResponseHtmlBody)

