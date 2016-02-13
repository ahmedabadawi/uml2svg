var uml2svg = uml2svg || {};        // Namespace

// Uml2svg: class responsible for instantiating the correct digram renderer and
// parser according to the diagramType parameter in the format of uml2svg-<diagramType> for example diagram type "sequencediagram" inistantiates the uml2svg-sequencediagram renderer. Provides a proxy to the selected renderer
// options define the width and height of the target svg to be used by the
// renderer
uml2svg.Uml2svg = function(diagramType, options) {
    this.diagramType = diagramType;

    this.parseErrorHandlers = [];
    
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

uml2svg.Uml2svg.prototype.init = function(input) {
    var that = this;    // save the ref
    if(!input) {
        throw new Error("Input cannot be null.");
    }
    
    this.inputType = (typeof input === "string") ? "text" : "model";
    
    this.renderer = new uml2svg.renderer[this.diagramType](this, this.options);
    if(!this.renderer) {
        throw new Error("Undefined Diagram Type or renderer is not defined.");
    }
    
    if(this.inputType === "text") { // If the input is not text, no need to have a parser
        this.parser = 
            new uml2svg.parser[this.diagramType](
                function(error) { 
                    if(that.parseErrorHandlers) {
                        for(var i = 0; i < that.parseErrorHandlers.length; i++) { 
                            that.parseErrorHandlers[i](error); } 
                        }
                    });

        if(!this.parser) {
            throw new Error("Undefined Diagram Type or parser is not defined.");
        }

        this.diagramModel = this.parser.parse(input);
    } else {
        if(this.renderer.validate(input)) {
            this.diagramModel = input;
        } else {
            throw new Error("Diagram Model is invalid.");
        }
    }

    this.initialized = true;
};

uml2svg.Uml2svg.prototype.render = function() {
    if(!this.initialized) throw new Error("Diagram is not initialized");

    return this.renderer.render(this.diagramModel);
};

uml2svg.Uml2svg.prototype.addParseErrorHandler = function(handler) {
    if(handler) this.parseErrorHandlers.push(handler);
};

uml2svg.Uml2svg.prototype.renderSvg = function(id, defs, content) {
    var svgElement = 
        '<svg ' +
        'id="' + id + '" ' + 
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

uml2svg.Uml2svg.prototype.renderRect = function(x, y, width, height) {
    var rectElement = 
        '<rect x="' + x + '" y="' + y + '" ' +
            'width="' + width + '" height ="' + height +'" ' +
            'style="fill:' + this.options.fillColor + 
            ';stroke:' + this.options.color + 
            ';stroke-width:' + this.options.lineWidth + '" />';
    return rectElement;
};

uml2svg.Uml2svg.prototype.renderText = function(x, y, width, height, text) {
    var textX, textY;
    textX = x;
    textY = y + (height / 2);
    
    var textElement = 
        this.renderTextXY(textX, textY, text);
    return textElement;
};

uml2svg.Uml2svg.prototype.renderTextXY = function(x, y ,text) {
    var textElement = 
        '<text text-anchor="middle" fill="' + this.options.color + 
        '" font-size="' + this.options.fontSize + 
        '" font-family="' + this.options.fontFamily + '"' + 
        ' x="' + x + '" y="' + y + '">' + 
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

uml2svg.Uml2svg.prototype.renderArrow = function(x1, y1, x2, y2, dashed) {
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
