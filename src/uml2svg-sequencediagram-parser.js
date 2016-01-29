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
    var actors = parseActors(diagramText);
    var messages = parseMessages(diagramText);
    
    diagramModel.id = id;
    diagramModel.actors = actors;
    diagramModel.messages = messages;

    return diagramModel;
};

uml2svg.parser.SequenceDiagram.prototype.parseActors = function(diagramText) {
    var actors = [];

    return actors;
};

uml2svg.parser.SequenceDiagram.prototype.parseMessages = function(diagramText) {
    var messages = [];

    return messages;
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
