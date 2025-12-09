import * as React from 'react'
import styled from 'styled-components'
import { ITheme } from '../../theming'

const MenuContainer = styled.div`
    background: ${props => props.theme.tree.contextMenu.background};
    border: 1px solid ${props => props.theme.tree.contextMenu.border};
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: 120px;
    padding: 4px 0;
`

const MenuItem = styled.div<{ isDanger?: boolean }>`
    padding: 8px 16px;
    cursor: pointer;
    font-size: 13px;
    color: ${props => props.isDanger ? '#f93e3e' : props.theme.tree.contextMenu.item.color};
    background: ${props => props.theme.tree.contextMenu.item.background};
    transition: background 150ms;

    &:hover {
        background: ${props => props.theme.tree.contextMenu.item.hover.background};
    }
`

export interface IContextMenuProps {
    x: number
    y: number
    onClose: () => void
    items: Array<{
        label: string
        onClick: () => void
        isDanger?: boolean
    }>
}

export class ContextMenu extends React.Component<IContextMenuProps> {
    private menuRef: HTMLDivElement | null = null

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside)
    }

    handleClickOutside = (event: MouseEvent) => {
        if (this.menuRef && !this.menuRef.contains(event.target as Node)) {
            this.props.onClose()
        }
    }

    handleItemClick = (e: React.MouseEvent, onClick: () => void) => {
        e.stopPropagation()
        e.preventDefault()
        onClick()
        this.props.onClose()
    }

    setMenuRef = (ref: HTMLDivElement | null) => {
        this.menuRef = ref
    }

    render() {
        const { x, y, items } = this.props

        return (
            <div
                ref={this.setMenuRef}
                style={{
                    position: 'fixed',
                    top: `${y}px`,
                    left: `${x}px`,
                    zIndex: 1000,
                }}
            >
                <MenuContainer>
                    {items.map((item, index) => (
                        <MenuItem
                            key={index}
                            isDanger={item.isDanger}
                            onClick={(e) => this.handleItemClick(e, item.onClick)}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </MenuContainer>
            </div>
        )
    }
}

