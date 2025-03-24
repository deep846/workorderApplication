/*global QUnit*/

sap.ui.define([
	"workorder/controller/workorder.controller"
], function (Controller) {
	"use strict";

	QUnit.module("workorder Controller");

	QUnit.test("I should test the workorder controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
