import * as React from 'react'
import { X as RemoveIcon } from 'react-feather'
import { IContentType, IPane, IPaneContent } from '../types'
import { Container, Label, RemoveButton } from './PaneHeaderButton_styled'

export interface IPaneHeaderButtonProps<ContentData> {
    pane: IPane<ContentData>
    contentTypes: Array<IContentType<ContentData>>
    content: IPaneContent<ContentData>
    setCurrentContent: (contentId: string) => void
    removeContent: (contentId: string) => void
}

class PaneHeaderButton<ContentData> extends React.Component<IPaneHeaderButtonProps<ContentData>> {
    handleOpen = (e: React.SyntheticEvent) => {
        // prevents setCurrentPane
        e.stopPropagation()

        const { content, setCurrentContent } = this.props
        setCurrentContent(content.id)
    }

    handleRemove = (e: React.SyntheticEvent) => {
        // prevents setCurrentPane
        e.stopPropagation()

        const { content, removeContent } = this.props
        removeContent(content.id)
    }

    handleMouseDown = (e: React.MouseEvent) => {
        // Middle mouse button (button === 1) closes the tab
        if (e.button === 1) {
            e.preventDefault()
            this.handleRemove(e)
        }
    }

    render() {
        const { pane, content, contentTypes, removeContent } = this.props

        const contentType = contentTypes.find(ct => ct.id === content.type)
        if (contentType === undefined) {
            throw new Error(`unsupported content type: ${content.type}\n${JSON.stringify(content)}`)
        }

        const renderContext = { content, pane, extra: {
            close: () => { removeContent(content.id) }
        }}

        const label = contentType.renderButton(renderContext)
        const icon = contentType.renderIcon(renderContext)

        return (
            <Container isCurrent={content.isCurrent} onClick={this.handleOpen} onMouseDown={this.handleMouseDown}>
                {icon}
                <Label>{label}</Label>
                <RemoveButton onClick={this.handleRemove}>
                    <RemoveIcon size={13} />
                </RemoveButton>
            </Container>
        )
    }
}

export default PaneHeaderButton
