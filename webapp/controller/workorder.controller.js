sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, Fragment, DateFormat) {
    "use strict";

    return Controller.extend("workorder.controller.workorder", {

        onInit: function () {
            this._fetchDataFromAPI();
        },

        onRefreshPress: function () {
            this._fetchDataFromAPI();
        },

        _fetchDataFromAPI: function () {
            var sUrl = "https://exceltojson-b9hgh7cshzfkgcg2.canadacentral-01.azurewebsites.net/result";
            fetch(sUrl)
                .then(response => response.json())
                .then(data => {
                    var oModel = new JSONModel(data);
                    this.getView().setModel(oModel, "apiData");
                })
                .catch(error => {
                    console.error("Error fetching data: ", error);
                    sap.m.MessageToast.show("Failed to load data.");
                });
        },

        // Show the detailed message in a dialog (fragment)
        onShowMessageDetails: function (oEvent) {
            var oItem = oEvent.getSource().getParent();  // Get the row that the button is in
            var oBindingContext = oItem.getBindingContext("apiData");  // Get the binding context for the selected row
        
            // Create the fragment if it doesn't exist
            if (!this._oMessageDetailsDialog) {
                Fragment.load({
                    name: "workorder.view.MessageDetails",  // Path to the fragment without .fragment.xml extension
                    controller: this
                }).then(function (oDialog) {
                    this._oMessageDetailsDialog = oDialog;
                    this.getView().addDependent(this._oMessageDetailsDialog);  // Add dialog to view's dependent
                    this._oMessageDetailsDialog.open();  // Open the dialog
                    this._oMessageDetailsDialog.setBindingContext(oBindingContext, "apiData");  // Bind the data
                }.bind(this));
            } else {
                // If fragment already exists, just open it
                this._oMessageDetailsDialog.open();
                this._oMessageDetailsDialog.setBindingContext(oBindingContext, "apiData");
            }
        },
        
        onCloseMessageDetails: function () {
            this._oMessageDetailsDialog.close();  // Close the dialog
        },
        
        
        // Define the formatter for the message
        formatter: {
            formatDate: function (dateString) {
                var oDateFormat = DateFormat.getInstance({ pattern: "EEEE, MMMM dd, yyyy, hh:mm:ss a" });
                return oDateFormat.format(new Date(dateString));
            },
            formatMessage: function (messageArray) {
                if (Array.isArray(messageArray)) {
                    return messageArray.map(msg => `=> `+msg.Message).join(`\n \n`);
                }
                return "";
            }
        }
    });
});
