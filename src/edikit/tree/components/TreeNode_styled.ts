import styled from 'styled-components'

const iconSize = 12
const iconSpacing = 9
const iconsOffset = iconSize + iconSpacing

interface IconsProps {
    iconCount: number
}

export const Icons = styled.div<IconsProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: ${props => props.iconCount * iconSize + (props.iconCount - 1) * iconSpacing}px;
    margin-right: ${iconSpacing}px;
    flex-shrink: 0;
`

export interface ItemProps {
    isDir: boolean
    depth: number
    isCurrent?: boolean
}

export const Item = styled.div<ItemProps>`
    display: flex;
    align-items: center;
    padding: 3px 12px 3px 7px;
    font-size: 13px;
    font-weight: 600;
    transition: background 300ms;
    padding-left: ${props => {
        if (props.isDir) {
            return props.depth * iconsOffset + 7
        }

        return props.depth * iconsOffset + 7
    }}px;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    color: ${props =>
        props.isCurrent
            ? props.theme.tree.item.current.color
            : props.theme.tree.item.color};
    background: ${props =>
        props.isCurrent ? props.theme.tree.item.current.background : 'transparent'};

    &:hover {
        background: ${props => props.theme.tree.item.hover.background};
        color: ${props => props.theme.tree.item.hover.color};
        ${props => props.theme.tree.item.hover.extend};
    }
`

export const CurrentIndicator = styled.span`
    width: 6px;
    height: 6px;
    border-radius: 3px;
    margin-left: ${iconSpacing}px;
    background: ${props => props.theme.colors.accent};
`

export const ActionsButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 4px;
    margin-left: ${iconSpacing}px;
    margin-right: 4px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: ${props => props.theme.colors.muted};
    transition: color 150ms;
    flex-shrink: 0;

    &:hover {
        color: ${props => props.theme.colors.text};
    }

    &:focus {
        outline: none;
    }
`