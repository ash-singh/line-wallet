const {
    Cell, 
    NumberNode, 
    CellRefNode, 
    FuncNode,
    hasCircularReference
} = require("./cell.js")

const testSuite = [
    {
        input : [
            new Cell('A1', new NumberNode(2)),
            new Cell('A2', new NumberNode(5))
        ],
        expected: false
    },
    {
        input : [
            new Cell('A1', new CellRefNode('A2')),
            new Cell('A2', new CellRefNode('A1'))
        ],
        expected: true
    },
    {
        input : [
            new Cell('A1', new NumberNode(2)),
            new Cell('A2', new NumberNode(5)),
            new Cell('A3', new CellRefNode('A4')),
            new Cell('A4', new FuncNode('add',[
                new CellRefNode('A1'), new CellRefNode('A2'), new CellRefNode('A3')
            ])),
            new Cell('A4', new CellRefNode('A3')),
        ],
        expected: true
    },
    {
        input : [
            new Cell('A1', new CellRefNode('A2')),
            new Cell('A2', new CellRefNode('A3')),
            new Cell('A8', new CellRefNode('A9')),
            new Cell('A3', new CellRefNode('A1'))
        ],
        expected: true
    },
]

testSuite.forEach(test => {
    var result = hasCircularReference(test.input);
    
    if (result == test.expected) {
        console.log('Pass')
    } else {
        console.log('Failed => ', test)
    }
})
