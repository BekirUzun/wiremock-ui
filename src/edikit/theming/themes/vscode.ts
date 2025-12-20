import 'brace'
import 'brace/theme/monokai'
import { css } from 'styled-components'
import { ITheme, IThemeColors, IThemeTypography } from '../types'

const typography: IThemeTypography = {
    fontSize: '14px',
    lineHeight: '1.6em',
    default: {
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
    },
    mono: {
        fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
    },
}

const colors: IThemeColors = {
    background: '#161616',
    text: '#d4d4d4',
    border: '#252526',
    accent: '#007acc',
    overAccent: '#cfeefe',
    muted: '#858585',
    success: '#57a64a',
    overSuccess: '#113214',
    warning: '#d7ba7d',
    overWarning: '#2b2114',
    danger: '#b40c0c',
    overDanger: '#d4d4d4',
}

const theme: ITheme = {
    typography,
    colors,
    tree: {
        container: {
            background: '#121212',
        },
        item: {
            color: colors.text,
            hover: {
                background: '#35383a',
                color: '#fff',
            },
            current: {
                background: '#262626',
                color: '#fff',
            },
        },
        contextMenu: {
            background: '#252526',
            border: '#3e3e42',
            item: {
                color: colors.text,
                background: 'transparent',
                hover: {
                    background: '#2a2d2e',
                },
            },
        },
    },
    builder: {
        spacing: '12px',
        background: '#1b1b1b',
        css: css`
            border-right: 1px solid ${colors.border};
        `,
        header: {
            background: '#007acc',
            title: {
                color: '#ffffff'
            },
            subtitle: {
                color: 'rgba(255,255,255,.85)'
            }
        },
        link: {
            color: colors.accent
        },
        label: {
            background: colors.accent,
            color: '#fff',
            css: css`
                box-shadow: 0 1px 0 rgba(0,0,0,.3);
            `,
        },
        block: {
            background: '#252526',
            css: css`
                box-shadow: 0 2px 4px rgba(0,0,0,.6);
                border: 1px solid ${colors.border};
            `,
            title: {
            }
        },
    },
    badge: {
        background: '#2d2d2d',
        color: '#fff',
    },
    header: {
        height: '44px',
        background: '#007acc',
        color: '#ffffff',
        iconColor: '#ffffff',
        brandColor: '#ffffff',
    },
    pane: {
        spacing: '12px',
        css: css`
            transition: box-shadow 300ms;
            box-shadow: 0 0 0 1px rgba(0,0,0,0), 0 0 0 1px rgba(0,0,0,.12);
        `,
        current: {
            css: css`
                box-shadow: 0 0 0 5px rgba(0,122,204,.08), 0 0 0 1px rgba(0,122,204,.18);
            `,
        },
        header: {
            height: '34px',
            background: '#2d2d2d',
            button: {
                background: '#2d2d2d',
                current: {
                    background: '#262626',
                },
            },
        },
        body: {
            background: '#252526'
        }
    },
    editor: {
        theme: 'monokai',
        css: `
            .ace_editor {
                background-color: #202020 !important;
            }

            .ace_active-line {
                background: #2d2f30 !important;
            }

            .ace_gutter {
                background: #181818 !important;
            }

            .ace_variable {
                color: #9cdcfe !important;
            }

            .ace_boolean {
                color: #4c89be !important;
            }

            .ace_numeric {
                color: #b5cea8 !important;
            }

            .ace_string {
                color: #ce9178 !important;
            }
        `,
    },
    form: {
        input: {
            background: '#35383a',
            border: `1px solid ${colors.border}`,
            color: colors.text,
            css: css`
                border-radius: 3px;
                transition: background .12s ease, box-shadow .12s ease;
            `,
            placeholder: {
                color: '#6a6a6a',
            },
            hover: {
                background: '#323333',
            },
            focus: {
                background: '#323333',
                css: css`
                    box-shadow: 0 0 0 3px rgba(0,122,204,.12);
                `,
            },
            disabled: {},
        },
        select: {
            background: '#35383a',
            color: '#e5e5e5',
            addonBackground: 'rgba(0,122,204,.12)',
            arrowsColor: '#9cdcfe',
            borderColor: '#262626',
            css: css`
                &:hover {
                    background: #323333;
                }
            `,
            focus: {
                css: css`
                    background: #161616;
                    box-shadow: 0 0 0 3px rgba(0,122,204,.12);
                `,
            },
        },
    },
    notifications: {
        item: {
            background: '#2d2d2d',
            color: '#fff',
        },
    },
}

export default theme
