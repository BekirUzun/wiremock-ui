import styled from 'styled-components'

interface IOverlayProps {
    isClosing: boolean
}

export const Overlay = styled.div<IOverlayProps>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${props => props.isClosing ? 'fadeOut 200ms ease-out' : 'fadeIn 200ms ease-out'};
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`

interface IModalContainerProps {
    isClosing: boolean
}

export const ModalContainer = styled.div<IModalContainerProps>`
    background: ${props => props.theme.builder.block.background};
    border-radius: 4px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    min-width: 400px;
    max-width: 500px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: ${props => props.isClosing ? 'slideDown 200ms ease-out' : 'slideUp 200ms ease-out'};
    
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(20px);
            opacity: 0;
        }
    }
`

export const ModalHeader = styled.div`
    padding: 20px 24px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.muted};
    transition: color 150ms;
    margin-left: 16px;
    
    &:hover {
        color: ${props => props.theme.colors.text};
    }
    
    &:focus {
        outline: 0;
    }
`

export const ModalTitle = styled.h2`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    line-height: 1.4;
`

export const ModalBody = styled.div`
    padding: 24px;
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    flex: 1;
    overflow-y: auto;
`

export const ModalFooter = styled.div`
    padding: 16px 24px;
    border-top: 1px solid ${props => props.theme.colors.border};
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`

