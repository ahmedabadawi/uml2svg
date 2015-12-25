var uml2svg = uml2svg || {};

uml2svg.renderer = uml2svg.renderer || {};

// sequencediagram class is a singleton defined on the namespace of
// uml2svg.renderer to be used by the Uml2svg class proxy to generate the SVG
// element 
uml2svg.renderer.SequenceDiagram = function(parent, options) {
    var that = this;
    this.options = options;
    this.parent = parent;

    this.render = function(diagramModel) {
        if(that.init(diagramModel)) {

            var actorElements = that.renderActors(diagramModel);

            var diagramElements = 
                that.parent.renderSvg(diagramModel.id, 
                                     that.renderDefs(),  
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
    
    this.renderDefs = function() {
        var arrowMarker = that.parent.renderArrowMarker();
        var defs = that.parent.renderDefs(arrowMarker);
        
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
            that.parent.renderRect(x, upperY, width, height);
        
        // Render actor lower box
        var actorLowerBox = 
            that.parent.renderRect(x, lowerY, width, height);
        
        // Render actor lifetime line
        var lifetimeLineX = offsetX;
        var lifetimeLineYStart = offsetY + height;
        var lifetimeLineYEnd = lowerY;

        var actorLifetimeLine = 
            that.parent.renderDashedVerticalLine(
                lifetimeLineX, lifetimeLineYStart, lifetimeLineYEnd);
        
        // Render actor title
        var actorUpperTitle = 
            that.parent.renderText(x, upperY, width, height, actor.title);
        
        var actorLowerTitle = 
            that.parent.renderText(x, lowerY, width, height, actor.title);
        
        return actorUpperBox +
            actorUpperTitle +
            actorLowerBox + 
            actorLowerTitle +
            actorLifetimeLine;

    };

    return {
        render: this.render
    };
};

