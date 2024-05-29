import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import { transform } from '@babel/standalone';
// import type { PluginObj } from '@babel/core';

import iframeRaw from './iframe.html?raw';
console.log('%c [ iframeRaw ]-7', 'font-size:13px; background:pink; color:#bf2c9f;', iframeRaw)


const Preview: React.FC = () => {
  const [iframeUrl, setIframeUrl] = useState(URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' })))
  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any,) {
    editorRef.current = editor;
  }

  // const transformImportSourcePlugin: PluginObj = {
  //   visitor: {
  //     ImportDeclaration(path: string) {
  //       path.node.source.value = url;
  //     }
  //   },
  // }

  function handleEditorChange(value: any) {
    const res = transform(value, {
      presets: ['react', 'typescript'],
      filename: '0000.tsx',
      // plugins: [transformImportSourcePlugin]
    });

    const t = iframeRaw.replace('<ToBeReplace />', res.code as string)
    setIframeUrl(URL.createObjectURL(new Blob([t], { type: 'text/html' })))
  }

  return (
    <>
      <Editor
        height="30vh"
        defaultLanguage="javascript"
        onChange={handleEditorChange}
        defaultValue={`
        <div> App </div>
        `}
        onMount={handleEditorDidMount} />
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