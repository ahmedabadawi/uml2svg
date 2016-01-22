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
        that.diagramModel = diagramModel;

        if(that.init()) {

            var actorElements = that.renderActors();

            var diagramElements = 
                that.parent.renderSvg(diagramModel.id, 
                                     that.renderDefs(),  
                                     that.renderActors() + 
                                     that.renderMessages());
            
            return diagramElements;
        }
    };

    this.init = function() {
        if(that.validate()) {
            // Load default configurations
            that.options.sequenceDiagram = that.options.sequenceDiagram || { };
            (function(o) {
                if(!o.actorWidth) { o.actorWidth = 60; }
                if(!o.actorHeight) { o.actorHeight = 40; }
                if(!o.horizontalSpacing) { o.horizontalSpacing = 100; }
                if(!o.verticalSpacing) { o.verticalSpacing = 25; }
                if(!o.marginLeft) { o.marginLeft = 40; }
                if(!o.marginTop) { o.marginTop = 5; }
                if(!o.marginBottom) { o.marginBottom = o.marginTop; }
                if(!o.marginRight) { o.marginRight = o.marginLeft; }
            })(that.options.sequenceDiagram);

            that.diagramModel.actors.sort(function(a1, a2) { return a1.order - a2.order; });
            that.diagramModel.messages.sort(function(m1, m2) {  return m1.order - m2.order; });
            return true;
        }

        return false;
    };
    
    this.validate = function() {
        // TODO: validate the diagram model. No duplicate actors, No messages from
        // to unknown actors
        return true;
    };
    
    this.renderDefs = function() {
        var arrowMarker = that.parent.renderArrowMarker();
        var defs = that.parent.renderDefs(arrowMarker);
        
        return defs;
    };

    this.renderActors = function() {
        var actorElements;
        var actorWidth = that.options.sequenceDiagram.actorWidth; 
        var actorHeight = that.options.sequenceDiagram.actorHeight;
        var offsetY = that.options.sequenceDiagram.marginTop;
        var offsetX = that.options.sequenceDiagram.marginLeft;
        var horizontalSpacing = that.options.sequenceDiagram.horizontalSpacing;

        for(var i = 0; i < that.diagramModel.actors.length; i++) {
            actorElements  += 
                that.renderActor(that.diagramModel.actors[i],
                               actorWidth, actorHeight,
                                offsetX, offsetY);
            offsetX += horizontalSpacing;
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
        var textX = x + (width / 2);
        var actorUpperTitle = 
            that.parent.renderText(textX, upperY, width, height, actor.title);
        
        var actorLowerTitle = 
            that.parent.renderText(textX, lowerY, width, height, actor.title);
        
        // Attach the bounding box to the actor
        actor.box = {
            x: x,
            upperY: upperY,
            lowerY: lowerY,
            lifetimeLineX: lifetimeLineX
        };

        return actorUpperBox +
            actorUpperTitle +
            actorLowerBox + 
            actorLowerTitle +
            actorLifetimeLine;

    };
    
    this.renderMessages = function() {
        var messageElements;
        var offsetY = 
            that.options.sequenceDiagram.marginTop + 
            that.options.sequenceDiagram.actorHeight +
            that.options.sequenceDiagram.verticalSpacing; 
        var verticalSpacing = that.options.sequenceDiagram.verticalSpacing;

        for(var i = 0; i < that.diagramModel.messages.length; i++) {
            messageElements  += 
                that.renderMessage(that.diagramModel.messages[i],
                                   offsetY);
            offsetY += verticalSpacing;
            if(offsetY > (that.options.height - that.options.actorHeight - that.options.marginBottom)) {
                //TODO: Handle that the height is not enough
            }
        }

        return messageElements;
    };
    
    this.findActorByTitle = function(title) {
        for(var i = 0; i < that.diagramModel.actors.length; i++) {
            if(that.diagramModel.actors[i].title === title) {
                return that.diagramModel.actors[i];
            }
        }
        return null;
    };

    this.renderMessage = function(message, offsetY) {
        var callerActor = this.findActorByTitle(message.callerActor);
        var calleeActor = this.findActorByTitle(message.calleeActor);
        
        // Render the arrow
        var arrowStartX = callerActor.box.lifetimeLineX,
            arrowEndX = calleeActor.box.lifetimeLineX;
        var width = Math.abs(arrowStartX - arrowEndX);

        var arrowElement =
            that.parent.renderArrow(
                arrowStartX, offsetY, arrowEndX, offsetY,
                (message.type === 'response'));
        
        // Render the message text
        var textX = 
            (callerActor.box.lifetimeLineX < calleeActor.box.lifetimeLineX) ?
            callerActor.box.lifetimeLineX :
            calleeActor.box.lifetimeLineX;
        var textY = offsetY;
        textX += (width / 2);
        textY -= 5;     // HACK: move it to be over the line

        var textElement =
            that.parent.renderTextXY(
                textX, textY, message.message);
       
        return arrowElement + 
            textElement;
    };
    
    return {
        render: this.render
    };
};

