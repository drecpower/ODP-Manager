export class UploadUtil {
    public static ChooseFileDialog(){
        return new Promise<FileList>(
            (resolve,reject)=>{
                let inputElm=document.createElement("input");
                inputElm.type="file";
                inputElm.onchange=(evt)=>{
                    var elm = <HTMLInputElement>evt.srcElement;
                    resolve(elm.files);
                }
                inputElm.click();
            }
        )
    }
}