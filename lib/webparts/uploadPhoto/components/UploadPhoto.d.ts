/// <reference types="react" />
import * as React from 'react';
import { IUploadPhotoProps } from './IUploadPhotoProps';
export default class UploadPhoto extends React.Component<IUploadPhotoProps, {}> {
    protected menu: HTMLSelectElement;
    protected name: HTMLInputElement;
    protected countryCode: string;
    protected fullPath: string;
    render(): React.ReactElement<IUploadPhotoProps>;
    ToFolder(e: any): void;
    private _existsFolder(name);
    private _createFolder(name);
    private _openSharepointFolder(url);
    private CreateFolderProcess();
}
