var uml2svg = uml2svg || {};

uml2svg.parser = uml2svg.parser || {};

// SequenceDiagramParser class is responsible for parsing sequence diagram in
// textual format into diagram model usable by the sequence diagram renderer
// ex:
// Object A->Object B: Message
// Object B->Object C: Message
// Object C-->Object B: Response
// Object B-->Object A: Response
uml2svg.parser.SequenceDiagram = function(parent, options) {
    this.options = options;
    this.parent = parent;
};

uml2svg.parser.SequenceDiagram.prototype.parse = function(diagramText, id) {
    var diagramModel = {};
    
    var actors = [],
        lastActorIndex = 0;
    var messages = [],
        lastMessageIndex = 0;

    var handleActor = function(actorTitle) {
        for(var i = 0; i < actors.length; i++) {
            if(actors[i].title === actorTitle) {
                return;
            }
        }
        //if(!actors.any(function(thisActor) { return thisActor.title === actorTitle; })) {
        actors.push( {
            title: actorTitle,
            order: lastActorIndex++
        });
    };
    
    var handleMessage = function(messageTitle, actor1, direction, actor2) {
        // TODO: Handle self call, for now fail with an error
        if(actor1 === actor2) {
            throw new Error("Self-Call is not supported");
        }

        messages.push( {
            title: messageTitle,
            order: lastMessageIndex++,
            callerActor: actor1,
            calleeActor: actor2,
            type: (direction === '->' ? 'request' : 'response')
        });
    };
    if(this.parseEntries(diagramText, handleActor, handleMessage)) {
        diagramModel.id = id;
        diagramModel.actors = actors;
        diagramModel.messages = messages;

        return diagramModel;
    }
    return false;
};

uml2svg.parser.SequenceDiagram.prototype.parseEntries = 
    function(diagramText, handleActor, handleMessage) {
    
    var lines = diagramText.match(/[^\r\n]+/g);
    for(var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var modelEntry = this.parseLine(line, handleActor, handleMessage);
        if(!modelEntry) {
            // TODO: throw error that the line is invalid
            return false;
        }
    }

    return true;
};

uml2svg.parser.SequenceDiagram.prototype.parseLine = 
    function(line, handleActor, handleMessage) {
    
    var lineParts = line.split(/\s*(:|->|<-)\s*/);
    // TODO: Handle trimming the parts with the regexp directly
    if(this.validateLineParts(lineParts)) {
        var entry = {};
        
        // 0: Actor 1
        entry.actor1 = lineParts[0].trim();
        // 1: Message Direction
        entry.direction = lineParts[1].trim();
        // 2: Actor 2
        entry.actor2 = lineParts[2].trim();
        // 3: Message Separator - No Need to Capture It
        // 4: Message
        entry.message = lineParts[4].trim();
    
        if(handleActor && handleMessage) { 
            handleActor(entry.actor1);
            handleActor(entry.actor2);
        
            handleMessage(
                        entry.message, 
                        entry.actor1,
                        entry.direction,
                        entry.actor2);
        }

        return entry;
    }
    return null;
};

uml2svg.parser.SequenceDiagram.prototype.validateLineParts = 
    function (lineParts) {
    
    var objectPattern = /^[\w]+/;
    var messagePattern = /^[\w]+/;
    var directionPattern = /(->|<-)/;

    // Validate line parts
    return  lineParts !== null && 
            lineParts.length == 5 &&
            lineParts[0] !== null && objectPattern.test(lineParts[0].trim()) &&
            lineParts[1] !== null && directionPattern.test(lineParts[1].trim()) && 
            lineParts[2] !== null && objectPattern.test(lineParts[2].trim()) &&
            lineParts[3] !== null && lineParts[3] === ':' &&
            lineParts[4] !== null && messagePattern.test(lineParts[4].trim());
};

/*
                {
                    "id": "diagram1",
                    "actors": [
                        {
                            "order": "1",
                            "title": "User",
                            "stereotype": "Actor"
                        },
                        {
                            "order": "2",
                            "title": "UI"
                        },
                        {
                            "order": "4",
                            "title": "DB"
                        },
                        {
                            "order": "3",
                            "title": "Cache"
                        },
                        {
                            "order": "5",
                            "title": "Payment"
                        },
                        {
                            "order": "6",
                            "title": "Shipping"
                        }
                    ],
                    "messages": [
                        {
                            "order": "1",
                            "message": "Place Order",
                            "callerActor": "User",
                            "calleeActor": "UI"
                        },
                        {
                            "order": "3",
                            "message": "Check",
                            "callerActor": "UI",
                            "calleeActor": "Cache"
                        },
                        {
                            "order": "4",
                            "message": "Process Payment",
                            "callerActor": "UI",
                            "calleeActor": "Payment"
                        },
                        {
                            "order": "5",
                            "message": "Authorization",
                            "callerActor": "UI",
                            "calleeActor": "Payment",
                            "type": "response"
                        },
                        {
                            "order": "6",
                            "message": "Schedule Shipment",
                            "callerActor": "UI",
                            "calleeActor": "Shipping"
                        },
                        {
                            "order": "7",
                            "message": "Delivery Time",
                            "callerActor": "Shipping",
                            "calleeActor": "UI",
                            "type": "response"
                        },
                        {
                            "order": "8",
                            "message": "Save Order",
                            "callerActor": "UI",
                            "calleeActor": "DB"
                        },
                        {
                            "order": "9",
                            "message": "Confirmation",
                            "callerActor": "UI",
                            "calleeActor": "User",
                            "type": "response"
                        }
                    ]
                }


*/
