import * as React from 'react'
import { ITheme } from 'edikit'

interface IThemeStyleInjectorProps {
    theme: ITheme
}

export default class ThemeStyleInjector extends React.Component<IThemeStyleInjectorProps> {

    componentDidMount() {
        this.injectStyles()
    }

    componentDidUpdate(prevProps: IThemeStyleInjectorProps) {
        this.removeStyles()
        this.injectStyles()
    }

    componentWillUnmount() {
        this.removeStyles()
    }

    private injectStyles() { 
        this.injectStyle("editor-css", this.props.theme.editor.css)
    }

    private removeStyles() {
        this.removeStyle("editor-css", this.props.theme.editor.css)
    }

    private injectStyle(id: string, content: string | undefined ) {
        if (!content) {
            return
        }
        const styleElement = document.createElement('style')
        styleElement.id = id
        styleElement.textContent = content
        document.head.appendChild(styleElement)
    }



    private removeStyle(id: string, content: string | undefined ) {
        const existingStyle = document.getElementById(id)
        if (existingStyle) {
            existingStyle.remove()
        }
    }

    render() {
        return null
    }
}

