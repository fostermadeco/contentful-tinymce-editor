import React, { useEffect, useRef, useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { FieldAppSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { Editor } from '@tinymce/tinymce-react';

// https://github.com/pauloamgomes/contentful-tinymce-editor/blob/master/src/components/Field.tsx
// https://www.tiny.cloud/docs/tinymce/latest/table/
const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const {tinyMceApiKey} = sdk.parameters.installation;
  let debounceInterval: any = false;
  const [init, setInit] = useState(null as any);
  const editorRef = useRef(null as any);
  const [value, setValue] = useState(sdk.field.getValue());

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  const onExternalChange = (externalValue: string) => {
    setValue(externalValue);
  };

  React.useEffect(() => {
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    return sdk.field.onValueChanged(onExternalChange);
  });

  const handleEditorChange = (newValue: string) => {
    if (debounceInterval) {
      clearInterval(debounceInterval);
    }

    debounceInterval = setTimeout(() => {
      sdk.field.setValue(newValue);
    }, 500);
  };

  return (
    <>
    <Editor
        apiKey={tinyMceApiKey}
        onInit={(_evt, editor) => {
          if (!editorRef?.current) return;
          editorRef.current = editor;
        }}
        initialValue={value}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 
            'table'
          ],
          toolbar: 'undo redo | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright | bullist numlist outdent indent | ' +
            'table tableprops | tabledelete | tablerowheader | tablecellprops tablemergecells tablesplitcells' + 
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={handleEditorChange}
      />
      </>
  )
};

export default Field;
