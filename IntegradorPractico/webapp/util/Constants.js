sap.ui.define([
], function () {
    "use strict";
    return{
        REQUEST: {
            endPoint: {
                northwind: "Northwind"
            },
            method: {
                GET: "GET"
            },
            entity: {
                products: "/V3/Northwind/Northwind.svc/Products"
            }
        },
        IDS: {
            productList: "productList"
        },
        MODELS: {
            products: "ProductsModel",
            selectedProduct: "SelectedProductModel",
            price: "PriceModel",
            count: "CountModel",
            category: "CategoryModel",
            supplier: "SupplierModel"
        },
        ROUTES: {
            master: "RouteMaster",
            detail: "RouteDetail"
        },
        FRAGMENTS: {
            ids: {
                list: "fragmentList",
                editDialog: "EditDialog",
                productsList: "productsList"
            },
            routes: {
                editDialog: "IntegradorPractico.IntegradorPractico.fragments.EditDialog"
            }
        },
        FILTERS: {
            productName: "ProductName"
        },
        ACTIONS: {
            ok: "OK",
            cancel: "Cancelar"
        }
    };
}, true);