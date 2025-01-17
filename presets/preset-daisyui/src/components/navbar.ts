import { transformCss2Js } from './shared'
import type { GetCssSchemaMethod } from './shared'

const schema: GetCssSchemaMethod = (opts) => {
  const { selector } = opts
  return {
    selector,
    defaults: {
      base: transformCss2Js(`
      ${selector} {
        @apply flex items-center;
      }
      :where(${selector} > *) {
        @apply inline-flex items-center;
      }
      ${selector}-start {
        width: 50%;
        justify-content: flex-start;
      }
      ${selector}-center {
        @apply shrink-0;
      }
      ${selector}-end {
        width: 50%;
        justify-content: flex-end;
      }
      
      `),
      styled: transformCss2Js(`
      ${selector} {
        padding: var(--navbar-padding, 0.5rem);
        min-height: 4rem;
        @apply w-full;
      }
      
      `),
      utils: transformCss2Js(``)
    }
  }
}

export default {
  schema
}
