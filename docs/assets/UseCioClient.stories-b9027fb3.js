import{u as S,D as l}from"./useCioClient-c50e5a51.js";import{j as g,F as x,a as e}from"./jsx-runtime-1dbd1fde.js";import{r as n}from"./index-61bf1805.js";import"./_commonjsHelpers-de833af9.js";import"./_commonjs-dynamic-modules-302442b1.js";function s({apiKey:a}){const p=S(a||l),[d,h]=n.useState({}),[o,m]=n.useState(""),y=r=>{m(r.target.value)},C=async()=>{const r=await p.search.getSearchResults(o||"");h(r.response.results)};return g(x,{children:[e("h1",{children:"Search Results as JSON"}),e("input",{type:"text",name:"searchBox",id:"searchBox",placeholder:"Search query",value:o,onChange:y}),e("div",{children:JSON.stringify(d)}),e("div",{children:e("button",{type:"button",onClick:C,children:"Search"})})]})}const f=`
import React, { useState } from 'react';
import useCioClient from '../../hooks/useCioClient';

const apiKey = 'MY_API_KEY'

function UseCioClientExample() {
  const cioClient = useCioClient(apiKey);
  const [results, setResults] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const runSearch = async () => {
    const res = await cioClient.search.getSearchResults(searchQuery || '');
    setResults(res.response.results);
  };

  return (
    <>
      <h1>Search Results as JSON</h1>
      <input
        type='text'
        name='searchBox'
        id='searchBox'
        placeholder='Search query'
        value={searchQuery}
        onChange={onInputHandler}
      />
      <div>{JSON.stringify(results)}</div>
      <div>
        <button type='button' onClick={runSearch}>
          Search
        </button>
      </div>
    </>
  );
}`;try{s.displayName="UseCioClientExample",s.__docgenInfo={description:`A React Hook to obtain a Constructor.io Client from our
 JavaScript SDK, allowing you to make Search, Browse & Tracking requests`,displayName:"UseCioClientExample",props:{apiKey:{defaultValue:null,description:"API Key used to requests results from",name:"apiKey",required:!1,type:{name:"string"}}}}}catch{}const I={title:"Hooks/UseCioClient",component:s,parameters:{layout:"centered",docs:{source:{code:f,language:"jsx",format:!0,type:"code"}}},tags:["autodocs"]},t={args:{apiKey:l}};var c,i,u;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    apiKey: DEMO_API_KEY
  }
}`,...(u=(i=t.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};const k=["Primary"];export{t as Primary,k as __namedExportsOrder,I as default};
//# sourceMappingURL=UseCioClient.stories-b9027fb3.js.map
