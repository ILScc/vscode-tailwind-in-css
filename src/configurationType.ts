export type Configuration = {
    /**
     * @default true
     */
    enableNumberAbbreviation: boolean
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
    'usedShortcuts.enable': 'disable' | 'remove' | 'strikethrough'
    /**
     * `only-rule`: don't display other display-based shortcuts such as `inline`, `block` if `display: flex` is defined
     * @default rule-and-value
     */
    'usedShortcuts.mode': 'rule-and-value' | 'only-rule'
}
