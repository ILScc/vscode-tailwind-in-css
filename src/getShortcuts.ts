import * as vscode from 'vscode'
import { getExtensionSetting } from 'vscode-framework'
import { compact } from '@zardoy/utils'
import { parseCss } from './parseCss'
import { SimpleVirtualDocument } from './shared'
import ourRules from './static/ourRules'

export default ({ fullText, lineText, offset, startLine }: SimpleVirtualDocument) => {
    const usedShortcutConfig = {
        enable: getExtensionSetting('usedShortcuts.enable'),
        mode: getExtensionSetting('usedShortcuts.mode'),
    }

    // TODO measure parsing time on big stylesheets
    const { usedRules } = parseCss(fullText, offset)
    if (!/^\s*(\w|-)*\s*$/.test(lineText)) return
    return compact(
        ourRules
            .filter(rule => typeof rule[0] === 'string' && typeof rule[1] === 'object')
            .map(([shortcut, rule]): vscode.CompletionItem | undefined => {
                const cssDeclarations = (Array.isArray(rule) ? rule : Object.entries(rule)).filter(([prop, value], i, rulesArr) => {
                    if (getExtensionSetting('skipVendorPrefix') === 'none') return true
                    const hasUnvendoredRule = (current: string, matchUnvendored: (vendorLength: number, unvendored: string) => boolean) => {
                        const match = /^-\w+-/.exec(current)
                        if (!match) return false
                        return matchUnvendored(match[0]!.length, current.slice(match[0]!.length))
                    }

                    return !(
                        hasUnvendoredRule(prop, (vendorLength, unvendored) => rulesArr.some(([rule]) => unvendored === rule.slice(vendorLength)))
                        // hasUnvendored(value as string, match => rulesArr.some(([, value]) => (value as string).slice(match[0]!.length)))
                    )
                })

                const cssRules = cssDeclarations.map(([prop, value]) => {
                    if (typeof value === 'number') value = `${value.toString()}px`
                    return `${prop}: ${value!};`
                })

                const label = shortcut as string
                const shortcutIsUsed = cssDeclarations.every(
                    ([prop, value]) =>
                        usedShortcutConfig.enable !== 'disable' &&
                        (usedShortcutConfig.mode === 'only-rule' ? usedRules.get(prop) : usedRules.get(prop)?.value === value),
                )

                if (shortcutIsUsed && usedShortcutConfig.enable === 'remove') return undefined
                const cssRulesString = cssRules.join('\n')
                return {
                    label,
                    insertText: cssRulesString,
                    tags: shortcutIsUsed ? [vscode.CompletionItemTag.Deprecated] : [],
                    // TODO button using markdown syntax (replace n rules) and shortcut for replacing these used rules
                    documentation: new vscode.MarkdownString().appendCodeblock(
                        `.${label} {\n${cssDeclarations
                            .map(([prop, value]) => {
                                const rule = `${prop}: ${value!};`
                                if (usedShortcutConfig.enable === 'disable' || usedShortcutConfig.enable === 'remove') return `${' '.repeat(2)}${rule}`

                                const currentShortcutOffset = usedRules.get(prop)?.offset

                                return `${' '.repeat(2)}${rule} ${
                                    (usedShortcutConfig.mode === 'only-rule' ? usedRules.get(prop) : usedRules.get(prop)?.value === value)
                                        ? `//L${getLineByOffset(fullText, currentShortcutOffset!)!}`
                                        : ''
                                }`
                            })
                            .join('\n')}\n}`,
                        'css',
                    ),
                    kind: vscode.CompletionItemKind.Event,
                }
            }),
    )
}

const getLineByOffset = (text: string, offset: number) => {
    let sum = 0
    for (const [i, line] of text.split('\n').entries()) {
        sum += line.length
        if (offset < sum) return i + 1
    }

    return undefined
}
