var uml2svg = uml2svg || {};

uml2svg.renderer = uml2svg.renderer || {};

// sequencediagram class is a singleton defined on the namespace of
// uml2svg.renderer to be used by the Uml2svg class proxy to generate the SVG
// element 
uml2svg.renderer.sequencediagram = function() {
    var that = this;

    this.render = function(diagramModel, options) {
        that.options = options;
        if(that.init(diagramModel)) {

            var actorElements = that.renderActors(diagramModel);

            var diagramElements = 
                that.renderSvgElement(diagramModel.id, 
                                     that.renderDefs() + 
                                     that.renderActors(diagramModel));
            
            return diagramElements;
        }
    };

    this.init = function(diagramModel) {
        if(that.validate(diagramModel)) {
            diagramModel.actors.sort(function(a1, a2) { return a1.order - a2.order; });
            diagramModel.messages.sort(function(m1, m2) {  return m1.order - m2.order; });
            return true;
        }

        return false;
    };
    
    this.validate = function(diagramModel) {
        // TODO: validate the diagram model. No duplicate actors, No messages from
        // to unknown actors
        return true;
    };
    
    this.renderSvgElement = function(id, content) {
        var svgElement = 
            '<svg ' +
            'id="' + id + '"' + 
            'width="' + that.options.width + '" height="' + that.options.height + '">' +
            content +
            '</svg>';
        return svgElement;
    };

    this.renderDefs = function() {
        var arrowMarker = 
            '<marker id="arrow" markerWidth="10" markerHeight="10" refx="0" refy="3" orient = "auto">'+
            '<path d="M0,0 L0,6 L9,3 z" fill="black" />' +
            '</marker>';

        var defs = 
            '<defs>'+
            arrowMarker +
            '</defs>';

        return defs;
    };

    this.renderActors = function(diagramModel) {
        var actorElements;
        var actorWidth = 60;
        var actorHeight = 40;
        var offsetY = 0;
        var offsetX = 50;
        var gapX = 100;

        for(var i = 0; i < diagramModel.actors.length; i++) {
            actorElements  += 
                that.renderActor(diagramModel.actors[i],
                               actorWidth, actorHeight,
                                offsetX, offsetY);
            offsetX += gapX;
        }

        return actorElements;
    };

    this.renderActor = function(actor, width, height, offsetX, offsetY) {
        var x = offsetX - (width / 2);
        var upperY = offsetY;
        var lowerY = that.options.height - offsetY - height;

        // Render actor upper box
        var actorUpperBox = 
            '<rect x="' + x + '" y="' + upperY + '"' +
            ' width="' + width + '" height ="' + height +'"' +
            ' style="fill:white; stroke:black;stroke-width:2" />';
        
        // Render actor lower box
        var actorLowerBox = 
            '<rect x="' + x + '" y="' + lowerY + '"' +
            ' width="' + width + '" height ="' + height +'"' +
            ' style="fill:white; stroke:black;stroke-width:2" />';
        
        // Render actor lifetime line
        var lifetimeLineX = offsetX;
        var lifetimeLineYStart = offsetY + height;
        var lifetimeLineYEnd = lowerY;

        var actorLifetimeLine = 
            '<line x1="'+ lifetimeLineX + '" y1="' + lifetimeLineYStart + '"' +
            ' x2="' + lifetimeLineX + '" y2 ="' + lifetimeLineYEnd + '"' +
            ' style="stroke:black;stroke-width:2;stroke-dasharray:5,5" />';

        // Render actor title
        var actorTitleX = x;
        var actorUpperTitleY = upperY + (height / 2); 
        var actorLowerTitleY = lowerY + (height / 2);
        var actorUpperTitle = 
            '<text fill="black" font-size-"12" font-family="Verdana"' + 
            ' x="' + actorTitleX + '" y="' + actorUpperTitleY + '">' + 
            actor.title + 
            '</text>';
        
        var actorLowerTitle = 
            '<text fill="black" font-size-"12" font-family="Verdana"' + 
            ' x="' + actorTitleX + '" y="' + actorLowerTitleY + '">' + 
            actor.title + 
            '</text>';
        
        return actorUpperBox +
            actorUpperTitle +
            actorLowerBox + 
            actorLowerTitle +
            actorLifetimeLine;

    };

    return {
        render: this.render
    };
}();

