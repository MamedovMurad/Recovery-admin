import agent, { baseImageUrl } from "../App/Api";

export function uploadPlugin(editor:any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader:any) => {
      return uploadAdapter(loader);
    };
  }
  

  export function uploadAdapter(loader:any) {
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