sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Fragment",
        "IntegradorPractico/IntegradorPractico/util/Constants",
        "IntegradorPractico/IntegradorPractico/util/Services",
        "IntegradorPractico/IntegradorPractico/util/Formatter",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSONModel, Fragment, Constants, Services, Formatter, Filter, FilterOperator) {
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
                var oLength= {
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
                if (sQuery && sQuery.length > 0){
                    var oFilter = new Filter (Constants.FILTERS.productName, FilterOperator.Contains, sQuery);
                    aFilters.push(oFilter);
                    var oFilters = new Filter (aFilters);
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
            }
		});
	});
