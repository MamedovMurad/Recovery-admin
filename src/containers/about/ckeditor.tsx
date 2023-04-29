import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import agent, { baseImageUrl } from '../../App/Api';

interface CKEDITProps {
  about:string,
  onchange:any
}

const CKEDIT: React.FC<CKEDITProps> = ({about, onchange }) => {
  function uploadPlugin(editor:any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader:any) => {
      return uploadAdapter(loader);
    };
  }
  

  function uploadAdapter(loader:any) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file:any) => {
            body.append("upload", file);
            // let headers = new Headers();
            // headers.append("Origin", "http://localhost:3000");
           agent.fileservice(body).then((res) => {
                resolve({
                  default: `${baseImageUrl}public/uploads/${res.fileName}`
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      }
    };
  }


  return (
    
        <CKEditor
                        editor={ClassicEditor}
                        data={about}
                        config={{
                          extraPlugins: [uploadPlugin]
                        }}
                      
                        onChange={ onchange }
                   
                 
                    />
    
  );
};

export default CKEDIT;