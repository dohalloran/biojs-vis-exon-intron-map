var ei = require('./biojs-vis-exon-intron-map');
var d3 = require("d3");

var app = function (button) {
    button.addEventListener("click", function () {
        ei.render();
    });
}

module.exports = app;
