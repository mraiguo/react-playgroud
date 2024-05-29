import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import { transform } from '@babel/standalone';
// import type { PluginObj } from '@babel/core';
import iframeRaw from './iframe.html?raw';

// const transformImportSourcePlugin: PluginObj = {
//   visitor: {
//     ImportDeclaration(path: string) {
//       path.node.source.value = url;
//     }
//   },
// }

const transformJsxCode = (code: string) => {
  const res = transform(code, { // TODO: @babel/standalone 会自动移除没有用到的 import，比如 ReactDOM
    presets: ['react', 'typescript'],
    filename: '0000.tsx',
  });
  return res.code as string
}

const Preview: React.FC = () => {
  const [iframeUrl, setIframeUrl] = useState(URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' })))
  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any,) {
    editorRef.current = editor;
    const value = editor.getValue();
    const transformedCode = transformJsxCode(value)
    const t = iframeRaw.replace('// ---ToBeReplace---', transformedCode)
    setIframeUrl(URL.createObjectURL(new Blob([t], { type: 'text/html' })))
  }

  function handleEditorChange(value: any) {
    const transformedCode = transformJsxCode(value)
    const t = iframeRaw.replace('// ---ToBeReplace---', transformedCode)
    setIframeUrl(URL.createObjectURL(new Blob([t], { type: 'text/html' })))
  }

  return (
    <>
      <div style={{ border: '1px solid red', height: '300px' }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          onChange={handleEditorChange}
          options={{
            paddingBottom: '50%'
          }}
          defaultValue={`
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
console.log('%c [ 0000 ReactDOM ]:', 'font-size:13px; background:pink;', ReactDOM)

const App = () => {
  return <span>app</span>
};

const root = document.getElementById('root')
ReactDOM.createRoot(root).render(React.createElement(App, null))
        `}
          onMount={handleEditorDidMount} />

      </div>

      <iframe
        src={iframeUrl}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          border: 'none'
        }}
      />
    </>
  )
}

export default Preview;