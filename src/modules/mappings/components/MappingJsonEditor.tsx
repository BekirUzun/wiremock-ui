import * as React from 'react'
import { withTheme } from 'styled-components'
import AceEditor from 'react-ace'
import { ITheme } from 'edikit'
import { IMapping } from '../types'
import { Container, Content } from './Mapping_styled'
import MappingBar from './MappingBar'

interface IMappingJsonEditorProps {
    mapping: IMapping
    isLoading: boolean
    save(values: IMapping): void
    sync?: (values: IMapping) => void
    deleteMapping?: () => void
    mode: 'builder' | 'json'
    setBuilderMode(): void
    setJsonMode(): void
    theme: ITheme
}

interface IMappingJsonEditorState {
    source: string
    error?: string | null
}

class MappingJsonEditor extends React.Component<IMappingJsonEditorProps, IMappingJsonEditorState> {
    constructor(props: IMappingJsonEditorProps) {
        super(props)

        this.state = {
            source: JSON.stringify(props.mapping, null, '    '),
            error: null,
        }
    }

    componentDidUpdate(prevProps: IMappingJsonEditorProps) {
        // Update editor source when mapping from props changes (for example when switching mappings)
        if (this.props.mapping !== prevProps.mapping) {
            const source = JSON.stringify(this.props.mapping, null, '    ')
            // only update if the incoming mapping differs from current editor text to avoid clobbering user edits
            if (source !== this.state.source) {
                this.setState({ source, error: null })
            }
        }
    }

    tryParse = (value: string) => {
        try {
            const parsed = JSON.parse(value)
            const validationError = this.validateMapping(parsed)
            if (validationError) {
                this.setState({ error: validationError })
                return null
            }
            this.setState({ error: null })
            return parsed
        } catch (err) {
            this.setState({ error: err.message })
            return null
        }
    }

    validateMapping = (mapping: any): string | null => {
        if (mapping === null || typeof mapping !== 'object') return 'mapping must be a JSON object'
        if (!mapping.request) return 'missing required "request" field'
        if (!mapping.response) return 'missing required "response" field'
        // additional basic checks
        if (typeof mapping.request !== 'object') return 'request must be an object'
        if (typeof mapping.response !== 'object') return 'response must be an object'
        return null
    }

    onChange = (value: string) => {
        this.setState({ source: value })

        // attempt to parse and sync working copy when valid
        const parsed = this.tryParse(value)
        if (parsed !== null && this.props.sync !== undefined) {
            // caller expects an IMapping or partial mapping; forward parsed object
            this.props.sync(parsed as IMapping)
        }
    }

    handleSave = () => {
        const { save } = this.props
        const { source } = this.state

        if (save === undefined) return

        const parsed = this.tryParse(source)
        if (parsed === null) return

        // Call save with the parsed mapping
        save(parsed as IMapping)
    }

    onEditorLoad = (editor: any) => {
        // add keyboard shortcut for save (Cmd/Ctrl+S)
        editor.commands.addCommand({
            name: 'save',
            bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
            exec: () => this.handleSave(),
        })
    }

    render() {
        const {
            isLoading,
            mode,
            setBuilderMode,
            setJsonMode,
            deleteMapping,
            theme,
        } = this.props

        const { source, error } = this.state

        return (
            <Container>
                <MappingBar
                    mode={mode}
                    setBuilderMode={setBuilderMode}
                    setJsonMode={setJsonMode}
                    deleteMapping={deleteMapping}
                    save={this.handleSave}
                    saveDisabled={!!error}
                />
                {error && (
                    <div style={{ color: '#c0392b', padding: '8px 16px' }}>
                        JSON error: {error}
                    </div>
                )}
                <Content isLoading={isLoading}>
                    <AceEditor
                        mode="json"
                        theme={theme.editor.theme}
                        value={source}
                        onChange={this.onChange}
                        onLoad={this.onEditorLoad}
                        readOnly={false}
                        name="editor"
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        editorProps={{
                            $blockScrolling: Infinity,
                        }}
                        fontSize={12}
                        wrapEnabled={false}
                        width="100%"
                        height="100%"
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 4,
                        }}
                    />
                </Content>
            </Container>
        )
    }
}

export default withTheme(MappingJsonEditor)
