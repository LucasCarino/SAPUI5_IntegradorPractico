jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([ 
    "IntegradorPractico/IntegradorPractico/util/Constants"
], function (Constants) {
    "use strict";
    return{
        formatStock: function(sStock) {
            let stock = parseFloat(sStock);
            if(stock === 0) {
                return 'Out of Stock';
            } else if (stock > 1 && stock < 30) {
                return 'Little Stock'
            } else {
                return 'In Stock'
            }
        },
        formatState: function(sStock) {
            let stock = parseFloat(sStock);
            if(stock === 0) {
                return 'Error';
            } else if (stock > 1 && stock < 30) {
                return 'Warning'
            } else {
                return 'Success'
            }
        },
        formatPrice: function(sPrice) {
            return parseFloat(sPrice) + " USD";
        }
    }
}, true);