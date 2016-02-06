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
            assert.ok(result);
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
            //assert.equal(false. parser.validateLineParts([]), '[] should fail');
            assert.equal(false, parser.validateLineParts(['']), '[""] should fail');
            assert.equal(false, parser.validateLineParts([' ']), '[" "] should fail');
        });
        
        it('should fail on empty object names ( -> :Hello)', function() {
            assert.equal(false, parser.validateLineParts(' -> :Test Message'),
                        '" -> :TestMessage" should fail');
            assert.equal(false, parser.validateLineParts('A-> :Test Message'),
                        '"A-> :Test Message" should fail');
            assert.equal(false, parser.validateLineParts(' ->B:Test Message'),
                        '" ->B:Test Message" should fail');
        });

        it('should fail on multiple colons', function() {
            assert.equal(false, parser.validateLineParts('A->B:test:test'),
                        '"A->B:test:test" should fail');
            assert.equal(false, parser.validateLineParts('A:->B:test'),
                        '"A:->B:test" should fail');
            assert.equal(false, parser.validateLineParts('A->::test'),
                        '"A->::test" should fail');
        });
    
    });

    describe('parse', function() {
        it('should extract valid diagram model', function() {
            var input = 
                'A->B:Test Message\n' +
                'B->C:Test Sub Message\n' +
                'B<-C:Sub Response\n' +
                'B->D:Another Sub Message';
            var diagramModel = parser.parse(input);
            assert.ok(diagramModel);
            assert.ok(diagramModel.actors);
            assert.ok(diagramModel.messages);
            
            // Asserts for actors
            var actors = diagramModel.actors;
            assert.equal( 4 , actors.length, 'Correct number of actors parsed');
            assert.equal('A', actors[0].title, '1st actor should be "A"');
            assert.equal( 0 , actors[0].order, '1st actor should be in order 0');
            assert.equal('B', actors[1].title, '2nd actor should be "B"');
            assert.equal( 1 , actors[1].order, '2nd actor should be in order 1');
            assert.equal('C', actors[2].title, '3rd actor should be "C"');
            assert.equal( 2 , actors[2].order, '3rd actor should be in order 2');
            assert.equal('D', actors[3].title, '4th actor should be "D"');
            assert.equal( 3 , actors[3].order, '4th actor should be in order 3');
            
            // Asserts for messages
            var messages =  diagramModel.messages;
            assert.equal( 4 , messages.length, 
                         'Correct number of messages parsed');
            
            // A->B:Test Message
            assert.equal('Test Message', messages[0].message,
                        '1st message should have title "Test Message"');
            assert.equal( 0, messages[0].order,
                        '1st message should have order 0');
            assert.equal('A', messages[0].callerActor,
                        '1st message caller should be "A"');
            assert.equal('B', messages[0].calleeActor,
                        '1st message callee should be "B"');
            assert.equal('request', messages[0].type,
                        '1st message should have type "request"');

            // B->C:Test Sub Message
            assert.equal('Test Sub Message', messages[1].message,
                        '2nd message should have title "Test Sub Message"');
            assert.equal( 1, messages[1].order,
                        '2nd message should have order 1');
            assert.equal('B', messages[1].callerActor,
                        '2nd message caller should be "B"');
            assert.equal('C', messages[1].calleeActor,
                        '2nd message callee should be "C"');
            assert.equal('request', messages[1].type,
                        '2nd message should have type "request"');
            
            // B<-C:Sub Response
            assert.equal('Sub Response', messages[2].message,
                        '3rd message should have title "Sub Response"');
            assert.equal( 2, messages[2].order,
                        '3rd message should have order 2');
            assert.equal('B', messages[2].callerActor,
                        '3rd message caller should be "B"');
            assert.equal('C', messages[2].calleeActor,
                        '3rd message callee should be "C"');
            assert.equal('response', messages[2].type,
                        '3rd message should have type "response"');
            
            // B->D:Another Sub Message
            assert.equal('Another Sub Message', messages[3].message,
                        '3rd message should have title "Another Sub Message"');
            assert.equal( 3, messages[3].order,
                        '3rd message should have order 3');
            assert.equal('B', messages[3].callerActor,
                        '3rd message caller should be "B"');
            assert.equal('D', messages[3].calleeActor,
                        '3rd message callee should be "D"');
            assert.equal('request', messages[3].type,
                        '3rd message should have type "request"');
        });

        it('should *CURRENTLY* throw error "Self-Call is not supported" in case of self-call', function() {
            try {
                parser.parse('A->A:Self Call');
            } catch(err) {
                assert.equal('Self-Call is not supported', err.message);
            }
        });
    });
});

