import * as React from 'react'
import { X as CloseIcon } from 'react-feather'
import { Button } from '../button'
import { Overlay, ModalContainer, ModalHeader, ModalTitle, ModalBody, ModalFooter, CloseButton } from './ConfirmationModal_styled'

export interface IConfirmationModalProps {
    isOpen: boolean
    title: string
    content: React.ReactNode
    confirmButtonText?: string
    cancelButtonText?: string
    confirmButtonVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    onConfirm: () => void
    onCancel: () => void
}

interface IConfirmationModalState {
    isClosing: boolean
}

export default class ConfirmationModal extends React.Component<IConfirmationModalProps, IConfirmationModalState> {
    static defaultProps = {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        confirmButtonVariant: 'danger',
    }

    private closeTimeout: number | null = null

    constructor(props: IConfirmationModalProps) {
        super(props)
        this.state = {
            isClosing: false,
        }
    }

    handleClose = () => {
        this.setState({ isClosing: true })
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout)
        }
        this.closeTimeout = window.setTimeout(() => {
            this.props.onCancel()
            this.setState({ isClosing: false })
        }, 200)
    }

    handleConfirm = () => {
        this.setState({ isClosing: true })
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout)
        }
        this.closeTimeout = window.setTimeout(() => {
            this.props.onConfirm()
            this.setState({ isClosing: false })
        }, 200)
    }

    handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            this.handleClose()
        }
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.props.isOpen && !this.state.isClosing) {
            this.handleClose()
        }
    }

    componentDidMount() {
        if (this.props.isOpen) {
            document.body.style.overflow = 'hidden'
            document.addEventListener('keydown', this.handleKeyDown)
        }
    }

    componentDidUpdate(prevProps: IConfirmationModalProps) {
        if (this.props.isOpen !== prevProps.isOpen) {
            if (this.props.isOpen) {
                document.body.style.overflow = 'hidden'
                document.addEventListener('keydown', this.handleKeyDown)
                this.setState({ isClosing: false })
            } else {
                document.body.style.overflow = ''
                document.removeEventListener('keydown', this.handleKeyDown)
                this.setState({ isClosing: false })
            }
        }
    }

    componentWillUnmount() {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', this.handleKeyDown)
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout)
        }
    }

    render() {
        const {
            isOpen,
            title,
            content,
            confirmButtonText,
            cancelButtonText,
            confirmButtonVariant,
            onConfirm,
        } = this.props
        const { isClosing } = this.state

        if (!isOpen) return null

        return (
            <Overlay isClosing={isClosing} onClick={this.handleOverlayClick}>
                <ModalContainer isClosing={isClosing} onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>{title}</ModalTitle>
                        <CloseButton onClick={this.handleClose}>
                            <CloseIcon size={20} />
                        </CloseButton>
                    </ModalHeader>
                    <ModalBody>{content}</ModalBody>
                    <ModalFooter>
                        <Button
                            variant="default"
                            size="normal"
                            onClick={this.handleClose}
                        >
                            {cancelButtonText}
                        </Button>
                        <Button
                            variant={confirmButtonVariant!}
                            size="normal"
                            onClick={this.handleConfirm}
                        >
                            {confirmButtonText}
                        </Button>
                    </ModalFooter>
                </ModalContainer>
            </Overlay>
        )
    }
}

