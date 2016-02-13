## UML2SVG.JS
A simple JavaScript library that generates SVG for UML. Convention-Based Extensibility for custom
diagram renderers. The library can be used on the client-side and on
server-side to generate the SVG representing the UML diagrams.
No runtime dependency on any other libraries.

### Build
In order to build uml2svg, you have to have grunt cli to generate the dist/
folder. The build is a two step, the first one to download and install the
development time dependencies and second to run grunt which takes care of
running various tasks; JS Hint, concatenate the source files into a single
distributable file and run the unit tests.

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
The library consists of two main parts; parsers and renderers. Parsers are
responsible for converting plain text written in a diagram specific grammar into
an object model understandable by the parser. Renderers are responsible for
generating SVG element containing all the graphics elements for a diagram
specified by the diagram model. Following is a simple code that invokes the
parser and the renderer, assuming the diagramType is a valid diagram processor,
for example *SequenceDiagram*, the diagramText denotes the text valid for the
    diagram grammar and the options are the defined options for the diagram. A
    separate section for the options, see below.

```javascript
var parser = new uml2svg.parser['diagramType']();
var diagramModel = parser.parse('diagramText', svgElementId);
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

### Diagram Model
The sequence diagram supports a model that represents the id of the SVG element,
the actors and messages. The actors list contains the actors and their order
and stereotype within the diagram. The messages list contain the messages and
their order and related actors (caller and callee) and whether the message is a
request or a response.

```javascript
{ 
    "id": "// represents the generated SVG HTML element Id",
    "actors": [
        // List of actors (objects / classes / general actors)
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
            "callerActor": "// name/title of the caller or requester actor",
            "calleeActor": "// name/title of the callee actor",
            "type": " // call/return also can be request/response. The call or
            request are represented by a solid line while return or response are
            represented by a dashed line. When omitted the default is request",
            "note": " // the note attached to the request / response"
        }
    ]
}
```

### Text Grammar
The sequence diagrams support simple grammar to represent the diagram. Each line
contains a message by a caller to a callee and the message can either be a
request or response by using the direction -> or <- respectively.

*Caller*  (*<-* | *->*)  *Callee* : *Message*


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
- The sequence diagram parser is case sensitive, where Object A is not the same
  as Object a

### Ideas and New Features
- [X] Merge the parser into the uml2svg.Uml2svg class to encapsulate the parsing and
  rendering behind the same interface
- [ ] Expose the diagram model to the client
- [ ] Allow attaching events tp the diagram model
- [X] Expose parsing errors and warnings (line#, line text, and error/warning)
- [ ] Sample App - Add clear functionality
- [X] Sample App - Show parsing errors and warnings
- [ ] Add support for Self-Call message
- [ ] Attach rendering properties to diagram model, such as width and height
- [ ] Allow changing rendering properties to reflect on the diagram
- [ ] Sample App - Add functionality to update rendering properties
- [ ] Client side library to handle diagram updates after rendering
- [ ] Actor stereotypes display in the diagram
- [ ] Add the notes to the rendering of the actors and messages

