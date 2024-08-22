import React, { useEffect, useRef, useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { FieldAppSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { Editor } from '@tinymce/tinymce-react';
import { AppInstallationParameters, defaultParameters } from './ConfigDefaults';

interface ImageProps {
  id: string;
  url: string;
  width: string;
  height: string;
  title?: string;
}

interface LinkProps {
  id: string;
  url: string;
  title: string;
}

// https://github.com/pauloamgomes/contentful-tinymce-editor/blob/master/src/components/Field.tsx
// https://www.tiny.cloud/docs/tinymce/latest/table/
const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const { tinyMceApiKey } = sdk.parameters.installation;
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

  React.useEffect(() => {
    const {
      formatgroup,
      insertgroup,
      assetgroup,
      extragroup,
      plugins,
      menubar,
      toolbar,
      quickbarsSelectionToolbar,
      resizing,
      customContentStyle,
    } = defaultParameters as AppInstallationParameters;

    const renderImage = ({ id, url, width, height, title = "" }: ImageProps) =>
      `<img
        src="${url}?${resizing}"
        width="${width}"
        height="${height}"
        alt="${title}"
        data-contentful-id="${id}"
        data-original-width="${width}"
        data-original-height="${height}"
      />`;

    const renderLink = ({ id, url, title }: LinkProps) =>
      `<a href="${url}" data-contentful-id="${id}">${title}</a>`;

    const renderContent = (data: any) => {
      const { assetType, id, title, url, width, height } = data;

      return assetType === "image"
        ? renderImage({ id, url, width, height, title })
        : renderLink({ id, url, title });
    };

    const setupEditor = (editor: any) => {
      editor.ui.registry.addButton("existingasset", {
        text: "Link existing",
        icon: "edit-image",
        tooltip: "Insert existing Contentful Media Asset",
        onAction: async () => {
          await handleSelectAsset().then((data) => {
            if (data) {
              editor.insertContent(renderContent(data));
            }
          });
        },
      });

      editor.ui.registry.addButton("newasset", {
        text: "Add new and link",
        icon: "image",
        tooltip: "Create and Insert Contentful Media Asset",
        onAction: async () => {
          await handleCreateAsset().then((data) => {
            if (data) {
              editor.insertContent(renderContent(data));
            }
          });
        },
      });

      editor.ui.registry.addButton("editasset", {
        text: "Edit media asset",
        icon: "image",
        tooltip: "Edit Contentful Media Asset",
        onAction: async () => {
          const node = editor.selection.getNode();
          const parts = node
            .getAttribute("src")
            .replace(/(http:|https:)?\/\/.*\.ctfassets\.net\//, "")
            .replace(`${sdk.ids.space}/`, "")
            .split("/");

          await handleEditAsset(parts[0]).then((data) => {
            if (data) {
              editor.insertContent(renderContent(data));
            }
          });
        },
      });

      editor.ui.registry.addContextToolbar("editasset", {
        predicate: (node: any) => {
          return (
            node.nodeName.toLowerCase() === "img" &&
            node.getAttribute("src").includes(`ctfassets.net/${sdk.ids.space}/`)
          );
        },
        items: "editasset",
        position: "node",
        scope: "node",
      });
    };

    const getAssetData = (asset: any | null) => {
      if (asset?.fields?.file && asset?.fields?.file[sdk.field.locale]) {
        const assetType = /^image\/(.*)$/.test(
          asset.fields.file[sdk.field.locale].contentType
        )
          ? "image"
          : "file";

        const data: any = {
          assetType,
          id: asset.sys.id,
          url: asset.fields.file[sdk.field.locale].url,
          title: asset.fields.title[sdk.field.locale],
        };

        if (assetType === "image") {
          data.width = asset.fields.file[sdk.field.locale].details.image.width;
          data.height =
            asset.fields.file[sdk.field.locale].details.image.height;
        }

        return data;
      }
    };

    const handleSelectAsset = async () =>
      sdk.dialogs.selectSingleAsset().then((asset: any) => getAssetData(asset));

    const handleCreateAsset = async () =>
      sdk.navigator
        .openNewAsset({ slideIn: { waitForClose: true } })
        .then(({ entity }: any) => getAssetData(entity));

    const handleEditAsset = async (id: string) =>
      await sdk.navigator
        .openAsset(id, { slideIn: { waitForClose: true } })
        .then(({ entity }: any) => getAssetData(entity));

    const defaults: any = {
      height: 600,
      menubar,
      plugins,
      toolbar,
      image_caption: true,
      toolbar_groups: {},
      quickbars_selection_toolbar: quickbarsSelectionToolbar,
      quickbars_insert_toolbar: false,
      content_style: customContentStyle,
      setup: (editor: any) => setupEditor(editor),
    };

    if (formatgroup) {
      defaults.toolbar_groups.formatgroup = {
        icon: "format",
        tooltip: "Formatting",
        items: formatgroup,
      };
    }

    if (assetgroup) {
      defaults.toolbar_groups.assetgroup = {
        icon: "gallery",
        tooltip: "Contentful Assets",
        items: "existingasset newasset",
      };
    }

    if (insertgroup) {
      defaults.toolbar_groups.insertgroup = {
        icon: "plus",
        tooltip: "Insert",
        items: insertgroup,
      };
    }

    if (extragroup) {
      defaults.toolbar_groups.extragroup = {
        icon: "more-drawer",
        tooltip: "More",
        items: extragroup,
      };
    }

    setInit(defaults);
  }, [sdk]);

  const handleEditorChange = (newValue: string) => {
    if (debounceInterval) {
      clearInterval(debounceInterval);
    }

    debounceInterval = setTimeout(() => {
      sdk.field.setValue(newValue);
    }, 500);
  };

  if (!init) {
    return (
      <div>
        Loading editor
      </div>
    )
  }

  return (
    <>
      <Editor
        apiKey={tinyMceApiKey}
        onInit={(_evt, editor) => {
          if (!editorRef?.current) return;
          editorRef.current = editor;
        }}
        initialValue={value}
        init={init}
        // init={{
        //   height: 500,
        //   menubar: true,
        //   plugins: [
        //     'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        //     'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        //     'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
        //     'table'
        //   ],
        //   toolbar: 'undo redo | ' +
        //     'bold italic forecolor | alignleft aligncenter ' +
        //     'alignright | bullist numlist outdent indent | ' +
        //     'table tableprops | tabledelete | tablerowheader | tablecellprops tablemergecells tablesplitcells' +
        //     'removeformat | help',
        //   content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        // }}
        onEditorChange={handleEditorChange}
      />
    </>
  )
};

export default Field;
