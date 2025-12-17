import { Epic, combineEpics } from 'redux-observable'
import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { initSettings } from '../../settings'
import { initServers, IServer } from '../../servers'
import { IAction } from '../../../store'
import { loadState, loadStateFinished } from './actions'
import { CoreActionTypes } from './types'

const parseServerUrl = (urlString: string): { url: string; port?: number } => {
    try {
        const url = new URL(urlString)
        const port = url.port ? parseInt(url.port, 10) : undefined
        return {
            url: `${url.protocol}//${url.hostname}`,
            port
        }
    } catch (e) {
        return { url: urlString }
    }
}

export const loadStateEpic: Epic<IAction, any> = action$ =>
    action$.ofType(CoreActionTypes.LOAD_STATE)
        .pipe(
            mergeMap((action: typeof loadState) => {
                const theme = localStorage.getItem('theme') || 'solarized dark'
                const actions: IAction[] = [initSettings({
                    theme
                })]

                let servers: any = localStorage.getItem('servers')
                if (servers) {
                    servers = JSON.parse(servers)
                    actions.push(initServers(servers))
                } 
                else {
                    const defaultServer = process.env.REACT_APP_DEFAULT_SERVER
                    const defaultServerName = process.env.REACT_APP_DEFAULT_SERVER_NAME
                    
                    if (defaultServer && defaultServerName) {
                        const { url, port } = parseServerUrl(defaultServer)
                        const defaultServerObj: IServer = {
                            name: defaultServerName,
                            url,
                            port,
                            mappingsHaveBeenLoaded: false,
                            isLoadingMappings: false,
                            mappings: []
                        }
                        localStorage.setItem('servers', JSON.stringify([defaultServerObj]))
                        actions.push(initServers([defaultServerObj]))
                    }
                }

                return from([
                    ...actions,
                    loadStateFinished()
                ])
            })
        )

export const coreEpic = combineEpics(
    loadStateEpic
)
