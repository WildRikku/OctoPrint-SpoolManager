# OctoPrint-SpoolManager

This OctoPrint plugin manages all spool information and stores it in an SQLite database. MySQL and PostgreSQL support exist but are experimental! The default installation comes with SQLite only, which is supported. If you want to try MySQL or PostgreSQL, see the [external database section](#external-databases).

## Tested with:
- OctoPrint 1.10.2 with Python 3.12.4

Note that this does not necessarily mean that this plugin will not work with older versions of OctoPrint or Python.

## Included features

### Spool data:
- Spool basic attributes, like name,  color, material, vendor ...
- Used length and remaining weight
- User notes
- CSV import and export

### UI features
- List all spools
- Edit single spool
- Copy single spool
- Template spool
- Sort spool table
- Force to select a spool before printing
- Warn if not enough filament is present
- Filter spool table
- Table column visibility
- Scan QR/Barcodes of a spool
- Multi Tool support
- Support for manual mid-print filament change

## Screenshots
<!---
![plugin-settings](screenshots/plugin-settings.png "Plugin-Settings")
![plugin-tab](screenshots/plugin-tab.png "Plugin-Tab")
-->
![listSpools-tab](screenshots/listSpools-tab.png "ListSpools-Tab")
![selectSpools-sidebar](screenshots/selectSpool-sidebar.png "SelectSpool-Sidebar")
![selectSpools-dialog](screenshots/selectSpool-dialog.png "SelectSpool-Dialog")
![editSpool-dialog](screenshots/editSpool-dialog.png "EditSpool-Dialog")

## Setup
Install via the bundled [Plugin Manager](http://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html)
or manually using this URL:

    https://github.com/WildRikku/OctoPrint-SpoolManager/releases/latest/download/main.zip

After installation, you can listen on two release channels (since 1.7.7).
What does this mean: Each channel has its own release version and each release has a different kind of functionality and stability.

- **"Only Release"**: Only stable and tested versions will be shown in the software update section of OctoPrint.
- **"Release & Testing"**: Beside the stable release, you can also see the alpha versions, like '''1.8.0a2'''.
  The alpha versions include new functionality/bugfixes and should be considered untested. You can help bring them to a stable release by leaving feedback.

Changing between each release is done via the "Software Update section" in the settings.
![release-channels](screenshots/release-channels.png "Release channels")

Hint: "Easy-switching" is possible since OctoPrint version 1.8.0 (see https://github.com/OctoPrint/OctoPrint/issues/4238).

### External databases
By chosing **"Release & Testing"** as described in [Setup](#setup) above, you get access to MySQL and PostgreSQL support. **This is currently in alpha and unsupported. If you activate it, you do so at your own risk.** Make sure to have backups around.

Also note that you can't get MySQL without putting all of SpoolManager in experimental mode. This means that this documentation might be outdated and there might be untested features. You should check out the [issue tracker](https://github.com/WildRikku/OctoPrint-SpoolManager/issues) to see if there are known issues that might influence you. You can also ask in the plugin support channel on the Octoprint Discord server if something does not work.

If you want to take those risks, here is how it works:
1. Make a backup. See [here](https://github.com/WildRikku/OctoPrint-SpoolManager/issues/29) for more info.
2. Setup a MySQL or PostgreSQL database. This needs to be done by you. If you don't know how to do that, it is recommended to use SQLite instead, which means to stop at this point.
3. Install the appropriate Python packages for your database. For MySQL and OctoPi users, this will *probably* be `pymysql`. However, it might be something else. This depends on your setup. If you get connection errors later, this will be due to the wrong package being installed or because the wrong installation method was chosen. Make sure you understand how installing OctoPrint works and how Python modules work.
4. Activate **"Release & Testing"** as described in [Setup](#setup) above.
5. Restart OctoPrint.
6. Setup your connection in the SpoolManager settings.

## New maintainer

Please note that since September 2024, this repository has a new maintainer, WildRikku. Versions from 1.7.4 were published by the new maintainer.

## Versions

see [Release overview](https://github.com/WildRikku/OctoPrint-SpoolManager/releases/)
and [Release overview by previous maintainer](https://github.com/dojohnso/OctoPrint-SpoolManager/releases/)

---
# Developer section

## Events
Plugin sends the following custom events to the eventbus like this:

    eventManager().fire(eventKey, eventPayload)

| EventKeys                             |
| ------------------------------------ |
| plugin_spoolmanager_spool_weight_updated_after_print |
| plugin_spoolmanager_spool_selected |
| plugin_spoolmanager_spool_deselected |
| plugin_spoolmanager_spool_added |
| plugin_spoolmanager_spool_deleted |

HINT: In combination with the [MQTT Plugin](https://github.com/OctoPrint/OctoPrint-MQTT) you can subscribe e.g. to this topic:
```
octoPrint/event/plugin_spoolmanager_spool_deselected
```


**Payload**

_spool_added_, _spool_selected_
```javascript
 {
   'databaseId': 23,
   'toolId': 1,
   'spoolName':'Fancy Spool',
   'material':'ABS',
   'colorName':'dark red',
   'remainingWeight': 1234
 }
```
_spool_deselected_
```javascript
 {
   'toolId': 1
 }
```
_spool_deleted_
```javascript
 {
   'databaseId': 23
 }
```
Other Plugins could listen to this events in there python-code like this:

    eventmanager.subscribe("plugin_spoolmanager_spool_selected", self._myEventListener)

or use `octoprint.plugin.EventHandlerPlugin` with something like this:

    def on_event(self, event, payload):
        if event == "plugin_spoolmanager_spool_selected":
            ## do something usefull
---

### UI dependencies
* Color-Picker:
Pick-a-Color https://github.com/lauren/pick-a-color/
* Color Helper:
https://github.com/bgrins/TinyColor
* Date-Picker:
datepicker https://github.com/fengyuanchen/datepicker

* datetimepicker
 https://github.com/xdan/datetimepicker/tree/2.5.20
https://www.jqueryscript.net/time-clock/Clean-jQuery-Date-Time-Picker-Plugin-datetimepicker.html

* Select/Labels
select2 https://select2.org/

* WYSIWYG - Editor
quill https://quilljs.com/
