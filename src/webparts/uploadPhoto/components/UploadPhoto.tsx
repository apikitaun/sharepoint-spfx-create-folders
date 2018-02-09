import * as React from 'react';
import styles from './UploadPhoto.module.scss';
import { IUploadPhotoProps } from './IUploadPhotoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse,ISPHttpClientOptions} from '@microsoft/sp-http';
import {FolderProps} from './FolderProps';

export default class UploadPhoto extends React.Component<IUploadPhotoProps, {}> {
  protected menu :HTMLSelectElement ;
  protected name :HTMLInputElement;
  protected countryCode: string;
  protected fullPath: string;
  public render(): React.ReactElement<IUploadPhotoProps> {
    return (
      <div className={ styles.uploadPhoto }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.subTitle }>Type</span>
              <p><select id="type" ref = {(input)=> this.menu= input}>
                <option value="President">Presidente</option>
                <option value="SecretaryGeneral">Secretario General</option>
              </select></p> 
              <span className={ styles.subTitle }>Name</span>
              <p><input type="text" id="name" ref={(input) => this.name= input}/></p>
              <p className={ styles.subTitle }><a href="#" onClick={e => this.ToFolder(e)}>Upload Image</a></p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  public ToFolder (e : any) : void
  {
    //alert ('hola '+ this.menu.value+ " : "+this.name.value);
    this.countryCode = this.name.value;
    this.fullPath = this.name.value +'/'+this.menu.value;
    this.CreateFolderProcess();
  }
  private _existsFolder(name:string): Promise<FolderProps> {
    var url = this.props.context.pageContext.web.absoluteUrl+"/_api/web/GetFolderByServerRelativeUrl('PeopleImages/"+name+"')";
    console.log ("[_existsFolder] FOLDER: "+name);
    console.log("[GET]: "+url);
    return this.props.context.spHttpClient.get(url,SPHttpClient.configurations.v1)
       .then((response: SPHttpClientResponse) => {
         return response.json();
       }) as Promise<FolderProps>;
  }
  private _createFolder(name:string) : Promise<Response> {
    var url = this.props.context.pageContext.web.absoluteUrl+"/_api/web/folders/add('PeopleImages/"+name+"')";
    console.log("[POST]: "+url);
    var body = JSON.stringify({
        '__metadata': {
        'type': 'SP.Folder'},
        'ServerRelativeUrl':'/PeopleImages'+name
      });
       return this.props.context.spHttpClient.post(url,SPHttpClient.configurations.v1,{
         headers:{
            'accept' : 'application/json',
            'content-type' : 'application/json'
         },
         body: ''
       })
       .then((response: SPHttpClientResponse) => { return response.json(); 
      }) as Promise<Response>;
      
  }
  private _openSharepointFolder(url:string) : void
  {
    window.open(url,'_blank');
  }
  private CreateFolderProcess ()
  {
    this._existsFolder(this.countryCode).then((response : FolderProps)=> {
      if ( response.Exists == null)
      {
        console.log ('[_existsFolder] Folder: '+this.countryCode+' does not exists');
        this._createFolder(this.countryCode)
            .then((response: Response) =>
            {
               console.log('[_createFolder.RESPONSE]: '+response);
               this._existsFolder(this.fullPath).then((response:FolderProps)=> {
                 if ( response.Exists == null)
                 {
                    console.log ('[_existsFolder] Folder: '+this.countryCode+' does not exists');
                    this._createFolder(this.fullPath).then((response:Response) => {
                      this._openSharepointFolder(this.props.context.pageContext.web.absoluteUrl+"/PeopleImages/"+this.fullPath);
                    });
                 }
                 else
                 {
                   this._openSharepointFolder(this.props.context.pageContext.web.absoluteUrl+"/PeopleImages/"+this.fullPath);
                 }
               });
            });
      }
      else 
      {
         console.log ('[_existsFolder] Folder '+this.countryCode+" exists!");
         this._openSharepointFolder(this.props.context.pageContext.web.absoluteUrl+"/PeopleImages/"+this.fullPath);
      }
    });
  }
}
