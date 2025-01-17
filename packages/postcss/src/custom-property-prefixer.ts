import creator from 'postcss-custom-property-prefixer'
import type { VarPrefixerOptions } from '@icestack/types'

export function arrMatch(matchArr?: (string | RegExp)[], str?: string) {
  if (!Array.isArray(matchArr)) return
  if (typeof str !== 'string') return
  return matchArr.some((regex) => {
    if (typeof regex === 'string') {
      return str.includes(regex)
    }
    return str.match(regex)
  })
}

export function getPlugin(options: VarPrefixerOptions) {
  const { varPrefix, ignoreProp: ignorePropArr, ignoreValueCustomProperty: ignoreValueCustomPropertyArr } = options
  if (varPrefix) {
    return creator({
      prefix: typeof varPrefix === 'string' ? varPrefix.slice(2) : varPrefix,
      ignoreProp: (decl) => {
        if (arrMatch(ignorePropArr, decl.prop)) {
          return true
        }
        return decl.prop.startsWith('--tw-')
      },
      ignoreValueCustomProperty(customProperty) {
        if (arrMatch(ignoreValueCustomPropertyArr, customProperty)) {
          return true
        }
        return customProperty.startsWith('--tw-')
      }
    })
  }
}
