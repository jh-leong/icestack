import path from 'node:path'
import sassTrue from 'sass-true'
import * as sass from 'sass'
import { transformJsToSass } from '@/sass/utils'
// https://sass-lang.com/documentation/at-rules/mixin/#content-blocks

// const cc = "dsadsa($a,$b)"

// function [cc](){

// }

describe('sass', () => {
  it('scss', () => {
    const sassFile = path.join(__dirname, 'sass.test.scss')
    sassTrue.runSass({ describe, it }, sassFile, {
      functions: {
        'injectFn($a0)': (args0: sass.Value[]) => {
          return new sass.SassFunction('fn($a1,$a2:null)', (args1: sass.Value[]) => {
            if (args1[1] === sass.sassNull) {
              expect(args1[0].assertNumber().value).toBe(0)
            } else {
              expect(args1[0].assertNumber().value).toBe(1)
              expect(args1[1].assertNumber().value).toBe(2)
            }

            return new sass.SassString('111')
          })
        }
      }
    })
  })

  describe('transformJsToSass', () => {
    describe('Primitives', () => {
      it('string', () => {
        const v = transformJsToSass('1111')
        expect(v instanceof sass.SassString).toBe(true)
        expect(v?.assertString().hasQuotes).toBe(false)
      })

      it('number', () => {
        const v = transformJsToSass(11.23)
        expect(v instanceof sass.SassNumber).toBe(true)
      })

      it('boolean', () => {
        let v = transformJsToSass(true)
        expect(v === sass.sassTrue).toBe(true)
        v = transformJsToSass(false)
        expect(v === sass.sassFalse).toBe(true)
      })

      it('null and undefined', () => {
        let v = transformJsToSass(undefined)
        expect(v === sass.sassNull).toBe(true)
        v = transformJsToSass(null)
        expect(v === sass.sassNull).toBe(true)
      })

      // symbol is not allow
      // https://github.com/airbnb/javascript#types
      it('bigint', () => {
        const v = transformJsToSass(BigInt(1_112_345_678_654_323))
        expect(v instanceof sass.SassString).toBe(true)
      })
    })

    describe('Complex', () => {
      it('object case 0', () => {
        const v = transformJsToSass({})
        expect(v instanceof sass.SassMap).toBe(true)
      })

      it('array case 0', () => {
        const v = transformJsToSass([])
        expect(v instanceof sass.SassList).toBe(true)
      })

      it('function case 0', () => {
        // only function with signature will be transformed
        function xxx(args1: sass.Value[]): sass.Value {
          return new sass.SassString('111')
        }

        xxx.signature = 'fn($a1,$a2:null)'
        const v = transformJsToSass(xxx)
        expect(v instanceof sass.SassFunction).toBe(true)
      })

      it('function case 1', () => {
        // only function with signature will be transformed
        function xxx(args1: sass.Value[]): sass.Value {
          return new sass.SassString('111')
        }

        const v = transformJsToSass(xxx)
        expect(v instanceof sass.SassFunction).toBe(false)
      })
    })
  })
})
