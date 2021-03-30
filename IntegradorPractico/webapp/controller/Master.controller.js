sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "IntegradorPractico/IntegradorPractico/util/Constants",
    "IntegradorPractico/IntegradorPractico/util/Services",
    "IntegradorPractico/IntegradorPractico/util/Formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device",
    "sap/ui/model/Sorter",
    "sap/m/library"
],
    function (Controller, JSONModel, Fragment, Constants, Services, Formatter, Filter, FilterOperator, Device, Sorter, Library) {
        "use strict";
        return Controller.extend("IntegradorPractico.IntegradorPractico.controller.Master", {
            Formatter: Formatter,
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute(Constants.ROUTES.master).attachPatternMatched(this._onRouteMatched, this);
                this.loadProductsModel();
                var oPriceModel = new JSONModel({
                    currency: "USD"
                });
                this.getOwnerComponent().setModel(oPriceModel, Constants.MODELS.price);
                this._mViewSettingsDialog = {};
            },
            _onRouteMatched: function () {
                this.getOwnerComponent().getRouter().navTo(Constants.ROUTES.detail);
            },
            loadProductsModel: async function () {
                let oComponent = this.getOwnerComponent();
                let oResponse = await Services.getProducts();
                let oData = oResponse[0];
                var oProducts = new JSONModel();
                oProducts.setData(oData);
                oComponent.setModel(oProducts, Constants.MODELS.products);
                var oLength = {
                    value: oData.value.length
                }
                var oCountModel = new JSONModel(oLength);
                this.getView().setModel(oCountModel, Constants.MODELS.count);
                this.loadFirstProduct();
            },
            loadFirstProduct: function () {
                var oProductsModel = this.getView().getModel(Constants.MODELS.products);
                var oSelectedProduct = oProductsModel.getProperty("/value/0");
                var oModel = new JSONModel(oSelectedProduct);
                this.getOwnerComponent().setModel(oModel, Constants.MODELS.selectedProduct);
                var categoryID = oSelectedProduct.CategoryID;
                var supplierID = oSelectedProduct.SupplierID;
                this.loadCategoryModel(categoryID);
                this.loadSupplierModel(supplierID);
            },
            loadCategoryModel: async function (categoryID) {
                let oComponent = this.getOwnerComponent();
                let oResponse = await Services.getCategory(categoryID);
                let oData = oResponse[0];
                var oCategory = new JSONModel();
                oCategory.setData(oData);
                oComponent.setModel(oCategory, Constants.MODELS.category);
            },
            loadSupplierModel: async function (supplierID) {
                let oComponent = this.getOwnerComponent();
                let oResponse = await Services.getSupplier(supplierID);
                let oData = oResponse[0];
                var oSupplier = new JSONModel();
                oSupplier.setData(oData);
                oComponent.setModel(oSupplier, Constants.MODELS.supplier);
            },
            onSelectionChange: async function (oEvent) {
                var oBindingContext = oEvent.getSource().getSelectedItem().getBindingContext(Constants.MODELS.products);
                var oProductsModel = this.getView().getModel(Constants.MODELS.products);
                var oSelectedProduct = oProductsModel.getProperty(oBindingContext.getPath());
                var oSelectedProductModel = new JSONModel(oSelectedProduct);
                this.getOwnerComponent().setModel(oSelectedProductModel, Constants.MODELS.selectedProduct);
                var categoryID = oSelectedProduct.CategoryID;
                var supplierID = oSelectedProduct.SupplierID;
                this.loadCategoryModel(categoryID);
                this.loadSupplierModel(supplierID);
            },
            onSearch: function (oEvent) {
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var oFilter = new Filter(Constants.FILTERS.productName, FilterOperator.Contains, sQuery);
                    aFilters.push(oFilter);
                    var oFilters = new Filter(aFilters);
                }
                let fragmentList = this.getView().createId(Constants.FRAGMENTS.ids.list);
                let oProductList = sap.ui.core.Fragment.byId(fragmentList, Constants.FRAGMENTS.ids.productsList);
                var oBindingInfo = oProductList.getBinding("items");
                oBindingInfo.filter(oFilters, "Application");
                let oProductsCount = this.getView().getModel(Constants.MODELS.count);
                let length = {
                    value: oBindingInfo.aIndices.length
                };
                oProductsCount.setData(length);
            },
            onSort: function () {
                this.createViewSettingDialog(Constants.FRAGMENTS.routes.sortDialog).open();
            },
            onFilter: function () {
                this.createViewSettingDialog(Constants.FRAGMENTS.routes.filterDialog).open();
            },
            createViewSettingDialog: function (sDialogFramentName) {
                let oBundle = this.getOwnerComponent().getModel('i18n').getResourceBundle();
                var oDialog;
                oDialog = this._mViewSettingsDialog[sDialogFramentName];
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(sDialogFramentName, this);
                    this._mViewSettingsDialog[sDialogFramentName] = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setFilterSearchOperator(Library.StringFilterOperator.Contains);
                    if (Device.system.desktop) {
                        oDialog.addStyleClass("sapUISizeCompact");
                    }
                }
                if (sDialogFramentName === Constants.FRAGMENTS.routes.filterDialog) {
                    var oModelJSON = this.getOwnerComponent().getModel(Constants.MODELS.products);
                    var modelOriginal = oModelJSON.getProperty("/value");
                    var jsonProduct = JSON.parse(JSON.stringify(modelOriginal, ["ProductName"]));
                    var jsonPrice = JSON.parse(JSON.stringify(modelOriginal, ["UnitPrice"]));
                    oDialog.setModel(oModelJSON);
                    jsonProduct = jsonProduct.filter(function (currentObject) {
                        if (currentObject.ProductName in jsonProduct) {
                            return false;
                        } else {
                            jsonProduct[currentObject.ProductName] = true;
                            return true
                        }
                    });
                    var productFilter = [];
                    for (var i = 0; i < jsonProduct.length; i++) {
                        productFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonProduct[i].ProductName,
                                key: "ProductName"
                            })
                        );
                    }
                    jsonPrice = jsonPrice.filter(function (currentObject) {
                        if (currentObject.UnitPrice?.jsonPrice) {
                            return false;
                        } else {
                            jsonPrice[currentObject.UnitPrice] = true;
                            return true
                        }
                    });
                    var priceFilter = [];
                    jsonPrice = jsonPrice.map(sPrice => {
                        return parseFloat(sPrice.UnitPrice)
                    })
                    for (var i = 0; i < jsonPrice.length; i++) {
                        priceFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonPrice[i],
                                key: "UnitPrice"
                            })
                        )
                    }
                    oDialog.destroyFilterItems();
                    oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                        key: 'ProductName',
                        text: oBundle.getText('Product'),
                        items: productFilter
                    }));
                    oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                        key: 'UnitPrice',
                        text: oBundle.getText('Price'),
                        items: priceFilter
                    }))
                }
                return oDialog;
            },
            onSortDialogConfirm: function (oEvent) {
                let fragmentList = this.getView().createId(Constants.FRAGMENTS.ids.list);
                let oProductList = sap.ui.core.Fragment.byId(fragmentList, Constants.FRAGMENTS.ids.productsList);
                let mParams = oEvent.getParameters();
                let oBinding = oProductList.getBinding("items");
                let sPath;
                let bDescending;
                let aSorters = [];
                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            },
            onFilterDialogConfirm: function (oEvent) {
                let fragmentList = this.getView().createId(Constants.FRAGMENTS.ids.list);
                let oProductList = sap.ui.core.Fragment.byId(fragmentList, Constants.FRAGMENTS.ids.productsList);
                let mParams = oEvent.getParameters();
                let oBinding = oProductList.getBinding("items");
                let aFilters = [];
                mParams.filterItems.forEach(function (oItem) {
                    let sPath = oItem.getKey();
                    let sOperator = FilterOperator.Contains;
                    let sValue = oItem.getText();
                    let oFilter = new Filter(sPath, sOperator, sValue);
                    aFilters.push(oFilter)
                });
                oBinding.filter(aFilters)
                let oProductsCount = this.getView().getModel(Constants.MODELS.count);
                let length = {
                    value: aFilters.length
                };
                oProductsCount.setData(length);
            }
        });
    });
