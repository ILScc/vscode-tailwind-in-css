import { parseCss } from './parseCss'

import type {} from 'vitest/globals'

test('basic', () => {
    const str = /* scss*/ `
.test {
    display: flex;
    |
}`
    const pos = str.indexOf('|')
    const strToParse = str.slice(0, pos) + str.slice(pos + 1)
    const { usedRules } = parseCss(strToParse, pos)
    expect(usedRules).toMatchInlineSnapshot(`
      Map {
        "display" => {
          "offset": 13,
          "value": "flex",
        },
      }
    `)
})
test('works with incorrect syntax', () => {
    const str = /* scss*/ `
.test {
    display: flex;
    flex|
}`
    const pos = str.indexOf('|')
    const strToParse = str.slice(0, pos) + str.slice(pos + 1)
    const { usedRules } = parseCss(strToParse, pos)
    expect(usedRules).toMatchInlineSnapshot(`
    Map {
        "display" => {
          "offset": 13,
          "value": "flex",
        },
      }
    `)
})
test("doesn't throw with incorrent syntax", () => {
    const str = /* scss*/ `
.test {
    display: flex;
    flex|
}`
    const pos = str.indexOf('|')
    const strToParse = str.slice(0, pos) + str.slice(pos + 1)
    expect(parseCss(strToParse, pos)).not.toThrowErrorMatchingInlineSnapshot(`"expected is not a function"`)
})
test('works with scss', () => {
    const str = /* scss*/ `
    @import 'something';
  .super-cool__class {
    $test-var: 1px;
    margin-right: $some-another-var + $test-var;
    display: flex;
    @include size(100%);
    @extend %conference-description-layout;
    |
    outline: 0;
    @include something-great {
      // margin-right: 10px;
      // margin-right: 10px;
      margin-right: 10px;
    }

  }`
    const pos = str.indexOf('|')
    const strToParse = str.slice(0, pos) + str.slice(pos + 1)
    expect(parseCss(strToParse, pos)).toMatchInlineSnapshot(`
      {
        "usedRules": Map {
          "$test-var" => {
            "offset": 53,
            "value": "1px",
          },
          "margin-right" => {
            "offset": 73,
            "value": "$some-another-var + $test-var",
          },
          "display" => {
            "offset": 122,
            "value": "flex",
          },
          "outline" => {
            "offset": 215,
            "value": "0",
          },
        },
      }
    `)
})

test('test', () => {
    const str = /* scss*/ `
.main-drawer-header__user {
    flex: 1 1 100%;
    // padding: 16px 24px;
    padding: 16px 16px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    |

    @include between-children {
      // margin-right: 8px;
      // margin-right: 12px;
      margin-right: 16px;
    }
  }`
    const pos = str.indexOf('|')
    const strToParse = str.slice(0, pos) + str.slice(pos + 1)
    const { usedRules } = parseCss(strToParse, pos)
    console.log(usedRules)
})
