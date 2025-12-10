import styled from 'styled-components'

export const FileInputWrapper = styled.div`
    grid-column-start: 1;
    grid-column-end: 9;
    margin-bottom: 12px;
`

export const FileInput = styled.input`
    width: 100%;
    padding: 6px;
    font-size: 13px;
    border: 1px solid ${props => props.theme.form.input.border || '#ccc'};
    border-radius: 3px;
    background: ${props => props.theme.form.input.background || '#fff'};
    color: ${props => props.theme.form.input.color || '#000'};
    cursor: pointer;
    
    &:hover {
        background: ${props => (props.theme.form.input.hover && props.theme.form.input.hover.background) || props.theme.form.input.background || '#fff'};
    }
    
    &:focus {
        outline: transparent;
        background: ${props => (props.theme.form.input.focus && props.theme.form.input.focus.background) || props.theme.form.input.background || '#fff'};
    }
`

