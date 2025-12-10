import * as React from 'react'
import { Container } from './Tree_styled'
import TreeNode from './TreeNode'
import { ITreeNode, TreeClickHandler, TreeIconGetter } from '../'

export interface ITreeProps<NodeData> {
    root: ITreeNode<NodeData>
    onClick: TreeClickHandler<NodeData>,
    getIcon?: TreeIconGetter<NodeData>
    openedIds: string[]
    onClone?: (node: ITreeNode<NodeData>) => void
    onDelete?: (node: ITreeNode<NodeData>) => void
}

export interface ITreeState<NodeData> {
    current?: ITreeNode<NodeData>
}

export default class Tree<NodeData> extends React.Component<ITreeProps<NodeData>, ITreeState<NodeData>> {
    render() {
        const {
            root,
            openedIds,
            onClick,
            getIcon
        } = this.props

        return (
            <Container>
                <TreeNode
                    node={root}
                    openedIds={openedIds}
                    onClick={onClick}
                    getIcon={getIcon}
                    depth={0}
                    onClone={this.props.onClone}
                    onDelete={this.props.onDelete}
                />
            </Container>
        )
    }
}
