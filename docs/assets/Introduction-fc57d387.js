import{a as e,j as n,F as s}from"./jsx-runtime-1dbd1fde.js";import{M as a}from"./index-2c6a6ef6.js";import{u as r}from"./index-e744116c.js";import"./index-61bf1805.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-1fe3052a.js";import"../sb-preview/runtime.js";import"./index-d475d2ea.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./index-6a5bd4ef.js";import"./index-d37d4223.js";import"./index-356e4a49.js";const l=""+new URL("code-brackets-9ef6443e.svg",import.meta.url).href,c=""+new URL("colors-ac9401f3.svg",import.meta.url).href,p=""+new URL("comments-f15a6837.svg",import.meta.url).href,d=""+new URL("direction-94a9917f.svg",import.meta.url).href,m=""+new URL("flow-275142c6.svg",import.meta.url).href,h=""+new URL("plugin-57148314.svg",import.meta.url).href,g=""+new URL("repo-fb4ece47.svg",import.meta.url).href,u=""+new URL("stackalt-2ad81543.svg",import.meta.url).href;function o(i){const t=Object.assign({h1:"h1",p:"p",strong:"strong",code:"code"},r(),i.components);return n(s,{children:[e(a,{title:"General/Introduction"}),`
`,e("style",{children:`
    .subheading {
      --mediumdark: '#999999';
      font-weight: 700;
      font-size: 13px;
      color: #999;
      letter-spacing: 6px;
      line-height: 24px;
      text-transform: uppercase;
      margin-bottom: 12px;
      margin-top: 40px;
    }

    .link-list {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      row-gap: 10px;
    }

    @media (min-width: 620px) {
      .link-list {
        row-gap: 20px;
        column-gap: 20px;
        grid-template-columns: 1fr 1fr;
      }
    }

    @media all and (-ms-high-contrast:none) {
    .link-list {
        display: -ms-grid;
        -ms-grid-columns: 1fr 1fr;
        -ms-grid-rows: 1fr 1fr;
      }
    }

    .link-item {
      display: block;
      padding: 20px;
      border: 1px solid #00000010;
      border-radius: 5px;
      transition: background 150ms ease-out, border 150ms ease-out, transform 150ms ease-out;
      color: #333333;
      display: flex;
      align-items: flex-start;
    }

    .link-item:hover {
      border-color: #1EA7FD50;
      transform: translate3d(0, -3px, 0);
      box-shadow: rgba(0, 0, 0, 0.08) 0 3px 10px 0;
    }

    .link-item:active {
      border-color: #1EA7FD;
      transform: translate3d(0, 0, 0);
    }

    .link-item strong {
      font-weight: 700;
      display: block;
      margin-bottom: 2px;
    }

    .link-item img {
      height: 40px;
      width: 40px;
      margin-right: 15px;
      flex: none;
    }

    .link-item span,
    .link-item p {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
    }

    .tip {
      display: inline-block;
      border-radius: 1em;
      font-size: 11px;
      line-height: 12px;
      font-weight: 700;
      background: #E7FDD8;
      color: #66BF3C;
      padding: 4px 12px;
      margin-right: 10px;
      vertical-align: top;
    }

    .tip-wrapper {
      font-size: 13px;
      line-height: 20px;
      margin-top: 40px;
      margin-bottom: 40px;
    }

    .tip-wrapper code {
      font-size: 12px;
      display: inline-block;
    }
  `}),`
`,e(t.h1,{id:"welcome-to-constructorios-plp-ui",children:"Welcome to Constructor.io's PLP UI"}),`
`,n(t.p,{children:["Integration with Constructor's APIs has never been easier with ",e(t.strong,{children:"comprehensive components"}),` that take care of both the tracking and results retrieval,
allowing you to focus on developing your own unique site experience.`]}),`
`,n(t.p,{children:["For even more granular control, try out our extensive ",e(t.strong,{children:"hooks"}),` that abstract away state management and the underlying logic required to integrate Constructor.
Explore our `,e(t.code,{children:"hooks"})," sandbox to familiarize yourself with the limitless possibilities."]}),`
`,e("div",{className:"subheading",children:"Components"}),`
`,n("div",{className:"link-list",children:[n("a",{className:"link-item",href:"./?path=/docs/components-CioPlp--documentation",children:[e("img",{src:h,alt:"plugin"}),e("span",{children:n(t.p,{children:[e("strong",{children:"CioPlp"}),`
An all-in-one component for all your product listing pages`]})})]}),n("a",{className:"link-item",href:"./?path=/docs/components-productcard--documentation",children:[e("img",{src:u,alt:"Build"}),e("span",{children:n(t.p,{children:[e("strong",{children:"Product Card"}),`
Customize your product cards to enhance user experience`]})})]}),n("a",{className:"link-item",href:"./?path=/docs/components-productcard--documentation",children:[e("img",{src:c,alt:"colors"}),e("span",{children:n(t.p,{children:[e("strong",{children:"Filters"}),`
Personalize your filters`]})})]}),n("a",{className:"link-item",href:"./?path=/docs/components-productcard--documentation",children:[e("img",{src:m,alt:"flow"}),e("span",{children:n(t.p,{children:[e("strong",{children:"Pagination"}),`
Pages and what not`]})})]})]}),`
`,e("div",{className:"subheading",children:"Hooks"}),`
`,n("div",{className:"link-list",children:[n("a",{className:"link-item",href:"./?path=/docs/hooks-usecioclient--documentation",children:[e("img",{src:g,alt:"repo"}),e("span",{children:n(t.p,{children:[e("strong",{children:"usePlpState"}),`
Hook into everything`]})})]}),n("a",{className:"link-item",href:"./?path=/docs/hooks-usecioclient--documentation",children:[e("img",{src:d,alt:"direction"}),e("span",{children:n(t.p,{children:[e("strong",{children:"useCioClient"}),`
Get a Constructor.io Client to use to make Search, Browse and Tracking Requests`]})})]}),n("a",{className:"link-item",href:"./?path=/docs/hooks-usecioclient--documentation",children:[e("img",{src:l,alt:"code"}),e("span",{children:n(t.p,{children:[e("strong",{children:"useCioFilters"}),`
Filter Things`]})})]}),n("a",{className:"link-item",href:"./?path=/docs/hooks-usecioclient--documentation",children:[e("img",{src:p,alt:"comments"}),e("span",{children:n(t.p,{children:[e("strong",{children:"useCioPagination"}),`
Pagination Things`]})})]})]}),`
`,e("div",{className:"tip-wrapper",children:n(t.p,{children:[e("span",{className:"tip",children:"Tip"}),"Having trouble with a unique use case? Contact your friendly Integration Engineers for support!"]})})]})}function R(i={}){const{wrapper:t}=Object.assign({},r(),i.components);return t?e(t,Object.assign({},i,{children:e(o,i)})):o(i)}export{R as default};
//# sourceMappingURL=Introduction-fc57d387.js.map
