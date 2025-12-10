import * as React from 'react'
import styled from 'styled-components'
import { MappingRequestMethod } from '../types'

interface IMappingIconProps {
    method?: string
}

const getMethodColor = (method: string | undefined, theme: any): string => {
    if (!method) {
        return theme.colors.accent
    }

    switch (method.toUpperCase()) {
        case 'GET':
            return '#61affe' // blue
        case 'POST':
            return '#49cc90' // green
        case 'PUT':
            return '#fca130' // orange
        case 'DELETE':
            return '#f93e3e' // red
        case 'PATCH':
            return '#50e3c2' // teal
        case 'HEAD':
            return '#cc49bb' // pink
        case 'OPTIONS':
            return '#0d5aa7' // dark blue
        case 'TRACE':
            return '#ebebeb' // light gray
        case 'ANY':
            return '#9012fe' // purple
        default:
            return theme.colors.accent
    }
}

const Icon = styled.div<{ method?: string }>`
    color: ${props => getMethodColor(props.method, props.theme)};
    font-weight: 900;
    font-size: 11px;
`

export default class MappingIcon extends React.Component<IMappingIconProps> {
    render() {
        const { method } = this.props
        const text = method ? method.toUpperCase() : 'M'
        return <Icon method={method}>{text}</Icon>
    }
}
