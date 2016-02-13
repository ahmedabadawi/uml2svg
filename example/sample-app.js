$(function() {
    var $diagramType = $("#diagramType");
    var $diagramText = $("#diagramText");
    var $diagramArea = $("#diagramArea");
    


    var refreshDiagram = function() {
        try {
            //var diagramModel = parser.parse($diagramText.val(), "diagram");        
            // TODO: Handle parsing errors with sticky message showing errors
            var diagram = new uml2svg.Uml2svg(
                                $diagramText.val(),                
                                $diagramType.val(), 
                                {   width:640,
                                    height:480 });

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
});

