## UML2SVG.JS
A simple JavaScript library that generates SVG for UML. Extensible for custom
digram renderers.

### Sequence Diagrams
Builds SVG for Sequence Diagram based on model JS objects containing the diagram
details.

Sample model
~~~~~~~~~~~~
{ 
    "id": "// represents the generated SVG HTML element Id",
    "actors": [
        // List of actos (objects / classes / general actors)
        {
            "order": "// Numeric order of the actor",
            "title": "// actor title to be displayed in the diagram",
            "stereotype": "actor stereotype displayed in << stereotype >>",
            "note": "// the note attached to the actor"
            }
    ],
    "messages": [
        // List of messages between actors
        {
            "order": "// Numeric order of the message",
            "message": "// title of the message call (displayed over the arrow)",
            "callerActor": "// name/title of the caller or requestor actor",
            "caleeActor": "// name/title of the calee actor",
            "type": " // call/return also can be request/response. The call or
            request are represented by a solid line while return or response are
            represented by a dashed line. When omitted the default is request",
            note: " // the note attached to the request / response"
        }
    ]
}


### Class Diagrams
