var uml2svg = uml2svg || {};

uml2svg.renderer = uml2svg.renderer || {};

// sequencediagram class is a singleton defined on the namespace of
// uml2svg.renderer to be used by the Uml2svg class proxy to generate the SVG
// element 
uml2svg.renderer.SequenceDiagram = function(parent, options) {
    this.options = options;
    this.parent = parent;

};

uml2svg.renderer.SequenceDiagram.prototype.render = function(diagramModel) {
    this.diagramModel = diagramModel;

    if(this.init()) {
        var actorElements = this.renderActors();

        var diagramElements = 
            this.parent.renderSvg(diagramModel.id, 
                                this.renderDefs(),  
                                this.renderActors() + 
                                this.renderMessages());
            
        return diagramElements;
    }
};

uml2svg.renderer.SequenceDiagram.prototype.init = function() {
    if(this.validate()) {
        // Load default configurations
        this.options.sequenceDiagram = this.options.sequenceDiagram || { };
        (function(o) {
            if(!o.actorWidth) { o.actorWidth = 60; }
            if(!o.actorHeight) { o.actorHeight = 40; }
            if(!o.horizontalSpacing) { o.horizontalSpacing = 100; }
            if(!o.verticalSpacing) { o.verticalSpacing = 25; }
            if(!o.marginLeft) { o.marginLeft = 40; }
            if(!o.marginTop) { o.marginTop = 5; }
            if(!o.marginBottom) { o.marginBottom = o.marginTop; }
            if(!o.marginRight) { o.marginRight = o.marginLeft; }
        })(this.options.sequenceDiagram);

        this.diagramModel.actors.sort(function(a1, a2) { return a1.order - a2.order; });
        this.diagramModel.messages.sort(function(m1, m2) {  return m1.order - m2.order; });
        
        return true;
    }

    return false;
};
    
uml2svg.renderer.SequenceDiagram.prototype.validate = function() {
    // TODO: validate the diagram model. No duplicate actors, No messages from
    // to unknown actors
    return true;
};
    
uml2svg.renderer.SequenceDiagram.prototype.renderDefs = function() {
    var arrowMarker = this.parent.renderArrowMarker();
    var defs = this.parent.renderDefs(arrowMarker);
        
    return defs;
};

uml2svg.renderer.SequenceDiagram.prototype.renderActors = function() {
    var actorElements;
    var actorWidth = this.options.sequenceDiagram.actorWidth; 
    var actorHeight = this.options.sequenceDiagram.actorHeight;
    var offsetY = this.options.sequenceDiagram.marginTop;
    var offsetX = this.options.sequenceDiagram.marginLeft;
    var horizontalSpacing = this.options.sequenceDiagram.horizontalSpacing;

    for(var i = 0; i < this.diagramModel.actors.length; i++) {
        actorElements  += 
            this.renderActor(this.diagramModel.actors[i],
                            actorWidth, actorHeight,
                            offsetX, offsetY);
        offsetX += horizontalSpacing;
    }

    return actorElements;
};

uml2svg.renderer.SequenceDiagram.prototype.renderActor = 
    function(actor, width, height, offsetX, offsetY) {
    
    var x = offsetX - (width / 2);
    var upperY = offsetY;
    var lowerY = this.options.height - offsetY - height;

    // Render actor upper box
    var actorUpperBox =
        this.parent.renderRect(x, upperY, width, height);
        
    // Render actor lower box
    var actorLowerBox = 
        this.parent.renderRect(x, lowerY, width, height);
        
    // Render actor lifetime line
    var lifetimeLineX = offsetX;
    var lifetimeLineYStart = offsetY + height;
    var lifetimeLineYEnd = lowerY;

    var actorLifetimeLine = 
        this.parent.renderDashedVerticalLine(
            lifetimeLineX, lifetimeLineYStart, lifetimeLineYEnd);
        
    // Render actor title
    var textX = x + (width / 2);
    var actorUpperTitle = 
        this.parent.renderText(textX, upperY, width, height, actor.title);
        
    var actorLowerTitle = 
        this.parent.renderText(textX, lowerY, width, height, actor.title);
        
    // Attach the bounding box to the actor
    actor.box = {
        x: x,
        upperY: upperY,
        lowerY: lowerY,
        lifetimeLineX: lifetimeLineX
    };

    return  actorUpperBox +
            actorUpperTitle +
            actorLowerBox + 
            actorLowerTitle +
            actorLifetimeLine;
};
    
uml2svg.renderer.SequenceDiagram.prototype.renderMessages = function() {
    var messageElements;
    var offsetY = 
        this.options.sequenceDiagram.marginTop + 
        this.options.sequenceDiagram.actorHeight +
        this.options.sequenceDiagram.verticalSpacing; 
    var verticalSpacing = this.options.sequenceDiagram.verticalSpacing;

    for(var i = 0; i < this.diagramModel.messages.length; i++) {
        messageElements  += 
            this.renderMessage(this.diagramModel.messages[i],
                                   offsetY);
        offsetY += verticalSpacing;
        if(offsetY > (this.options.height - this.options.actorHeight - this.options.marginBottom)) {
            //TODO: Handle this.the height is not enough
        }
    }

    return messageElements;
};
    
uml2svg.renderer.SequenceDiagram.prototype.findActorByTitle = function(title) {
    for(var i = 0; i < this.diagramModel.actors.length; i++) {
        if(this.diagramModel.actors[i].title === title) {
            return this.diagramModel.actors[i];
        }
    }
    
    return null;
};

uml2svg.renderer.SequenceDiagram.prototype.renderMessage = function(message, offsetY) {
    var callerActor = this.findActorByTitle(message.callerActor);
    var calleeActor = this.findActorByTitle(message.calleeActor);
        
    // Render the arrow
    var arrowStartX = callerActor.box.lifetimeLineX,
        arrowEndX = calleeActor.box.lifetimeLineX;
    var width = Math.abs(arrowStartX - arrowEndX);

    var arrowElement =
        this.parent.renderArrow(
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
        this.parent.renderTextXY(
            textX, textY, message.message);
       
    return arrowElement + 
        textElement;
};
    

