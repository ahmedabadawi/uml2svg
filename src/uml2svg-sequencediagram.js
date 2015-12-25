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
                                     that.renderActors(diagramModel) + 
                                     that.renderMessages(diagramModel));
            
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
        var actorWidth = 60;    // TODO: Externalize in configurable options 
        var actorHeight = 40;   // TODO: Externalize in configurable options 
        var offsetY = 0;
        var offsetX = 50;      // TODO: Externalize in configurable options 
        var gapX = 100;    // TODO: Externalize in configurable options 

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
    
    this.renderMessages = function(diagramModel) {
        var messageElements;
        var offsetY = 60;  // TODO: Externalize in configurable options 
        var gapY = 25;     // TODO: Externalize in configurable options

        for(var i = 0; i < diagramModel.messages.length; i++) {
            messageElements  += 
                that.renderMessage(diagramModel.messages[i],
                                   diagramModel.actors,
                                   offsetY);
            offsetY += gapY;
            if(offsetY > (that.options.height - 60)) {
                //TODO: Handle that the height is not enough
            }
        }

        return messageElements;
    };
    
    this.findActorByTitle = function(title, actors) {
        for(var i = 0; i < actors.length; i++) {
            if(actors[i].title === title) {
                return actors[i];
            }
        }
        return null;
    };

    this.renderMessage = function(message, actors, offsetY) {
        var callerActor = this.findActorByTitle(message.callerActor, actors);
        var calleeActor = this.findActorByTitle(message.calleeActor, actors);
        
        // Render the arrow
        var arrowStartX = callerActor.box.lifetimeLineX,
            arrowEndX = calleeActor.box.lifetimeLineX;
        if(arrowStartX < arrowEndX) {
            arrowEndX -= 13; // TODO: Externalize in configurable options 
        } else {
            arrowEndX += 13;
        }

        var arrowElement =
            that.parent.renderArrow(
                arrowStartX, offsetY, arrowEndX, offsetY,
                (message.type === 'response'));
        
        // Render the message text
        // TODO: Center the message text
        var textX = 
            (callerActor.box.lifetimeLineX < calleeActor.box.lifetimeLineX) ?
            callerActor.box.lifetimeLineX :
            calleeActor.box.lifetimeLineX;
        var textY = 
            offsetY;
        textX += 10;        // TODO: Externalize in configurable options 
        textY -= 5;         // TODO: Externalize in configurable options
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

