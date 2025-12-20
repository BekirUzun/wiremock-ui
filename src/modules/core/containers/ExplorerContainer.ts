import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { panesCurrentContentsSelector, uuid } from 'edikit'
import { ITreeNode } from '../components/Tree'
import { IApplicationState } from '../../../store'
import { loadServerMappings, getMappingUrl, deleteMappingRequest, fetchMappingRequest, createMappingRequest } from '../../mappings'
import { IMappingsState } from '../../mappings/store'
import { IServer } from '../../servers'
import Explorer from '../components/Explorer'

const createMappingNode = (
    mappingId: string,
    mapping: any,
    serverName: string,
    currentContentIds: string[]
): ITreeNode => ({
    id: mappingId,
    type: 'mapping',
    label: mapping.name || getMappingUrl(mapping),
    isCurrent: currentContentIds.includes(mappingId),
    data: {
        serverName,
        mappingId,
    },
})

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

            interface IFolderNode {
                node: ITreeNode
                children: Map<string, IFolderNode>
                mappings: Array<{ id: string, mapping: any }>
            }

            const rootFolderNodes = new Map<string, IFolderNode>()
            const mappingsWithoutFolder: Array<{ id: string, mapping: any }> = []

            mappings.ids.forEach(mappingId => {
                const mappingState = mappings.byId[mappingId];
                if (!mappingState || mappingState.mapping === undefined) return;

                const mapping = mappingState.mapping;
                const folder = mapping.metadata && mapping.metadata.folder;
                if (!folder) {
                    mappingsWithoutFolder.push({ id: mappingId, mapping });
                    return;
                }

                const pathSegments = folder.split('/').filter(segment => segment.trim() !== '');
                if (pathSegments.length === 0) {
                    mappingsWithoutFolder.push({ id: mappingId, mapping });
                    return;
                }

                let currentMap = rootFolderNodes;
                let currentPath = '';

                pathSegments.forEach((segment, index) => {
                    const isLeaf = index === pathSegments.length - 1;
                    currentPath = currentPath ? `${currentPath}/${segment}` : segment;

                    if (!currentMap.has(segment)) {
                        const folderNode: ITreeNode = {
                            id: `${server.name}.mappings.folder.${currentPath}`,
                            type: 'folder',
                            label: segment,
                            data: {
                                serverName: server.name,
                                folder: currentPath,
                            },
                            children: [],
                        };
                        currentMap.set(segment, {
                            node: folderNode,
                            children: new Map(),
                            mappings: [],
                        });
                    }

                    const folderNodeData = currentMap.get(segment)!;
                    if (isLeaf) {
                        folderNodeData.mappings.push({ id: mappingId, mapping });
                    }
                    currentMap = folderNodeData.children;
                });
            });

            const buildFolderTree = (folderNodes: Map<string, IFolderNode>): ITreeNode[] => {
                const result: ITreeNode[] = [];
                const sortedKeys = Array.from(folderNodes.keys()).sort();

                sortedKeys.forEach(key => {
                    const folderNodeData = folderNodes.get(key)!;
                    const folderNode = folderNodeData.node;

                    if (folderNodeData.children.size > 0) {
                        folderNode.children = buildFolderTree(folderNodeData.children);
                    }

                    folderNodeData.mappings.forEach(({ id: mappingId, mapping }) => {
                        if (!folderNode.children) {
                            folderNode.children = [];
                        }
                        folderNode.children.push(
                            createMappingNode(mappingId, mapping, server.name, currentContentIds)
                        );
                    });

                    result.push(folderNode);
                });

                return result;
            }

            mappingsNode.children!.push(...buildFolderTree(rootFolderNodes))

            mappingsWithoutFolder.forEach(({ id: mappingId, mapping }) => {
                mappingsNode.children!.push(
                    createMappingNode(mappingId, mapping, server.name, currentContentIds)
                )
            })

            serverNode.children.push(mappingsNode)
        }

        tree.children!.push(serverNode)
    })

    const isServerCreationDisabled = process.env.REACT_APP_SERVER_CREATION_DISABLED === 'true'

    if (!isServerCreationDisabled) {
        tree.children!.push({
            id: 'server.create',
            type: 'server.create',
            label: 'create server',
        })
    }

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
        if (!mappingState || !mappingState.mapping) return

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
