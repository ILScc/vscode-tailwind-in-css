/* eslint-disable curly */
import { parse as postcssParse } from 'postcss-scss'
import { Declaration, Node, Rule } from 'postcss'

const findUsedRules = (stylesContent: string, offset: number) => {
    const usedRules = new Map<string, { value: string; offset: number }>()

    const parsed = postcssParse(stylesContent)
    const findPositionContainingNode = (position: number, nodes: Node[]) => {
        let currentNode: Node | undefined
        const find = (nodes: Node[]) => {
            for (const node of nodes)
                if (position >= node.source!.start!.offset && position <= node.source!.end!.offset) {
                    if ('nodes' in node) {
                        currentNode = node
                        find((node as any).nodes)
                    }

                    break
                }
        }

        find(nodes)
        return currentNode
    }

    const foundNode = findPositionContainingNode(offset, parsed.nodes)

    if (foundNode instanceof Rule) {
        for (const node of foundNode.nodes)
            if (node instanceof Declaration) {
                usedRules.set(node.prop, { value: node.value, offset: node.source!.start!.offset })
            }
    }

    return usedRules
}

export const parseCss = (stylesContent: string, offset: number) => {
    let usedRules = new Map<string, { value: string; offset: number }>()
    try {
        usedRules = findUsedRules(stylesContent, offset)
    } catch (error) {
        if (error.reason === 'Unknown word') {
            const stylesWithoutErrorString = stylesContent
                .split(/\n\r?/)
                .filter((str, i) => i !== error.input.line - 1)
                .join('\n')
            try {
                usedRules = findUsedRules(stylesWithoutErrorString, offset - error.input.endColumn)
            } catch (error_) {
                console.log(2, error_)
            }
        } else {
            console.log(error)
        }
    }

    return {
        usedRules,
    }
}
