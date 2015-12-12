var uml2svg = uml2svg || {};        // Namespace

// Uml2svg: class responsible for instantiating the correct digram renderer and
// according to the diagramType parameter in the format of uml2svg-<diagramType> for example diagram type "sequencediagram" inistantiates the uml2svg-sequencediagram renderer. Provides a proxy to the selected renderer
// options define the width and height of the target svg to be used by the
// renderer
uml2svg.Uml2svg = function(diagramType, options) {
    this.options = options;
    this.renderer = new uml2svg.renderer[diagramType](this, options);
    if(!this.renderer) {
        throw "Undefined Diagram Type";
    }
};

uml2svg.Uml2svg.prototype.render = function(diagramModel) {
    return this.renderer.render(diagramModel);
};
