import styled from 'styled-components'

export const ImagePreviewContainer = styled.div`
    grid-column-start: 1;
    grid-column-end: 9;
    display: flex;
    gap: 12px;
    align-items: flex-start;
`

export const ImagePreview = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    border: 1px solid ${props => props.theme.form.input.border || '#ccc'};
    border-radius: 3px;
    background: ${props => props.theme.form.input.background || '#fff'};
    min-height: 120px;
`

export const ImagePreviewImg = styled.img`
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
`

