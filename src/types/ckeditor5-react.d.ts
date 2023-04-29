declare module '@ckeditor/ckeditor5-react' {
    import { Editor } from '@ckeditor/ckeditor5-core';
    import * as React from 'react';
  
    interface CKEditorProps {
      editor: any;
      config?: any;
      data?: string;
      disabled?: boolean;
      onInit?: (editor: Editor) => void;
      onChange?: (event: any, editor: Editor) => void;
      onBlur?: (event: any, editor: Editor) => void;
      onFocus?: (event: any, editor: Editor) => void;
      onReady?:(event:any)=>void
    }
  
    class CKEditor extends React.Component<CKEditorProps> {}
  
    export const  CKEditor;
  }