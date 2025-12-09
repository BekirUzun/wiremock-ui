import styled from 'styled-components'

export const ImagePreview = styled.div`
    grid-column-start: 1;
    grid-column-end: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
    padding: 12px;
    border: 1px solid ${props => props.theme.form.input.border || '#ccc'};
    border-radius: 3px;
    background: ${props => props.theme.form.input.background || '#fff'};
`

export const ImagePreviewImg = styled.img`
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
`

