$(function() {
    var $diagramType = $("#diagramType");
    var $diagramText = $("#diagramText");
    var $diagramArea = $("#diagramArea");
    
    var $alertsArea = $("#alerts");

    var refreshDiagram = function() {
        try {
            //var diagramModel = parser.parse($diagramText.val(), "diagram");        
            // TODO: Handle parsing errors with sticky message showing errors
            var diagram = new uml2svg.UmlDiagram(
                                $diagramType.val(), 
                                {   width:640,
                                    height:480 });
            diagram.addParseErrorHandler(function(error) {
                addError("Line " + error.lineNumber + " : " + error.message);
            });
            diagram.init($diagramText.val());
            var svg = diagram.render();
            $diagramArea.html(svg);
            
        } catch(ignore) { }
    };

    $("#render").on("click", function() {
        refreshDiagram();
    });

    $diagramText.on("keyup", function(e) {
        if((e.keyCode || e.which) == 13) {
            refreshDiagram();    
        }
    });
    
    var addError = function(message) {
        $alertsArea.append(
            '<div class="alert alert-warning alert-dismissible" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
            message +
            '</div>');

    };
});
