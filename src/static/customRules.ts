import { Rule } from '@unocss/core'

export default [
    ['pointer', 'cursor: pointer'],
    ['absolute', 'position: absolute'],
    ['fixed', 'position: fixed'],
].map(([prop, value]) => [prop, [value!.split(': ')]]) as Rule[]
