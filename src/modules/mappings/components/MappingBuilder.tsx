import * as React from 'react'
import { InjectedFormikProps, withFormik } from 'formik'
import { Builder, Block, Input } from 'edikit'
import { IMapping, IMappingFormValues } from '../types'
import { IServerMappingsState } from '../store'
import { IServer } from '../../servers'
import { mappingValidationSchema } from '../validation'
import { mappingToFormValues, mappingFormValuesToMapping } from '../dto'
import { Container, Content } from './Mapping_styled'
import MappingBar from './MappingBar'
import { Grid } from './builder/Builder_styled'
import BuilderRequest from './builder/BuilderRequest'
import BuilderResponse from './builder/BuilderResponse'

interface IMappingBuilderProps {
    mapping: IMapping
    isLoading: boolean
    sync?: (values: IMapping) => void
    save(values: IMapping): void
    deleteMapping?: () => void
    mode: 'builder' | 'json' | 'curl'
    setBuilderMode(): void
    setJsonMode(): void
    setCurlMode?: () =>void
    serverMappings?: IServerMappingsState
    server?: IServer
}

interface IMappingBuilderState {
    isRequestOpened: boolean
    isResponseOpened: boolean
    requestParamsType: 'query' | 'headers' | 'cookies' | 'body'
}

const enhance = withFormik<IMappingBuilderProps, IMappingFormValues>({
    enableReinitialize: true,
    isInitialValid: true,
    mapPropsToValues: props => {
        return mappingToFormValues(props.mapping)
    },
    validationSchema: mappingValidationSchema,
    handleSubmit: (values, { props }) => {
        props.save(mappingFormValuesToMapping(values))
    }
})

class MappingBuilder extends React.Component<
    InjectedFormikProps<IMappingBuilderProps, IMappingFormValues>,
    IMappingBuilderState
> {
    constructor(props: any) {
        super(props)

        this.state = {
            isRequestOpened: true,
            isResponseOpened: true,
            requestParamsType: 'query',
        }
    }

    sync = () => {
        const { sync, values } = this.props
        if (sync !== undefined) {
            sync(mappingFormValuesToMapping(values))
        }
    }

    handleBlur = (e: React.SyntheticEvent) => {
        const { handleBlur, sync } = this.props
        handleBlur(e)
        if (sync !== undefined) this.sync()
    }

    toggleRequest = () => {
        this.setState({
            isRequestOpened: !this.state.isRequestOpened
        })
    }

    toggleResponse = () => {
        this.setState({
            isResponseOpened: !this.state.isResponseOpened
        })
    }

    updateRequestParamsType = (requestParamsType: 'query' | 'headers' | 'cookies' | 'body') => {
        this.setState({ requestParamsType })
    }

    getExistingFolders = (): string[] => {
        const { serverMappings } = this.props
        if (!serverMappings) return []

        const folders = new Set<string>()
        serverMappings.ids.forEach(mappingId => {
            const mappingState = serverMappings.byId[mappingId]
            if (mappingState && mappingState.mapping && mappingState.mapping.metadata && mappingState.mapping.metadata.folder) {
                const folder = mappingState.mapping.metadata.folder
                folders.add(folder)
                const segments = folder.split('/')
                let currentPath = ''
                segments.forEach(segment => {
                    currentPath = currentPath ? `${currentPath}/${segment}` : segment
                    folders.add(currentPath)
                })
            }
        })
        return Array.from(folders).sort()
    }

    handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { handleChange, setFieldTouched } = this.props
        const inputValue = e.target.value
        const newValue = inputValue.trim() === '' ? undefined : inputValue.trim()
        handleChange({
            target: {
                id: 'folder',
                value: newValue,
            }
        } as any)
        setFieldTouched('folder', true)
    }

    render() {
        const {
            isLoading,
            deleteMapping,
            values,
            errors,
            touched,
            handleChange,
            mode,
            setBuilderMode,
            setJsonMode,
            setCurlMode,
            submitForm,
        } = this.props
        const {
            isRequestOpened,
            isResponseOpened,
            requestParamsType,
        } = this.state

        return (
            <Container>
                <MappingBar
                    mode={mode}
                    setBuilderMode={setBuilderMode}
                    setJsonMode={setJsonMode}
                    setCurlMode={setCurlMode}
                    save={submitForm}
                    deleteMapping={deleteMapping}
                />
                <Content isLoading={isLoading}>
                    <Builder>
                        <Block withLink={true}>
                            <Grid>
                                <label htmlFor="name">
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={this.handleBlur}
                                    style={{
                                        gridColumnStart: 2,
                                        gridColumnEnd: 8,
                                    }}
                                />
                                <label htmlFor="folder" style={{ gridColumnStart: 1 }}>
                                    Folder
                                </label>
                                <Input
                                    id="folder"
                                    list="folders"
                                    placeholder="Select or type folder name..."
                                    value={values.folder || ''}
                                    onChange={this.handleFolderChange}
                                    onBlur={this.handleBlur}
                                    style={{ gridColumnStart: 2, gridColumnEnd: 4 }}
                                />
                                <datalist id="folders">
                                    {this.getExistingFolders().map(folder => (
                                        <option key={folder} value={folder} />
                                    ))}
                                </datalist>
                            </Grid>
                        </Block>
                        <BuilderRequest
                            isOpened={isRequestOpened}
                            onToggle={this.toggleRequest}
                            values={values}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={this.handleBlur}
                            paramsType={requestParamsType}
                            updateParamsType={this.updateRequestParamsType}
                            server={this.props.server}
                        />
                        <BuilderResponse
                            isOpened={isResponseOpened}
                            onToggle={this.toggleResponse}
                            values={values}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={this.handleBlur}
                            sync={this.sync}
                        />
                    </Builder>
                </Content>
            </Container>
        )
    }
}

export default enhance(MappingBuilder)