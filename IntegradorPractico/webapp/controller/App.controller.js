sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	function (Controller) {
		"use strict";

		return Controller.extend("IntegradorPractico.IntegradorPractico.controller.App", {
			onInit: function () {

            },
            onAfterRendering: function () {
                var oSplitApp = this.getView().byId("app");
                oSplitApp.getAggregation("_navMaster").addStyleClass("masterStyle");
            }
		});
	});
