import * as React from 'react'
import { InjectedFormikProps, withFormik } from 'formik'
import { Builder, Block, Input, Select } from 'edikit'
import { IMapping, IMappingFormValues } from '../types'
import { IServerMappingsState } from '../store'
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
    mode: 'builder' | 'json'
    setBuilderMode(): void
    setJsonMode(): void
    serverMappings?: IServerMappingsState
}

interface IMappingBuilderState {
    isRequestOpened: boolean
    isResponseOpened: boolean
    requestParamsType: 'query' | 'headers' | 'cookies' | 'body'
    newFolderInput: string
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
            newFolderInput: '',
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
                folders.add(mappingState.mapping.metadata.folder)
            }
        })
        return Array.from(folders).sort()
    }

    handleFolderSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { setFieldValue, setFieldTouched } = this.props
        const newValue = e.target.value === '' ? undefined : e.target.value
        setFieldValue('folder', newValue)
        setFieldTouched('folder', true)
        this.setState({ newFolderInput: '' })        
    }

    handleNewFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { handleChange } = this.props
        const inputValue = e.target.value
        this.setState({ newFolderInput: inputValue })
        const newValue = inputValue.trim() === '' ? undefined : inputValue.trim()
        handleChange({
            target: {
                id: 'folder',
                value: newValue,
            }
        } as any)
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
                                        gridColumnEnd: 9,
                                    }}
                                />
                                <label htmlFor="folder-select" style={{ gridColumnStart: 1 }}>
                                    Folder
                                </label>
                                <Select
                                    id="folder-select"
                                    value={values.folder && this.getExistingFolders().includes(values.folder) ? values.folder : ''}
                                    onChange={this.handleFolderSelectChange}
                                    style={{ gridColumnStart: 2}}
                                >
                                    <option value="">No folder</option>
                                    {this.getExistingFolders().map(folder => (
                                        <option key={folder} value={folder}>{folder}</option>
                                    ))}
                                </Select>
                                <label htmlFor="folder" style={{ gridColumnStart: 4 }}>
                                    Create Folder
                                </label>
                                <Input
                                    id="folder"
                                    placeholder="Type to create new folder..."
                                    value={this.state.newFolderInput}
                                    onChange={this.handleNewFolderInputChange}
                                    onBlur={this.handleBlur}
                                    style={{ gridColumnStart: 5 }}
                                />
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