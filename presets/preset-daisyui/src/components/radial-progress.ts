import { transformCss2Js } from './shared'
import type { GetCssSchemaMethod } from './shared'

const schema: GetCssSchemaMethod = (opts) => {
  const { selector } = opts
  return {
    selector,
    defaults: {
      base: transformCss2Js(`${selector} {
        --value: 0;
        --size: 5rem;
        --thickness: calc(var(--size) / 10);
      }
      ${selector}:after {
        @apply bg-current;
      }

      ${selector} {
        @apply relative inline-grid h-[var(--size)] w-[var(--size)] place-content-center rounded-full bg-transparent;
        vertical-align: middle;
        box-sizing: content-box;
      }
      ${selector}::-moz-progress-bar {
        @apply appearance-none bg-transparent;
      }
      ${selector}::-webkit-progress-value {
        @apply appearance-none bg-transparent;
      }
      ${selector}::-webkit-progress-bar {
        @apply appearance-none bg-transparent;
      }
      ${selector}:before,
      ${selector}:after {
        @apply absolute rounded-full;
        content: "";
      }
      ${selector}:before {
        @apply inset-0;
        background:
          radial-gradient(farthest-side, currentColor 98%, #0000) top/var(--thickness) var(--thickness)
            no-repeat,
          conic-gradient(currentColor calc(var(--value) * 1%), #0000 0);
        -webkit-mask: radial-gradient(
          farthest-side,
          #0000 calc(99% - var(--thickness)),
          #000 calc(100% - var(--thickness))
        );
        mask: radial-gradient(
          farthest-side,
          #0000 calc(99% - var(--thickness)),
          #000 calc(100% - var(--thickness))
        );
      }
      ${selector}:after {
        inset: calc(50% - var(--thickness) / 2);
        transform: rotate(calc(var(--value) * 3.6deg - 90deg)) translate(calc(var(--size) / 2 - 50%));
      }
      
      `),
      styled: transformCss2Js(``),
      utils: transformCss2Js(``)
    }
  }
}

export default {
  schema
}
