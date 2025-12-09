import * as React from 'react'
import { withTheme } from 'styled-components'
import { Folder, ChevronRight, ChevronDown, MoreVertical } from 'react-feather'
import { Icons, Item, CurrentIndicator, ActionsButton } from './TreeNode_styled'
import { ITreeNode, TreeClickHandler, TreeIconGetter } from '../'
import { ContextMenu } from './ContextMenu'

const iconSize = 12

export interface ITreeNodeProps<NodeData> {
    node: ITreeNode<NodeData>
    openedIds: string[]
    depth: number
    theme: any
    onClick: TreeClickHandler<NodeData>
    getIcon?: TreeIconGetter<NodeData>
    onClone?: (node: ITreeNode<NodeData>) => void
    onDelete?: (node: ITreeNode<NodeData>) => void
}

interface ITreeNodeState {
    showContextMenu: boolean
    contextMenuX: number
    contextMenuY: number
    isHovered: boolean
}

class TreeNode<NodeData> extends React.Component<ITreeNodeProps<NodeData>, ITreeNodeState> {
    static defaultProps = {
        depth: 0,
    }

    private itemRef: HTMLDivElement | null = null

    constructor(props: ITreeNodeProps<NodeData>) {
        super(props)
        this.state = {
            showContextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
            isHovered: false,
        }
    }

    setItemRef = (ref: HTMLDivElement | null) => {
        this.itemRef = ref
    }

    handleClick = (e: React.MouseEvent) => {
        const { onClick, node } = this.props
        if (e.target === this.itemRef || (this.itemRef && this.itemRef.contains(e.target as Node))) {
            const target = e.target as HTMLElement
            if (target.closest('.tree-node-actions')) {
                return
            }
        }
        onClick(node)
    }

    handleActionsClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (this.itemRef) {
            const rect = this.itemRef.getBoundingClientRect()
            this.setState({
                showContextMenu: true,
                contextMenuX: rect.right - 130,
                contextMenuY: rect.top,
            })
        }
    }

    handleCloseContextMenu = () => {
        this.setState({ showContextMenu: false })
    }

    handleMouseEnter = () => {
        this.setState({ isHovered: true })
    }

    handleMouseLeave = () => {
        this.setState({ isHovered: false })
    }

    handleClone = () => {
        const { onClone, node } = this.props
        if (onClone) {
            onClone(node)
        }
    }

    handleDelete = () => {
        const { onDelete, node } = this.props
        if (onDelete) {
            onDelete(node)
        }
    }

    render() {
        const {
            node,
            openedIds,
            depth,
            onClick,
            getIcon,
            theme,
        } = this.props

        let icon = node.icon
        if (icon === undefined && getIcon !== undefined) {
            icon = getIcon(node)
        }
        if (icon === undefined && node.children !== undefined) {
            icon = (
                <Folder
                    color={theme.colors.muted}
                    size={iconSize}
                    style={{ flexShrink: 0 }}
                />
            )
        }

        const isOpened = openedIds.includes(node.id)
        const iconCount = node.children !== undefined ? 2 : 1

        const isMapping = node.type === 'mapping'
        const showActions = isMapping && (this.state.isHovered || this.state.showContextMenu)
        const contextMenuItems = isMapping ? [
            {
                label: 'Clone',
                onClick: this.handleClone,
            },
            {
                label: 'Delete',
                onClick: this.handleDelete,
                isDanger: true,
            },
        ] : []

        return (
            <React.Fragment>
                <div ref={this.setItemRef}>
                    <Item
                        isDir={!!(node.children && node.children.length > 0)}
                        isCurrent={node.isCurrent}
                        depth={depth}
                        onClick={this.handleClick}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                    >
                    <Icons iconCount={iconCount}>
                        {node.children !== undefined && isOpened && (
                            <ChevronDown size={iconSize} style={{ flexShrink: 0 }} />
                        )}
                        {node.children !== undefined && !isOpened && (
                            <ChevronRight size={iconSize} style={{ flexShrink: 0 }} />
                        )}
                        {icon}
                    </Icons>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                        {node.label}
                    </span>
                    {showActions && (
                        <ActionsButton
                            className="tree-node-actions"
                            onClick={this.handleActionsClick}
                        >
                            <MoreVertical size={14} />
                        </ActionsButton>
                    )}
                    {node.isCurrent === true && <CurrentIndicator/>}
                    </Item>
                </div>
                {this.state.showContextMenu && (
                    <ContextMenu
                        x={this.state.contextMenuX}
                        y={this.state.contextMenuY}
                        onClose={this.handleCloseContextMenu}
                        items={contextMenuItems}
                    />
                )}
                {node.children && node.children.length > 0 && isOpened && (
                    <React.Fragment>
                        {node.children.map(child => (
                            <ThemedTreeNode
                                key={child.id}
                                node={child}
                                openedIds={openedIds}
                                onClick={onClick}
                                getIcon={getIcon}
                                depth={depth + 1}
                                onClone={this.props.onClone}
                                onDelete={this.props.onDelete}
                            />
                        ))}
                    </React.Fragment>
                )}
            </React.Fragment>
        )
    }
}

const ThemedTreeNode = withTheme(TreeNode)

export default ThemedTreeNode
