

var oldFn = window.BootstrapDialog.show;
window.BootstrapDialog.show = function() {
    var dialog = oldFn.apply(this, arguments);
    console.log("OPENED DIALOGUE", dialog);
    return dialog;
}