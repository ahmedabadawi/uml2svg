## UML2SVG.JS
A simple JavaScript library that generates SVG for UML. Convention-Based Extensiblity for custom
diagram renderers. The library can be used on the client-side and on
server-side to generate the SVG representing the UML diagrams.
No runtime dependency on any other libraries.

### Build
In order to build uml2svg, you have to have grunt cli to generate the dist/
folder
```shell
npm install
grunt
```

Also there is a target in the grunt for development that continuously watches
the javascript files and run the grunt tasks, this can be invoked by
```shell
grunt development
```

### Usage

```javascript
var parser = new uml2svg.parser['diagramType']();
var diagramModel = parser.parse('diagramText');
var renderer = new uml2svg.Uml2svg('diagramType', options);
var svg = renderer.render(diagramModel);
// use the svg to inject it into the DOM
```

#### Options
Options are passed to the root  Uml2svg constructor, that sets the main options
such as font-size, colors, etc. and pass the object to the diagram renderer to
extract its own options. Following are the main options
- fontSize: Specifies the font size for all text rendered in the diagram
  (default 12)
- fontFamily: Specifies the font family for all text rendered in the diagram
  (default Verdana)
- color: Specifies the color of the diagram text (default black)
- fillColor: specifies the background color for diagram elements (default white)
- lineWidth: specifies the width of the draw lines (default 2px)
- arrowHeadWidth: specifies the width of the arrow heads (default 18px)
- arrowHeadHeight: specifies the height of the arrow heads (default 12px)

### Sequence Diagrams
Builds SVG for Sequence Diagram based on model JS objects containing the diagram
details.
#### Options
The sequence diagram renderer extracts its specific options under the main
options sequenceDiagram object. Following are the sequence diagram options
- actorWidth: Specifies the width of the actor box (default 60px)
- actorHeight: Specifies the height of the actor box (default 40px)
- horizontalSpacing: specifies the horizontal space between diagram actors
  (default 100px)
- verticalSpacing: specifies the vertical space between diagram messages
  (default 25px)
- marginLeft: specifies the left margin of the diagram elements (default 40px)
- marginTop: specifies the top margin of the diagram elements (default 5px)
- marginBottom: specifies the bottom margin of the diagram elements (default 5px)
- marginRight: specifies the right margin of the diagram elements (default 40px)

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

Supports simple parsing from plain text into a diagram

Sample diagram in plain text
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
Object A->Object B: Message
Object B->Object C: Check Something
Object C<-Object B: Success
Object B<-A: Response
```
### Class Diagrams
[TODO]


### Known Issues
- The minified version of the library is not working properly
- The rendering is based on fixed sizes, and would overflow if the actor titles
  are long
- Incorrect syntax for the parser will only stop the rendering but will not
  report the exact errors

### Ideas and New Features
- Merge the parser into the uml2svg.Uml2svg class to encapsulate the parsing and
  rendering behind the same interface
- Client side library to handle diagram updates after rendering
