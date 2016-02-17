var uml2svg = uml2svg || {};        // Namespace
uml2svg.SvgHelper = function(options) {
    this.options = options || { };
    
    // Set the default options
    (function(o) {
        if(!o.fontSize) { o.fontSize = 12; }
        if(!o.fontFamily) { o.fontFamily = 'Verdana'; }
        if(!o.color) { o.color = 'black'; }
        if(!o.fillColor) { o.fillColor = 'white'; }
        if(!o.lineWidth) { o.lineWidth = 2; }
        if(!o.arrowHeadWidth) { o.arrowHeadWidth = 18; }
        if(!o.arrowHeadHeight) { o.arrowHeadHeight = 12; }
    })(this.options);
};


uml2svg.SvgHelper.prototype.renderSvg = function(id, defs, content) {
    var svgElement = 
        '<svg ' +
        'id="' + id + '" ' + 
        'width="' + this.options.width + '" height="' + this.options.height + '">' +
        defs +
        content +
        '</svg>';
    return svgElement;
};

uml2svg.SvgHelper.prototype.renderDefs = function(defs) {
    var defsElement = 
        '<defs>'+
        defs +
        '</defs>';

    return defsElement;
};

uml2svg.SvgHelper.prototype.renderArrowMarker = function() {
    var markerWidth = this.options.arrowHeadWidth / 2,
        markerHeight = this.options.arrowHeadHeight / 2,
        refx = markerWidth,
        refy = markerHeight / 2,
        point1 = { x: 0, y: 0 },
        point2 = { x: 0, y: markerHeight },
        point3 = { x: markerWidth, y: markerHeight / 2 };

    var arrowMarker = 
        '<marker id="arrow" '+
        'markerWidth="' + markerWidth + '" ' +
        'markerHeight="' + markerHeight + '" ' +
        'refx="' + refx + '" refy="' + refy + '" orient="auto">'+
        '<path d="' + 
        'M' + point1.x + ',' + point1.y +' ' +
        'L' + point2.x + ',' + point2.y +' ' +
        'L' + point3.x + ',' + point3.y + ' Z" ' + 
        'fill="' + this.options.color + '" />' +
        '</marker>';

    return arrowMarker;
};

uml2svg.SvgHelper.prototype.renderRect = function(x, y, width, height) {
    var rectElement = 
        '<rect x="' + x + '" y="' + y + '" ' +
            'width="' + width + '" height ="' + height +'" ' +
            'style="fill:' + this.options.fillColor + 
            ';stroke:' + this.options.color + 
            ';stroke-width:' + this.options.lineWidth + '" />';
    return rectElement;
};

uml2svg.SvgHelper.prototype.renderText = function(x, y, width, height, text) {
    var textX, textY;
    textX = x;
    textY = y + (height / 2);
    
    var textElement = 
        this.renderTextXY(textX, textY, text);
    return textElement;
};

uml2svg.SvgHelper.prototype.renderTextXY = function(x, y ,text) {
    var textElement = 
        '<text text-anchor="middle" fill="' + this.options.color + 
        '" font-size="' + this.options.fontSize + 
        '" font-family="' + this.options.fontFamily + '"' + 
        ' x="' + x + '" y="' + y + '">' + 
         text + 
        '</text>';
    return textElement;
};

uml2svg.SvgHelper.prototype.renderDashedVerticalLine = function(x, yStart, yEnd) {
    var lineElement = 
        '<line x1="'+ x + '" y1="' + yStart + '"' +
        ' x2="' + x + '" y2 ="' + yEnd + '"' +
        ' style="stroke:' + this.options.color + 
        ';stroke-width:' + this.options.lineWidth + 
        ';stroke-dasharray:5,5" />';
    return lineElement;
};

uml2svg.SvgHelper.prototype.renderArrow = function(x1, y1, x2, y2, dashed) {
    var arrowElement =         
        '<line x1="' + x1 + '" y1="' + y1 + 
        '" x2="' + x2 + '" y2="' + y2 + '" ' +
        'marker-end="url(#arrow)"' + 
        'style="stroke:' + this.options.color + 
        ';stroke-width:' + this.options.lineWidth + 
        ((dashed)?';stroke-dasharray:5,5': '') +
        '" />';
    return arrowElement;
};

