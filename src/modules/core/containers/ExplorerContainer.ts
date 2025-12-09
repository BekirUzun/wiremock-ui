import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { panesCurrentContentsSelector, uuid } from 'edikit'
import { ITreeNode } from '../components/Tree'
import { IApplicationState } from '../../../store'
import { loadServerMappings, getMappingUrl, deleteMappingRequest, fetchMappingRequest, createMappingRequest } from '../../mappings'
import { IMappingsState } from '../../mappings/store'
import { IServer } from '../../servers'
import Explorer from '../components/Explorer'

const mapStateToProps = (
    {
        panes,
        servers: { servers },
        mappings: serversMappings
    }: IApplicationState
): {
    tree: ITreeNode
    servers: IServer[]
    serversMappings: typeof serversMappings
} => {
    const currentContentIds: string[] = panesCurrentContentsSelector(panes, 'default')
        .map(({ id }) => id)

    const tree: ITreeNode = {
        id: 'root',
        type: 'root',
        label: 'servers',
        children: []
    }

    servers.forEach(server => {
        const serverNode = {
            id: server.name,
            label: server.name,
            type: 'server',
            children: [] as ITreeNode[],
        }

        const mappings = serversMappings[server.name]
        if (mappings !== undefined) {
            const creationId = uuid()
            serverNode.children.push({
                id: `${server.name}.mapping.create.${creationId}`,
                type: 'mapping.create',
                label: 'create mapping',
                data: {
                    serverName: server.name,
                    creationId,
                },
            })

            const mappingsNode: ITreeNode = {
                id: `${server.name}.mappings`,
                type: 'mappings',
                label: 'mappings',
                data: {
                    serverName: server.name,
                },
                children: [],
            }
            mappings.ids.forEach(mappingId => {
                const mapping = mappings.byId[mappingId].mapping
                if (mapping !== undefined) {
                    mappingsNode.children!.push({
                        id: mappingId,
                        type: 'mapping',
                        label: mapping.name || `${mapping.request.method} ${getMappingUrl(mapping)}`,
                        isCurrent: currentContentIds.includes(mappingId),
                        data: {
                            serverName: server.name,
                            mappingId,
                        },
                    })
                }
            })
            serverNode.children.push(mappingsNode)
        }

        tree.children!.push(serverNode)
    })

    tree.children!.push({
        id: 'server.create',
        type: 'server.create',
        label: 'create server',
    })

    return { tree, servers, serversMappings }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadServerMappings: (server: IServer) => {
        dispatch(loadServerMappings(server))
    },
    cloneMapping: (serverName: string, mappingId: string, serversMappings: IMappingsState, servers: IServer[]) => {
        const server = servers.find(s => s.name === serverName)
        if (!server) return

        const serverMappings = serversMappings[serverName]
        if (!serverMappings) return

        const mappingState = serverMappings.byId[mappingId]
        if (!mappingState || !mappingState.mapping) {
            // If mapping is not loaded, fetch it first
            // For now, we'll just return - in a real scenario, we might want to show an error
            // or fetch the mapping and then clone it
            return
        }

        const mapping = mappingState.mapping
        const creationId = uuid()
        const clonedMapping = {
            ...mapping,
            name: mapping.name ? `${mapping.name} (copy)` : undefined,
        }
        // Remove id and uuid so a new one is created
        delete (clonedMapping as any).id
        delete (clonedMapping as any).uuid

        dispatch(createMappingRequest(serverName, creationId, clonedMapping))
    },
    deleteMapping: (serverName: string, mappingId: string) => {
        dispatch(deleteMappingRequest(serverName, mappingId))
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Explorer)
