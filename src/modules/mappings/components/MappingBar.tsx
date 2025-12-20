import * as React from 'react'
import { Button, ConfirmationModal } from 'edikit'
import styled from 'styled-components'
import {
    Save as SaveIcon,
    Code as JsonModeIcon,
    Grid as BuilderModeIcon,
    Trash2 as DeleteIcon,
    Terminal as BeautifyIcon,
    Terminal as CurlModeIcon,
    // AlertOctagon as HasErrorIcon,
    // X as CancelIcon,
    // Copy as CloneIcon,
} from 'react-feather'

const Container = styled.div`
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${props => props.theme.builder.background};
`

const ButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
`

const actionButtonStyle = {
    fontSize: '11px',
    lineHeight: '1.6em',
    height: '32px',
    width: '32px',
    alignItems: 'center',
    padding: 0,
    justifyContent: 'center',
    marginLeft: '6px',
}

interface IMappingBarProps {
    mode: 'builder' | 'json' | 'curl'
    setBuilderMode(): void
    setJsonMode(): void
    setCurlMode?: () => void
    save?: () => void
    saveDisabled?: boolean
    deleteMapping?: () => void
    beautify?: () => void
}

interface IMappingBarState {
    isDeleteModalOpen: boolean
}

export default class MappingBar extends React.Component<IMappingBarProps, IMappingBarState> {
    constructor(props: IMappingBarProps) {
        super(props)
        this.state = {
            isDeleteModalOpen: false,
        }
    }

    handleDeleteClick = () => {
        this.setState({ isDeleteModalOpen: true })
    }

    handleDeleteConfirm = () => {
        if (this.props.deleteMapping) {
            this.props.deleteMapping()
        }
        this.setState({ isDeleteModalOpen: false })
    }

    handleDeleteCancel = () => {
        this.setState({ isDeleteModalOpen: false })
    }

    render() {
        const {
            mode,
            setBuilderMode,
            setJsonMode,
            setCurlMode,
            save,
            deleteMapping,
        } = this.props

        return (
            <>
                <Container>
                    <ButtonsWrapper>
                        <Button
                            onClick={setBuilderMode}
                            style={{
                                paddingLeft: '6px',
                                fontSize: '12px',
                                lineHeight: '1.6em',
                            }}
                            variant={mode === 'builder' ? 'primary' : 'default'}
                            icon={<BuilderModeIcon size={14} style={{ marginRight: '9px' }}/>}
                        >
                            builder
                        </Button>
                        <Button
                            onClick={setJsonMode}
                            style={{
                                marginLeft: '6px',
                                paddingLeft: '6px',
                                fontSize: '12px',
                                lineHeight: '1.6em',
                            }}
                            variant={mode === 'json' ? 'primary' : 'default'}
                            icon={<JsonModeIcon size={14} style={{ marginRight: '9px' }}/>}
                        >
                            json
                        </Button>
                        {setCurlMode !== undefined && (
                            <Button
                            onClick={setCurlMode}
                            style={{
                                marginLeft: '6px',
                                paddingLeft: '6px',
                                fontSize: '12px',
                                lineHeight: '1.6em',
                            }}
                            variant={mode === 'curl' ? 'primary' : 'default'}
                            icon={<CurlModeIcon size={14} style={{ marginRight: '9px' }}/>}
                            >
                                curl
                            </Button>
                        )}
                    </ButtonsWrapper>
                    <ButtonsWrapper>
                        {this.props.mode === 'json' && this.props.beautify !== undefined && (
                            <Button
                                onClick={this.props.beautify}
                                style={actionButtonStyle}
                                variant="default"
                                icon={<BeautifyIcon size={16}/>}
                            />
                        )}
                        {save !== undefined && (
                            <Button
                                onClick={save}
                                disabled={this.props.saveDisabled}
                                style={actionButtonStyle}
                                variant="primary"
                                icon={<SaveIcon size={16}/>}
                            />
                        )}
                        {deleteMapping !== undefined && (
                            <Button
                                onClick={this.handleDeleteClick}
                                style={actionButtonStyle}
                                variant="danger"
                                icon={<DeleteIcon size={16}/>}
                            />
                        )}
                        {/*
                        <Button
                            style={actionButtonStyle}
                            variant="primary"
                            icon={<CloneIcon size={14}/>}
                        />
                        <Button
                            style={actionButtonStyle}
                            variant="warning"
                            icon={<CancelIcon size={16}/>}
                        />
                        */}
                    </ButtonsWrapper>
                </Container>
                {deleteMapping !== undefined && (
                    <ConfirmationModal
                        isOpen={this.state.isDeleteModalOpen}
                        title="Delete Mapping"
                        content="Are you sure you want to delete this mapping? This action cannot be undone."
                        confirmButtonText="Delete"
                        cancelButtonText="Cancel"
                        confirmButtonVariant="danger"
                        onConfirm={this.handleDeleteConfirm}
                        onCancel={this.handleDeleteCancel}
                    />
                )}
            </>
        )
    }
}
