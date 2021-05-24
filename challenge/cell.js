class Cell {
    constructor(address, formulaAST) {
        this.address = address;
        this.formulaAST = formulaAST;
    }
}

class NumberNode {
    constructor(value) {
        this.nodeType = "number";
        this,value = value
    }
}

class FuncNode {
    constructor(funcName, funcArgs) {
        this.nodeType = "func";
        this.funcName = funcName;
        this.funcArgs = funcArgs
    }
}

class CellRefNode {
    constructor(address) {
        this.nodeType = "ref";
        this.address = address;
    }
}

function getReferenceMap(cells) {
    let cellMap = []

    if (!Array.isArray(cells)) {
        return false
    } 

    cells.forEach(cell => {
        if (cell.formulaAST.nodeType == 'number') {
            return false;
        }    

        if (cell.formulaAST.nodeType == 'ref') {
            cellMap[cell.address] = [cell.formulaAST.address]; 
        }
        
        if (cell.formulaAST.nodeType == 'func' ) {
            var ref = []
            cell.formulaAST.funcArgs.forEach(cell => {
                ref.push(cell.address)
            })
            cellMap[cell.address] = ref; 
        }
    });

    return cellMap
}

function findCyclicDependency(definitions, identifier) {
    var stack = [];
  
    var internalSearch = function(currentIdentifier) {
  
      if (stack.indexOf(currentIdentifier) !== -1) {
        return currentIdentifier === identifier;
      }
  
      stack.push(currentIdentifier);
  
      if (definitions[currentIdentifier] !== undefined) {
        var found = definitions[currentIdentifier].some(internalSearch);
  
        if (!found) {
          stack.splice(stack.indexOf(currentIdentifier), 1);
        }
    
        return found;
      } 
      return false;
    };
  
    return internalSearch(identifier) ? true : false;
}

const hasCircularReference = function(input) {
    var cellReferenceMap = getReferenceMap(input);

    var cells = Object.keys(cellReferenceMap)
   
    for (index = 0; index < cells.length; index++) {
        if (findCyclicDependency(cellReferenceMap, cells[index]) == true) {
            return true;
        }
    }
   
    return false;
}

module.exports = {
    hasCircularReference: hasCircularReference,
    Cell: Cell,
    NumberNode: NumberNode,
    FuncNode: FuncNode,
    CellRefNode: CellRefNode
} 