import * as React from 'react'
import { withTheme } from 'styled-components'
import AceEditor from 'react-ace'
import { ITheme } from 'edikit'
import { IMapping } from '../types'
import { IServer } from '../../servers'
import { Container, Content } from './Mapping_styled'
import MappingBar from './MappingBar'
import { generateCurlCommand } from '../utils/curlGenerator'

interface IMappingCurlEditorProps {
    mapping: IMapping
    server?: IServer
    isLoading: boolean
    deleteMapping?: () => void
    mode: 'builder' | 'json' | 'curl'
    setBuilderMode(): void
    setJsonMode(): void
    setCurlMode(): void
    theme: ITheme
}

class MappingCurlEditor extends React.Component<IMappingCurlEditorProps> {
    getCurlCommand = (): string => {
        return generateCurlCommand(this.props.mapping, this.props.server)
    }

    render() {
        const {
            isLoading,
            mode,
            setBuilderMode,
            setJsonMode,
            setCurlMode,
            deleteMapping,
            theme,
        } = this.props

        const curlCommand = this.getCurlCommand()

        return (
            <Container>
                <MappingBar
                    mode={mode}
                    setBuilderMode={setBuilderMode}
                    setJsonMode={setJsonMode}
                    setCurlMode={setCurlMode}
                    deleteMapping={deleteMapping}
                />
                <Content isLoading={isLoading}>
                    <AceEditor
                        mode="sh"
                        theme={theme.editor.theme}
                        value={curlCommand}
                        readOnly={true}
                        name="curl-editor"
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        editorProps={{
                            $blockScrolling: Infinity,
                        }}
                        fontSize={12}
                        wrapEnabled={true}
                        width="100%"
                        height="100%"
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                    />
                </Content>
            </Container>
        )
    }
}

export default withTheme(MappingCurlEditor)

