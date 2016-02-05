/**
// Uncomment the following when run directly using mocha cli
var assert = require('chai').assert;
var fs = require('fs');
var vm = require('vm');
var jsPath = './dist/uml2svg.js';

var code = fs.readFileSync(jsPath);
vm.runInThisContext(code);
*/
var assert = chai.assert;

describe('sequencediagram-parser', function() {
    describe('uml2svg included', function(){
        it('should have access to uml2svg', function() {
            assert.ok(assert);
            assert.ok(uml2svg);
            assert.ok(uml2svg.parser);
        });
    });
    
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

        it('should trim leading and trailing spaces', function() {
            var input = ' Object A -> Object B : Test Message ';
            var result = parser.parseLine(input, null, null);
            assert.ok(result);
            assert.equal('Object A', result.actor1);
            assert.equal('Object B', result.actor2);
            assert.equal('->', result.direction);
            assert.equal('Test Message', result.message);
        });
    });

    describe('validateLineParts', function() {
        it('should pass on valid input A->B:M', function() {
            assert.equal(true, parser.validateLineParts(['A','->','B',':','M']));
        });

        it('should fail on empty or null', function() {
            //assert.equal(false. parser.validateLineParts([]));
            assert.equal(false, parser.validateLineParts(['']));
            assert.equal(false, parser.validateLineParts([' ']));
        });
        
        it('should fail on empty object names ( -> :Hello)', function() {
            assert.equal(false, parser.validateLineParts(' -> :Test Message'));
            assert.equal(false, parser.validateLineParts('A-> :Test Message'));
            assert.equal(false, parser.validateLineParts(' ->B:Test Message'));
        });

        it('should fail on multiple colons', function() {
            assert.equal(false, parser.validateLineParts('A->B:test:test'));
            assert.equal(false, parser.validateLineParts('A:->B:test'));
            assert.equal(false, parser.validateLineParts('A->::test'));
        });
    
    });
});

