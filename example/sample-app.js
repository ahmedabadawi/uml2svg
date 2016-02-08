$(function() {
    var $diagramType = $("#diagramType");
    var $diagramText = $("#diagramText");
    var $diagramArea = $("#diagramArea");

    $("#render").on("click", function() {
        var parser = new uml2svg.parser[$diagramType.val()]();
        var diagramModel = parser.parse($diagramText.val(), "diagram");        
        var renderer = 
            new uml2svg.Uml2svg($diagramType.val(), { 
                                                width:640,
                                                height:480 });

        var svg = renderer.render(diagramModel);
        $diagramArea.html(svg);
    });
});

