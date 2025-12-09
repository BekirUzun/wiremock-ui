import * as React from 'react'
import { withTheme } from 'styled-components'
import { Server as ServerIcon, PlusCircle } from 'react-feather'
import {IPaneContent, ITheme} from 'edikit'
import { Tree, ITreeNode } from './Tree'
import { IData } from '../../../types'
import { IServer } from '../../servers'
import MapingIcon from '../../mappings/components/MappingIcon'

export interface IExplorerProps {
    tree: ITreeNode
    servers: IServer[]
    loadServerMappings(server: IServer): void
    addContentToCurrentPane(content: IPaneContent<IData>): void
    theme: ITheme
}

export interface IExplorerState {
    openedIds: string[]
}

class Explorer extends React.Component<IExplorerProps, IExplorerState> {
    constructor(props: IExplorerProps) {
        super(props)

        // By default open root, the first server (if any) and its mappings node (if any)
        const openedIds: string[] = ['root']
        const { tree } = props

        if (tree && tree.children && tree.children.length > 0) {
            const firstServer = tree.children[0]
            if (firstServer && firstServer.id) {
                openedIds.push(firstServer.id)

                const mappingsNode = firstServer.children && firstServer.children.find(c => c.type === 'mappings')
                if (mappingsNode && mappingsNode.id) {
                    openedIds.push(mappingsNode.id)
                }
            }
        }

        this.state = {
            openedIds,
        }
    }
    
    componentDidMount() {
        const { tree, servers, loadServerMappings } = this.props

        if (tree && tree.children && tree.children.length > 0) {
            const firstServerNode = tree.children[0]
            const mappingsNode = firstServerNode.children && firstServerNode.children.find(c => c.type === 'mappings')
            if (mappingsNode && firstServerNode.id) {
                const server = servers.find(s => s.name === firstServerNode.id)
                if (server) {
                    loadServerMappings(server)
                }
            }
        }
    }

    getTreeNodeIcon = (node: ITreeNode): React.ReactNode => {
        const { theme } = this.props
        if (node.type === 'server') {
            return <ServerIcon size={12} color={theme.colors.accent}/>
        }

        if (node.type === 'server.create' || node.type === 'mapping.create') {
            return <PlusCircle size={14} color={theme.colors.accent}/>
        }

        if (node.type === 'mapping') {
            return <MapingIcon/>
        }

        return
    }

    handleNodeClick = (node: ITreeNode) => {
        const {
            loadServerMappings,
            servers,
            addContentToCurrentPane,
        } = this.props

        if (node.type === 'server.create') {
            addContentToCurrentPane({
                id: 'server.create',
                type: 'server.create',
                isCurrent: true,
                isUnique: true,
            })
        }

        if (node.type === 'mappings' && node.data !== undefined) {
            const server = servers.find(s => s.name === node.data!.serverName)
            if (server !== undefined) {
                loadServerMappings(server)
            }
        }

        if (node.type === 'mapping' && node.data !== undefined) {
            const server = servers.find(s => s.name === node.data!.serverName)
            if (server !== undefined) {
                addContentToCurrentPane({
                    id: node.id,
                    type: 'mapping',
                    isCurrent: true,
                    isUnique: false,
                    data: {
                        serverName: server.name,
                        mappingId: node.data.mappingId,
                    },
                })
            }
        }

        if (node.type === 'server.create') {
            addContentToCurrentPane({
                id: 'server.create',
                type: 'server.create',
                isCurrent: true,
                isUnique: true,
            })
        }

        if (node.type === 'mapping.create' && node.data !== undefined) {
            addContentToCurrentPane({
                id: node.id,
                type: 'mapping.create',
                isCurrent: true,
                isUnique: false,
                data: {
                    serverName: node.data.serverName,
                    creationId: node.data.creationId,
                },
            })
        }

        let openedIds
        if (this.state.openedIds.includes(node.id)) {
            openedIds = this.state.openedIds.filter(id => id !== node.id)
        } else {
            openedIds = [...this.state.openedIds, node.id]
        }

        this.setState({
            openedIds
        })
    }

    render() {
        const { tree } = this.props
        const { openedIds } = this.state

        return (
            <Tree
                root={tree}
                openedIds={openedIds}
                getIcon={this.getTreeNodeIcon}
                onClick={this.handleNodeClick}
            />
        )
    }
}

export default withTheme(Explorer)
