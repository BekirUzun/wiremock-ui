import * as React from 'react'
import { PlusCircle } from 'react-feather'
import { connect } from 'react-redux'
import { IContentRenderContext } from 'edikit'
import { IData } from '../../types'
import { IApplicationState } from '../../store'
import MappingIcon from './components/MappingIcon'
import MappingContainer from './containers/MappingContainer'
import CreateMappingContainer from './containers/CreateMappingContainer'
import { IMapping } from './types'
import { getMappingUrl } from './dto'

interface IMappingButtonLabelProps {
    serverName: string
    mappingId: string
    mapping?: IMapping
}

const MappingButtonLabel: React.SFC<IMappingButtonLabelProps> = ({ mapping }: IMappingButtonLabelProps) => {
    if (mapping === undefined) {
        return <>mapping</>
    }

    const label = mapping.name || getMappingUrl(mapping)
    return <>{label}</>
}

const mapStateToProps = (
    state: IApplicationState,
    ownProps: { serverName: string; mappingId: string }
) => {
    const { serverName, mappingId } = ownProps
    const serverMappings = state.mappings[serverName]
    
    let mapping: IMapping | undefined
    if (serverMappings !== undefined) {
        const mappingState = serverMappings.byId[mappingId]
        if (mappingState !== undefined) {
            mapping = mappingState.mapping
        }
    }

    return {
        mapping,
    }
}

const ConnectedMappingButtonLabel = connect(mapStateToProps)(MappingButtonLabel)

interface IMappingIconProps {
    serverName: string
    mappingId: string
    mapping?: IMapping
}

const MappingIconWrapper: React.SFC<IMappingIconProps> = ({ mapping }: IMappingIconProps) => {
    return <MappingIcon method={mapping && mapping.request && mapping.request.method} />
}

const ConnectedMappingIcon = connect(mapStateToProps)(MappingIconWrapper)

export const mappingsContentTypes = [
    {
        id: 'mapping',
        renderButton: (context: IContentRenderContext<IData>) => {
            const { serverName, mappingId } = context.content.data!
            return (
                <ConnectedMappingButtonLabel
                    serverName={serverName}
                    mappingId={mappingId!}
                />
            )
        },
        renderIcon: (context: IContentRenderContext<IData>) => {
            const { serverName, mappingId } = context.content.data!
            return (
                <ConnectedMappingIcon
                    serverName={serverName}
                    mappingId={mappingId!}
                />
            )
        },
        renderPane: (context: IContentRenderContext<IData>) => (
            <MappingContainer
                key={context.content.id}
                serverName={context.content.data!.serverName}
                mappingId={context.content.data!.mappingId!}
            />
        ),
    },
    {
        id: 'mapping.create',
        renderButton: () => 'create mapping',
        renderIcon: () => <PlusCircle size={14}/>,
        renderPane: (context: IContentRenderContext<IData>) => (
            <CreateMappingContainer
                key={context.content.id}
                serverName={context.content.data!.serverName}
                creationId={context.content.data!.creationId!}
            />
        )
    }
]
