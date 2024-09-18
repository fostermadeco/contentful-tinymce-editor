export interface AppInstallationParameters {
    tinyMceApiKey: string;
    plugins?: string;
    toolbar?: string;
    assetgroup?: string;
    extragroup?: string;
    formatgroup?: string;
    insertgroup?: string;
    quickbarsSelectionToolbar?: string;
    menubar?: boolean;
    resizing?: string;
    customContentStyle?: string;
}


// export const defaultParameters: AppInstallationParameters = {
//     tinyMceApiKey: "",
//     plugins:
//         "preview advlist autolink lists link image charmap anchor searchreplace visualblocks visualchars code fullscreen insertdatetime media table paste wordcount autoresize hr nonbreaking paste quickbars emoticons",
//     toolbar:
//         "undo redo | styleselect | existingasset newasset | bold italic underline formatgroup | bullist numlist | table assetgroup link | insertgroup | extragroup",
//     formatgroup:
//         "strikethrough superscript subscript | alignleft aligncenter alignright | indent outdent | forecolor backcolor | removeformat",
//     insertgroup:
//         "media emoticons charmap emoji hr anchor insertdatetime nonbreaking",
//     assetgroup: "existingasset newasset",
//     extragroup:
//         "paste pastetext | visualchars visualblocks preview wordcount | searchreplace | code",
//     quickbarsSelectionToolbar:
//         "bold italic underline | formatselect | quicklink blockquote",
//     menubar: false,
//     customcolors: false,
//     custompalette: false,
//     colormap: colormap,
//     resizing: "fit=fill&w=1024&q=80",
//     customContentStyle:
//         "img { max-width: 100% !important; max-height: 400px; object-fit: cover; }",
// };
export const defaultParameters: AppInstallationParameters = {
    tinyMceApiKey: "",
    plugins:
        "preview advlist autolink lists link image charmap anchor searchreplace visualblocks visualchars code codesample fullscreen insertdatetime media table paste wordcount autoresize hr nonbreaking paste quickbars emoticons",
    toolbar:
        "undo redo | styleselect | bold italic underline formatgroup codesample | bullist numlist | table assetgroup link | insertgroup | extragroup",
    formatgroup:
        "strikethrough superscript subscript | code-sample | alignleft aligncenter alignright | indent outdent | forecolor backcolor | removeformat",
    // insertgroup:
    //     "media emoticons charmap emoji hr anchor insertdatetime nonbreaking",
    assetgroup: "existingasset newasset",
    // extragroup:
    //     "paste pastetext | visualchars visualblocks preview wordcount | searchreplace | code",
    extragroup:
        "paste pastetext | searchreplace | code",
    quickbarsSelectionToolbar:
        "bold italic underline codesample | formatselect | quicklink",
    menubar: false,
    resizing: "w=1024&q=80",
    customContentStyle:
        "img { max-width: 100% !important; max-height: 400px; object-fit: cover; }",
};
