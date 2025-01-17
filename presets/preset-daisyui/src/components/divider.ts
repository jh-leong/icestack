import { transformCss2Js } from './shared'
import type { GetCssSchemaMethod } from './shared'

const schema: GetCssSchemaMethod = (opts) => {
  const { selector, types } = opts
  return {
    selector,
    defaults: {
      base: transformCss2Js(`
      ${selector} {
        @apply flex flex-row items-center self-stretch;
        &:before,
        &:after {
          @apply h-0.5 w-full flex-grow content-[''];
        }
        &-start:before {
          @apply hidden;
        }
        &-end:after {
          @apply hidden;
        }
      }
      
      `),
      styled: transformCss2Js(`
      ${selector} {
        @apply my-4 h-4 whitespace-nowrap;
        &:before,
        &:after {
          @apply bg-base-content/10;
        }
        &:not(:empty) {
          @apply gap-4;
        }
        ${types
          .map((type) => {
            return `&-${type}:before,&-${type}:after{
            @apply bg-${type};
          }`
          })
          .join('\n')}
      }
      
      `),
      utils: transformCss2Js(`
      ${selector}-horizontal {
        @apply flex-col;
        &:before {
          @apply h-full w-0.5;
        }
        &:after {
          @apply h-full w-0.5;
        }
      }
      ${selector}-vertical {
        @apply flex-row;
        &:before {
          @apply h-0.5 w-full;
        }
        &:after {
          @apply h-0.5 w-full;
        }
      }
      
      ${selector}-horizontal {
        @apply mx-4 my-0 h-auto w-4;
      }
      ${selector}-vertical {
        @apply mx-0 my-4 h-4 w-auto;
      }
      
      `)
    }
  }
}

export default {
  schema
}
