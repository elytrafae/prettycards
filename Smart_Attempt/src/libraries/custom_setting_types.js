import { PrettyCards_plugin } from "./underscript_checker";

var settingTypes = {};

function registerSettingType(settingClass) {
    var instance = new settingClass();
    console.log(instance.name);
    settingTypes[instance.name] = instance;
    PrettyCards_plugin.settings().addType(instance);
    return instance;
}

function getSettingType(name) {
    var type = settingTypes[name];
    if (!type) {
        console.warn(`Custom Setting Type with name ${name} not found! Defaulting to boolean!`);
        type = "boolean";
    }
    return type;
}

class EditableList extends window.underscript.utils.SettingType {
    constructor() {
        super('EditableList');
    }

    addRow(parent, key = "", value = "") {
        var row = document.createElement("DIV");
        row.className = "PrettyCards_Settings_EditableListRow";

        var keyCell = document.createElement("DIV");
        var separatorCell = document.createElement("DIV");
        var valueCell = document.createElement("DIV");
        var deleteCell = document.createElement("DIV");

        var keyInput = document.createElement("INPUT");
        keyInput.type = "text";
        keyInput.className = "form-control";
        keyInput.value = key;
        keyCell.appendChild(keyInput);

        separatorCell.innerHTML = `<div style="width: 1.2em; text-align: center; user-select: none;">:</div>`;

        var valueInput = document.createElement("INPUT");
        valueInput.type = "text";
        valueInput.className = "form-control";
        valueInput.value = value;
        valueCell.appendChild(valueInput);

        var deleteButton = document.createElement("BUTTON");
        deleteButton.innerHTML = "Delete";
        deleteButton.className = "btn btn-danger";
        deleteCell.appendChild(deleteButton);

        row.appendChild(keyCell);
        row.appendChild(separatorCell);
        row.appendChild(valueCell);
        row.appendChild(deleteCell);

        parent.appendChild(row);
    }
    
    element(value, update, {
        data = undefined,
        remove = false,
        container,
        key = '',
    }) {
        console.log(data, remove, key);
        var myContainer = document.createElement("DIV");
        var table = document.createElement("DIV");
        table.className = "PrettyCards_Settings_EditableListTable";
        myContainer.appendChild(table);

        this.addRow(table, "key_test", "value_test");

        container[0].appendChild(myContainer);
        return document.createElement("DIV");
    }

    value(val, data = undefined) {
        if (typeof(val) === "object") {
            val = JSON.parse(val);
        }
        return val;
    }
    
    labelFirst() {
        return true;
    }
    
    styles() {
        return [
            ".PrettyCards_Settings_EditableListRow { display: flex; }",
            ".PrettyCards_Settings_EditableListRow div { padding: 0.2em; }",
            ".PrettyCards_Settings_EditableListRow input { padding: 3px 6px; height: 28px; }",
            ".PrettyCards_Settings_EditableListTable { width: 420px; border-bottom: 1px solid white; border-top: 1px solid white; margin: 2px 0 10px 0; padding: 10px 0; }",
            ".PrettyCards_Settings_EditableListTable button { padding: 3px 6px; }"
        ];
    }
}

registerSettingType(EditableList);

export {getSettingType};