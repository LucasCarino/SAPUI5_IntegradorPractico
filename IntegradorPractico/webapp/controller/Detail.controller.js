sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "IntegradorPractico/IntegradorPractico/util/Services",
    "IntegradorPractico/IntegradorPractico/util/Constants",
    "IntegradorPractico/IntegradorPractico/util/Formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
    ],
    function (Controller, JSONModel, Services, Constants, Formatter, Fragment, MessageBox, MessageToast) {
        "use strict";
        return Controller.extend("IntegradorPractico.IntegradorPractico.controller.Detail", {
            Formatter: Formatter,
            onInit: function () {
                let oModel = this.getOwnerComponent().getModel(Constants.MODELS.selectedProduct);
            },
            _onRouteMatched: function (oEvent) {
                this._productID = oEvent.getParameter("arguments").ProductID;
                this.getView().bindElement(Constants.ROUTES.routeDetail + this._productID);
            },
            onEdit: function () {
                const oView = this.getView();
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        id: oView.getId(),
                        name: Constants.FRAGMENTS.routes.editDialog,
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    })
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                })
            },
            onDelete: function () {
                let oBundle = this.getOwnerComponent().getModel('i18n').getResourceBundle();
                MessageBox.confirm(oBundle.getText('ConfirmDelete'), {
                    actions: [Constants.ACTIONS.ok, Constants.ACTIONS.cancel],
                    emphasizedAction: "OK",
                    onClose: function (sAction) {
                        if (sAction == "OK")
                            MessageToast.show(oBundle.getText('Delete'));
                    }
                });
            },
            onCopy: function () {
                let oBundle = this.getOwnerComponent().getModel('i18n').getResourceBundle();
                MessageToast.show(oBundle.getText('CopyMessage'))
            },
            closeDialog: function () {
                this.byId(Constants.FRAGMENTS.ids.editDialog).close();
            },
        });
    });