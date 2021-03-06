export type Configuration = {
    /**
     * @default true
     */
    enableAbbreviation: boolean
    /**
     * @default true
     */
    enableStaticShortcuts: boolean
    /**
     * @default props
     */
    skipVendorPrefix: 'none' | 'props'
    /**
     * We can detect already used shortcuts. Example: `flex` if `display: flex` is already used in current scope
     * Use `remove` to omit them in suggestions
     * @default strikethrough
     */
    usedShortcuts: 'disable' | 'remove' | 'strikethrough'
    /**
     * `only-rule`: don't display other display-based shortcuts such as `inline`, `block` if `display: flex` is defined
     */
    'usedShortcuts.mode': 'rule-and-value' | 'only-rule'
}
