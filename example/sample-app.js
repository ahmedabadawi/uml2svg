$(function() {
    var $diagramType = $("#diagramType");
    var $diagramText = $("#diagramText");
    var $diagramArea = $("#diagramArea");
    


    var refreshDiagram = function() {
        var parser = new uml2svg.parser[$diagramType.val()]();
        try {
            var diagramModel = parser.parse($diagramText.val(), "diagram");        
            // TODO: Handle parsing errors with sticky message showing errors
            if(diagramModel) {
                var renderer = 
                    new uml2svg.Uml2svg($diagramType.val(), { 
                                                        width:640,
                                                        height:480 });

                var svg = renderer.render(diagramModel);
                $diagramArea.html(svg);
            }
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

