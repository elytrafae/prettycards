import { PrettyCards_plugin } from "./underscript_checker";
import css from "../css/Settings.css";
import { loadCSS } from "./css_loader";
loadCSS(css);

var settingTypes = {};

function registerSettingType(settingClass) {
    var instance = new settingClass();
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

    areDupesPresent(key = "", parent) {
        var rows = parent.children;
        var count = 0;
        for (var i=0; i < rows.length; i++) {
            var row = rows[i];
            count += (row.firstChild.firstChild.value === key);
        }
        return count > 1;
    }

    addRow(parent, key = "", value = "", prepend = false, valueUpdate, updateFn) {
        var row = document.createElement("DIV");
        row.className = "PrettyCards_Settings_EditableListRow";

        var keyCell = document.createElement("DIV");
        var separatorCell = document.createElement("DIV");
        var valueCell = document.createElement("DIV");
        var deleteCell = document.createElement("DIV");

        var error_popup = document.createElement("DIV");

        var prev_key = key;
        var keyInput = document.createElement("INPUT");
        keyInput.type = "text";
        keyInput.className = "form-control";
        keyInput.value = key;
        keyInput.onblur = (e) => {
            if (this.areDupesPresent(keyInput.value, parent)) {
                error_popup.classList.remove("PrettyCards_Hidden");
                keyInput.value = prev_key;
                return;
            }
            delete valueUpdate[prev_key];
            valueUpdate[keyInput.value] = valueInput.value; 
            updateFn(valueUpdate); 
            prev_key = key;
        };
        keyInput.onfocus = (e) => {
            error_popup.classList.add("PrettyCards_Hidden");
        }
        keyCell.appendChild(keyInput);

        error_popup.innerHTML = "Duplicate keys are not allowed!";
        error_popup.className = "red PrettyCards_Hidden PrettyCards_Settings_EditableListText";
        keyCell.appendChild(error_popup);

        separatorCell.innerHTML = `<div style="width: 1.2em; text-align: center; user-select: none;">:</div>`;

        var valueInput = document.createElement("INPUT");
        valueInput.type = "text";
        valueInput.className = "form-control";
        valueInput.value = value;
        valueInput.onblur = () => {
            valueUpdate[keyInput.value] = valueInput.value; 
            updateFn(valueUpdate);
        };
        valueCell.appendChild(valueInput);

        var deleteButton = document.createElement("BUTTON");
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = () => {
            delete valueUpdate[keyInput.value];
            updateFn(valueUpdate);
            row.remove();
        }
        deleteButton.className = "btn btn-danger PrettyCards_Settings_EditableListTableButton";
        deleteCell.appendChild(deleteButton);

        row.appendChild(keyCell);
        row.appendChild(separatorCell);
        row.appendChild(valueCell);
        row.appendChild(deleteCell);

        if (prepend) {
            parent.prepend(row);
        } else {
            parent.appendChild(row);
        }
    }
    
    element(value, update, {
        data = undefined,
        remove = false,
        container,
        key = '',
    }) {
        var myValue = {...value};
        var myContainer = document.createElement("DIV");
        var table = document.createElement("DIV");
        table.className = "PrettyCards_Settings_EditableListTable";
        myContainer.appendChild(table);

        for (var key in myValue) {
            this.addRow(table, key, myValue[key], false, myValue, update);
        }

        container[0].appendChild(myContainer);

        var addButton = document.createElement("BUTTON");
        addButton.onclick = () => {this.addRow(table, "", "", true, myValue, update)};
        addButton.className = "btn btn-success PrettyCards_Settings_EditableListTableButton";
        addButton.innerHTML = "Add";
        return addButton;
    }

    default() {
        return {};
    }

    value(val, data = undefined) {
        if (typeof(val) !== "object") {
            val = JSON.parse(val);
        }
        return val;
    }
    
    labelFirst() {
        return true;
    }
    
    /*
    styles() {
        return [
            ".PrettyCards_Settings_EditableListRow { display: flex; }",
            ".PrettyCards_Settings_EditableListRow div { padding: 0.2em; }",
            ".PrettyCards_Settings_EditableListRow input { padding: 3px 6px; height: 28px; }",
            ".PrettyCards_Settings_EditableListTable { width: 420px; border-bottom: 1px solid white; border-top: 1px solid white; margin: 2px 0 10px 0; padding: 10px 0; }",
            ".PrettyCards_Settings_EditableListTableButton.btn { padding: 3px 6px; }",
            ".PrettyCards_Settings_EditableListText { font-size: 0.8em; }"
        ];
    }
    */
}

registerSettingType(EditableList);

export {getSettingType};