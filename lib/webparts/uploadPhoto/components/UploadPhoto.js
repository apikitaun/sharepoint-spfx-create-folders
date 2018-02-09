"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var UploadPhoto_module_scss_1 = require("./UploadPhoto.module.scss");
var sp_lodash_subset_1 = require("@microsoft/sp-lodash-subset");
var sp_http_1 = require("@microsoft/sp-http");
var UploadPhoto = (function (_super) {
    __extends(UploadPhoto, _super);
    function UploadPhoto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UploadPhoto.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: UploadPhoto_module_scss_1.default.uploadPhoto },
            React.createElement("div", { className: UploadPhoto_module_scss_1.default.container },
                React.createElement("div", { className: UploadPhoto_module_scss_1.default.row },
                    React.createElement("div", { className: UploadPhoto_module_scss_1.default.column },
                        React.createElement("span", { className: UploadPhoto_module_scss_1.default.subTitle }, "Type"),
                        React.createElement("p", null,
                            React.createElement("select", { id: "type", ref: function (input) { return _this.menu = input; } },
                                React.createElement("option", { value: "President" }, "Presidente"),
                                React.createElement("option", { value: "SecretaryGeneral" }, "Secretario General"))),
                        React.createElement("span", { className: UploadPhoto_module_scss_1.default.subTitle }, "Name"),
                        React.createElement("p", null,
                            React.createElement("input", { type: "text", id: "name", ref: function (input) { return _this.name = input; } })),
                        React.createElement("p", { className: UploadPhoto_module_scss_1.default.subTitle },
                            React.createElement("a", { href: "#", onClick: function (e) { return _this.ToFolder(e); } }, "Upload Image")),
                        React.createElement("p", { className: UploadPhoto_module_scss_1.default.description }, sp_lodash_subset_1.escape(this.props.description)),
                        React.createElement("a", { href: "https://aka.ms/spfx", className: UploadPhoto_module_scss_1.default.button },
                            React.createElement("span", { className: UploadPhoto_module_scss_1.default.label }, "Learn more")))))));
    };
    UploadPhoto.prototype.ToFolder = function (e) {
        //alert ('hola '+ this.menu.value+ " : "+this.name.value);
        this.countryCode = this.name.value;
        this.fullPath = this.name.value + '/' + this.menu.value;
        this.CreateFolderProcess();
    };
    UploadPhoto.prototype._existsFolder = function (name) {
        var url = this.props.context.pageContext.web.absoluteUrl + "/_api/web/GetFolderByServerRelativeUrl('PeopleImages/" + name + "')";
        console.log("[_existsFolder] FOLDER: " + name);
        console.log("[GET]: " + url);
        return this.props.context.spHttpClient.get(url, sp_http_1.SPHttpClient.configurations.v1)
            .then(function (response) {
            return response.json();
        });
    };
    UploadPhoto.prototype._createFolder = function (name) {
        var url = this.props.context.pageContext.web.absoluteUrl + "/_api/web/folders/add('PeopleImages/" + name + "')";
        console.log("[POST]: " + url);
        var body = JSON.stringify({
            '__metadata': {
                'type': 'SP.Folder'
            },
            'ServerRelativeUrl': '/PeopleImages' + name
        });
        return this.props.context.spHttpClient.post(url, sp_http_1.SPHttpClient.configurations.v1, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: ''
        })
            .then(function (response) {
            return response.json();
        });
    };
    UploadPhoto.prototype._openSharepointFolder = function (url) {
        window.open(url, '_blank');
    };
    UploadPhoto.prototype.CreateFolderProcess = function () {
        var _this = this;
        this._existsFolder(this.countryCode).then(function (response) {
            if (response.Exists == null) {
                console.log('[_existsFolder] Folder: ' + _this.countryCode + ' does not exists');
                _this._createFolder(_this.countryCode)
                    .then(function (response) {
                    console.log('[_createFolder.RESPONSE]: ' + response);
                    _this._existsFolder(_this.fullPath).then(function (response) {
                        if (response.Exists == null) {
                            console.log('[_existsFolder] Folder: ' + _this.countryCode + ' does not exists');
                            _this._createFolder(_this.fullPath).then(function (response) {
                                _this._openSharepointFolder(_this.props.context.pageContext.web.absoluteUrl + "/PeopleImages/" + _this.fullPath);
                            });
                        }
                        else {
                            _this._openSharepointFolder(_this.props.context.pageContext.web.absoluteUrl + "/PeopleImages/" + _this.fullPath);
                        }
                    });
                });
            }
            else {
                console.log('[_existsFolder] Folder ' + _this.countryCode + " exists!");
                _this._openSharepointFolder(_this.props.context.pageContext.web.absoluteUrl + "/PeopleImages/" + _this.fullPath);
            }
        });
    };
    return UploadPhoto;
}(React.Component));
exports.default = UploadPhoto;

//# sourceMappingURL=UploadPhoto.js.map
