sap.ui.define([
    "IntegradorPractico/IntegradorPractico/util/Constants"
],
function (Constants) {
    "use strict"; return { 
        getLocalJSON: function (sJsonName) {
            return this.promisizer(jQuery.sap.getModulePath("?"));
        },
        getProducts: function () {
            let oRequest = this.getRequest({
                endPoint: Constants.REQUEST.endPoint.northwind,
                method: Constants.REQUEST.method.GET,
                entity: Constants.REQUEST.entity.products
            });
            return this.promisizer(oRequest);
        },
        getCategory: function (categoryID) {
            let oRequest = this.getRequest({
                endPoint: Constants.REQUEST.endPoint.northwind,
                method: Constants.REQUEST.method.GET,
                entity: Constants.REQUEST.entity.products + "(" + categoryID + ")/Category"
            });
            return this.promisizer(oRequest);
        },
        getSupplier: function (supplierID) {
            let oRequest = this.getRequest({
                endPoint: Constants.REQUEST.endPoint.northwind,
                method: Constants.REQUEST.method.GET,
                entity: Constants.REQUEST.entity.products + "(" + supplierID + ")/Supplier"
            });
            return this.promisizer(oRequest);
        },
        promisizer: function (oOptions) {
            return this.toPromise(jQuery.ajax(oOptions));
        },
        toPromise: function (oPromise) {
            return new Promise(function (resolve, reject) {
                oPromise.then(() => {
                    const sHeaders = oPromise.done().getAllResponseHeaders();
                    const aHeaders = sHeaders.trim().split(/[\r\n]+/);
                    const oHeaderMap = {};
                    aHeaders.forEach(function (sLine) {
                        const aParts = sLine.split(': ');
                        const sHeader = aParts.shift();
                        const sValue = aParts.join(': ');
                        oHeaderMap[sHeader] = sValue;
                    });
                    resolve([oPromise.done().responseJSON, oHeaderMap]);
                }, reject);
            });
        },
        /**
        * Gets an object with jQuery.ajax compatible properties
        * @param {Object} oOptions Mapped hash of URL info properties
        * @param {string} oOptions.endPoint Connection endpoint (SCP)
        * @param {string} oOptions.method Request method, e.g GET
        * @param {Boolean} oOptions.fetch Request flag for fetching a CSRF token
        * @param {string} oOptions.params URL Like string parameters
        * @param {string} oOptions.data Request data
        */
        getRequest: function (oOptions = {}) {
        const oHeaders = {
        'Content-Type': "application/json;charset=UTF-8;IEEE754Compatible=true",
        'accept': "application/json",
        'Access-Control-Allow-Origin': "*"
        };
        if (oOptions.username && oOptions.password) {
        oHeaders.Authorization = "Basic " + btoa(oOptions.username + ":" + oOptions.password);
        }
        if (oOptions.fetch) {
        oHeaders['X-CSRF-TOKEN'] = 'Fetch';
        }
        if (oOptions.method === 'POST') {
        oHeaders['X-CSRF-TOKEN'] = localStorage.getItem('csrf');
        }
        const sParams = oOptions.params ? "?" + oOptions.params : "";
        return {
        headers: oHeaders,
        url: this.getBaseURL(oOptions.endPoint) + this.getEndpoint(oOptions) + "/" + (oOptions.entity || '') + sParams,
        method: oOptions.method,
        data: oOptions.data || ''
            };
        },
        getEndpoint: function (oOptions) {
        return oOptions.endPoint;
        },
        getBaseURL: function (sEndPoint) {
        return jQuery.sap.getModulePath("IntegradorPractico.IntegradorPractico") + "/";
        }
    };
});