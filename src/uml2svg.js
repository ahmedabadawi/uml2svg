var uml2svg = uml2svg || {};        // Namespace

// Uml2svg: class responsible for instantiating the correct digram renderer and
// according to the diagramType parameter in the format of uml2svg-<diagramType> for example diagram type "sequencediagram" inistantiates the uml2svg-sequencediagram renderer. Provides a proxy to the selected renderer
// options define the width and height of the target svg to be used by the
// renderer
uml2svg.Uml2svg = function(diagramType, options) {
    this.options = options || { };
    // Set the default options
    (function(o) {
        if(!o.fontSize) { o.fontSize = 12; }
        if(!o.fontFamily) { o.fontFamily = 'Verdana'; }
        if(!o.color) { o.color = 'black'; }
        if(!o.fillColor) { o.fillColor = 'white'; }
        if(!o.lineWidth) { o.lineWidth = 2; }
    })(this.options);

    this.renderer = new uml2svg.renderer[diagramType](this, options);
    if(!this.renderer) {
        throw "Undefined Diagram Type";
    }
};

uml2svg.Uml2svg.prototype.render = function(diagramModel) {
    return this.renderer.render(diagramModel);
};

uml2svg.Uml2svg.prototype.renderSvg = function(id, defs, content) {
    var svgElement = 
        '<svg ' +
        'id="' + id + '"' + 
        'width="' + this.options.width + '" height="' + this.options.height + '">' +
        defs +
        content +
        '</svg>';
    return svgElement;
};

uml2svg.Uml2svg.prototype.renderDefs = function(defs) {
    var defsElement = 
        '<defs>'+
        defs +
        '</defs>';

    return defsElement;
};

uml2svg.Uml2svg.prototype.renderArrowMarker = function() {
    var arrowMarker = 
        '<marker id="arrow" markerWidth="10" markerHeight="10" refx="0" refy="3" orient = "auto">'+
        '<path d="M0,0 L0,6 L9,' + this.options.lineWidth + ' z" ' + 
        'fill="' + this.options.Color + '" />' +
        '</marker>';

    return arrowMarker;
};

uml2svg.Uml2svg.prototype.renderRect = function(x, y, width, height) {
    var rectElement = 
        '<rect x="' + x + '" y="' + y + '"' +
            ' width="' + width + '" height ="' + height +'"' +
            ' style="fill:' + this.options.fillColor + 
            '; stroke:' + this.options.color + 
            ';stroke-width:' + this.options.lineWidth + '" />';
    return rectElement;
};

uml2svg.Uml2svg.prototype.renderText = function(x, y, width, height, text) {
    var textX, textY;
    textX = x + 5;
    textY = y + (height / 2);
    var textElement = 
        '<text fill="' + this.options.color + 
        '" font-size="' + this.options.fontSize + 
        '" font-family="' + this.options.fontFamily + '"' + 
        ' x="' + textX + '" y="' + textY + '">' + 
         text + 
        '</text>';
    return textElement;
};

uml2svg.Uml2svg.prototype.renderDashedVerticalLine = function(x, yStart, yEnd) {
    var lineElement = 
        '<line x1="'+ x + '" y1="' + yStart + '"' +
        ' x2="' + x + '" y2 ="' + yEnd + '"' +
        ' style="stroke:' + this.options.color + 
        ';stroke-width:' + this.options.lineWidth + 
        ';stroke-dasharray:5,5" />';
    return lineElement;
};
