import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'UploadPhotoWebPartStrings';
import UploadPhoto from './components/UploadPhoto';
import { IUploadPhotoProps } from './components/IUploadPhotoProps';


export interface IUploadPhotoWebPartProps {
  description: string;
}

export default class UploadPhotoWebPart extends BaseClientSideWebPart<IUploadPhotoWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IUploadPhotoProps > = React.createElement(
      UploadPhoto,
      {
        description: this.properties.description,
        context : this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
