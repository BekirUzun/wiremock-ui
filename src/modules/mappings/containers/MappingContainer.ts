import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { IApplicationState } from '../../../store'
import { IServer } from '../../servers'
import Mapping from '../components/Mapping'
import { IMapping } from '../types'
import { IMappingsState } from '../store/index'
import {
    fetchMappingRequest,
    initMappingWorkingCopy,
    syncMappingWorkingCopy,
    updateMappingRequest,
    deleteMappingRequest,
    IMappingState,
} from '../store'

interface IOwnProps {
    serverName: string
    mappingId: string
}

interface IPropsFromState {
    server?: IServer
    mapping?: IMapping
    isLoading: boolean
    serverMappings?: IMappingsState[string]
}

const mapStateToProps = (
    {
        servers: { servers },
        mappings: serversMappings,
    }: IApplicationState,
    { serverName, mappingId }: IOwnProps
): IPropsFromState => {
    const server = servers.find(s => s.name === serverName)

    let mapping: IMappingState
    const serverMappings = serversMappings[serverName]
    if (serverMappings !== undefined) {
        mapping = serverMappings.byId[mappingId]
    }

    if (mapping! === undefined) {
        throw new Error(`no mapping found for server: '${serverName}' fot id: ${mappingId}`)
    }

    return {
        server,
        isLoading: mapping!.isFetching || mapping!.isUpdating || mapping!.isDeleting,
        mapping: mapping!.workingCopy,
        serverMappings,
    }
}


const mapDispatchToProps = (dispatch: Dispatch, props: IOwnProps) => ({
    fetchMapping: () => {
        dispatch(fetchMappingRequest(
            props.serverName,
            props.mappingId
        ))
    },
    initWorkingCopy: () => {
        dispatch(initMappingWorkingCopy(
            props.serverName,
            props.mappingId
        ))
    },
    syncWorkingCopy: (update: IMapping) => {
        dispatch(syncMappingWorkingCopy(
            props.serverName,
            props.mappingId,
            update
        ))
    },
    updateMapping: (mapping: IMapping) => {
        // ensure mapping.id matches the current mappingId (user may have edited or omitted it in raw JSON)
        const mappingToSave = { ...mapping, id: props.mappingId }
        dispatch(updateMappingRequest(
            props.serverName,
            props.mappingId,
            mappingToSave
        ))
    },
    deleteMapping: () => {
        dispatch(deleteMappingRequest(
            props.serverName,
            props.mappingId
        ))
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Mapping)
