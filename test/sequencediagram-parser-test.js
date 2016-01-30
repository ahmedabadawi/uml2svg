var assert = require('chai').assert;
var fs = require('fs');
var vm = require('vm');
var jsPath = './dist/uml2svg.js';

var code = fs.readFileSync(jsPath);
vm.runInThisContext(code);

describe('sequencediagram-parser', function() {
    // initialize parser instace
    var parser = new uml2svg.parser.SequenceDiagram();
    
    describe('interface', function() {
        it('should have valid interface', function() {
            
            assert.ok(parser, 'Parser is an object.');
            assert.ok(parser.parse, 'Parser has parse method');
            assert.ok(parser.parseLine, 'Parser has parseLine method');
            assert.ok(parser.validateLineParts, 'Parser has validateLineParts method');
        });
    });
    
    describe('parseLine', function() {
        it('should return no errors', function() {
            var input = 'Object A->Object B:Test Message';
            var result = parser.parseLine(input, null, null);
            assert.equal('Object A', result.actor1);
            assert.equal('Object B', result.actor2);
            assert.equal('->', result.direction);
            assert.equal('Test Message', result.message);
        });
    });

    describe('validateLineParts', function() {
        it('should pass on valid input A->B:M', function() {
            assert(true, parser.validateLineParts(['A','->','B',':','M']));
        });

        it('should fail on empty or null', function() {
            //assert(false, parser.validateLineParts(['']));
            //assert(false, parser.validateLineParts([' ']));
            assert(false, parser.validateLineParts(null));
        });

        if('should fail on multiple colons', function() {
            assert(false, parser.validateLineParts('A->B:test:test'));
            assert(false, parser.validateLineParts('A:->B:test'));
            assert(false, parser.validateLineParts('A->::test'));
        });
    
    });
});

