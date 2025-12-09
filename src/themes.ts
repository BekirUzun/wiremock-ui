import {
    ITheme,
    blackTheme,
    vscodeTheme,
    solarizedDarkTheme,
    whiteTheme,
} from 'edikit'

const themes: { [name: string]: ITheme } = {
    black: blackTheme,
    vscode: vscodeTheme,
    'solarized dark': solarizedDarkTheme,
    white: whiteTheme,
}

export default themes
