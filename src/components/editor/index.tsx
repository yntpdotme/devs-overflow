"use client";

import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  Separator,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import {basicDark} from "cm6-theme-basic-dark";
import {useTheme} from "next-themes";
import {Ref} from "react";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

type EditorProps = {
  value: string;
  editorRef: Ref<MDXEditorMethods> | null;
  fieldChange: (value: string) => void;
};

const Editor = ({value, editorRef, fieldChange}: EditorProps) => {
  const {resolvedTheme} = useTheme();

  const themeExtension = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      ref={editorRef}
      onChange={fieldChange}
      className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full rounded-lg border shadow-sm"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({defaultCodeBlockLanguage: ""}),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "css",
            txt: "txt",
            sql: "sql",
            html: "html",
            sass: "sass",
            scss: "scss",
            bash: "bash",
            json: "json",
            js: "javascript",
            ts: "typescript",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
            rust: "rust",
            go: "go",
            "": "unspecified",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: themeExtension,
        }),
        diffSourcePlugin({viewMode: "rich-text", diffMarkdown: ""}),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: editor => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />

                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <Separator />

                      <ListsToggle />
                      <Separator />

                      <CreateLink />
                      <InsertImage />
                      <Separator />

                      <InsertTable />
                      <InsertThematicBreak />
                      <Separator />

                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
        markdownShortcutPlugin(),
      ]}
    />
  );
};

export default Editor;
