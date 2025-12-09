import * as React from 'react'
import { action } from 'typesafe-actions'
import { ServersActionTypes } from './types'
import { IServer } from '../types'

export interface IInitServersAction {
    type: ServersActionTypes.INIT_SERVERS
    payload: {
        servers: IServer[]
    }
}

export const initServers = (servers: IServer[]) =>
    action(ServersActionTypes.INIT_SERVERS, { servers })

export interface ICreateServerAction {
    type: ServersActionTypes.CREATE_SERVER
    payload: {
        server: IServer
    }
}

export const createServer = (server: Pick<IServer, 'name' | 'url' | 'port'>) => {
    // Save to localStorage
    const existingServers = localStorage.getItem('servers')
    const servers = existingServers ? JSON.parse(existingServers) : []
    const newServer = {
        ...server,
        mappingsHaveBeenLoaded: false,
        isLoadingMappings: false,
        mappings: []
    }
    servers.push(newServer)
    localStorage.setItem('servers', JSON.stringify(servers))

    return action(
        ServersActionTypes.CREATE_SERVER,
        { server: newServer },
        {
            notification: {
                type: 'success',
                content: (
                    <div>
                        server <strong>{server.name}</strong> successfully created
                    </div>
                ),
                ttl: 3000,
            },
        }
    )
}

export interface ISelectServerAction {
    type: ServersActionTypes.SELECT_SERVER
    payload: {
        serverId: string
    }
}

export const selectServer = (serverId: string) =>
    action(ServersActionTypes.SELECT_SERVER, { serverId })

export interface IUpdateServerAction {
    type: ServersActionTypes.UPDATE_SERVER
    payload: {
        server: IServer
    }
}

export const updateServer = (server: IServer) => {
    // Update in localStorage
    const existingServers = localStorage.getItem('servers')
    if (existingServers) {
        const servers = JSON.parse(existingServers)
        const updatedServers = servers.map((s: IServer) => 
            s.name === server.name ? server : s
        )
        localStorage.setItem('servers', JSON.stringify(updatedServers))
    }

    return action(ServersActionTypes.UPDATE_SERVER, { server })
}

export interface IRemoveServerAction {
    type: ServersActionTypes.REMOVE_SERVER
    payload: {
        serverId: string
    }
}

export const removeServer = (serverId: string) => {
    // Remove from localStorage
    const existingServers = localStorage.getItem('servers')
    if (existingServers) {
        const servers = JSON.parse(existingServers)
        const filteredServers = servers.filter((server: IServer) => server.name !== serverId)
        localStorage.setItem('servers', JSON.stringify(filteredServers))
    }

    return action(ServersActionTypes.REMOVE_SERVER, { serverId })
}

export type ServersAction =
    | IInitServersAction
    | ICreateServerAction
    | ISelectServerAction
    | IUpdateServerAction
    | IRemoveServerAction
