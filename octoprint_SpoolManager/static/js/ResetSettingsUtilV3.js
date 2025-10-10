/**
 *
 */
function ResetSettingsUtilV3(pluginSettings){

    var self = this;
    var pluginSettingsFromPlugin = pluginSettings;

    var RESET_BUTTON_ID = "resetSettingsButton"
    var RESET_BUTTON_HTML = "<button id='"+RESET_BUTTON_ID+"' class='btn btn-warning' style='margin-right:3%'>Reset Settings</button>"

    this.assignResetSettingsFeature = function(PLUGIN_ID_string, mapSettingsToViewModel_function){
        var resetSettingsButtonFunction = function(){
            var resetButton = $("#" + RESET_BUTTON_ID).hide();
        }
        // hide reset button when hidding settings. needed because of next dialog-shown event
        var settingsDialog = $("#settings_dialog");
        var settingsDialogDOMElement = settingsDialog.get(0);

        var eventObject = $._data(settingsDialogDOMElement, 'events');
        if (eventObject !== undefined && eventObject.hide !== undefined){
            // already there, is it my function
            if (eventObject.hide[0].handler.name !== "resetSettingsButtonFunction"){
                settingsDialog.on('hide', resetSettingsButtonFunction);
            }
        } else {
            settingsDialog.on('hide', resetSettingsButtonFunction);
        }

        // add click hook for own plugin the check if resetSettings is available
        var pluginSettingsLink = $("ul[id=settingsTabs] > li[id^=settings_plugin_"+PLUGIN_ID_string+"] > a[href^=\\#settings_plugin_"+PLUGIN_ID_string+"]:not([hooked="+PLUGIN_ID_string+"])");
        pluginSettingsLink.attr("hooked", PLUGIN_ID_string);
        pluginSettingsLink.click(function() {
            // noinspection JSJQueryEfficiency - result changes after HTML insertion
            var resetButton = $("#" + RESET_BUTTON_ID);
            // build-button, if necessary
            if (resetButton.length === 0) {
                // add button to page
                $(".modal-footer > .aboutlink").after(RESET_BUTTON_HTML);
                resetButton = $("#" + RESET_BUTTON_ID);
            }

            // add/update click action
            resetButton.unbind("click");
            resetButton.click(function () {
                $.ajax({
                    url: API_BASEURL + "plugin/" + PLUGIN_ID_string + "?action=getDefaultSettings",
                    type: "GET"
                }).done(function (data) {
                    new PNotify({
                        title: "Default settings restored!",
                        text: "The plugin settings have been reset but not yet been saved.<br>Remember to save. If you reset the settings accidentally, you can reload the page to revert.",
                        type: "info",
                        hide: true
                    });
                    // reset all values
                    for (var propName in data) {
                        propValue = data[propName];
                        // nested object, like databaseSettings? only a depth of 1
                        if ("object" == typeof (propValue) && propValue != null && propName !== "excludedFromTemplateCopy") {
                            for (var subPropName in propValue) {
                                subPropValue = propValue[subPropName];
                                pluginSettingsFromPlugin[propName][subPropName](propValue);
                            }
                        } else if (propName === "excludedFromTemplateCopy") {
                            pluginSettingsFromPlugin[propName].removeAll();
                            propValue.forEach(function (excludePropName) {
                                pluginSettingsFromPlugin[propName].push(excludePropName);
                            });
                        } else {
                            pluginSettingsFromPlugin[propName](propValue);
                        }
                    }
                    // delegae to the client. So lient is able to reset/init other values
                    mapSettingsToViewModel_function(data);
                });
            });

            resetButton.show();
        });

        // default behaviour -> hide reset button --> if not already assigned
        var otherSettingsLink = $("ul[id=settingsTabs] > li[id^=settings_] > a[href^=\\#settings_]:not([hooked])");
        if (otherSettingsLink.length !== 0){
            otherSettingsLink.attr("hooked", "otherSettings");
            otherSettingsLink.click(resetSettingsButtonFunction);
        }
    }

}
