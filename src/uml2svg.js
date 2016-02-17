var uml2svg = uml2svg || {};        // Namespace

// Uml2svg: class responsible for instantiating the correct digram renderer and
// parser according to the diagramType parameter in the format of uml2svg-<diagramType> for example diagram type "sequencediagram" inistantiates the uml2svg-sequencediagram renderer. Provides a proxy to the selected renderer
// options define the width and height of the target svg to be used by the
// renderer
uml2svg.Uml2svg = function(diagramType, options) {
    this.diagramType = diagramType;

    this.parseErrorHandlers = [];
    
    this.options = options || { };

    this.svgHelper = new uml2svg.SvgHelper(this.options);
};

uml2svg.Uml2svg.prototype.init = function(input) {
    var that = this;    // save the ref
    if(!input) {
        throw new Error("Input cannot be null.");
    }
    
    this.inputType = (typeof input === "string") ? "text" : "model";
    
    this.renderer = new uml2svg.renderer[this.diagramType](this.svgHelper, this.options);
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


