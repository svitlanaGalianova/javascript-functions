function seed() {
  let array = []
  for (var i = 0; i < arguments.length; i++) {
    array.push(arguments[i])
  }
  return array
}

function same([x, y], [j, k]) {
  return (x == j && y == k)
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  //The game state must be passed as the this value

  //The some() method executes the callback function once for each element present in the array 
  //until it finds the one where callback returns a truthy value
  return this.some(c => same(c, cell));
}

const printCell = (cell, state) => {
  //The call() method is a predefined JavaScript method.
  //Used to invoke (call) a method with an owner object ('this' in the function you are calling)as an argument (parameter).
  return contains.call(state, cell) ? '\u25A3' : '\u25A2'
};

//default parameter state is []
const corners = (state = []) => {
  //If there are no living cells, the topRight and bottomLeft should both be [0,0].
  if (state.length === 0) {
    return { topRight: [0, 0], bottomLeft: [0, 0] }
  }
  const xs = state.map(([x, _]) => x);
  const ys = state.map(([_, y]) => y);
  return {
    topRight: [Math.max(...xs), Math.max(...ys)],
    bottomLeft: [Math.min(...xs), Math.min(...ys)]
  };
};

const printCells = (state) => {
  const { bottomLeft, topRight } = corners(state);

  var result = "";
  for (var y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    result += row.join(" ") + "\n";
  }
  return result;
};

const getNeighborsOf = ([x, y]) => [
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  [x - 1, y], [x + 1, y],
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1]
];

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter(n => contains.bind(state)(n));
};

const willBeAlive = (cell, state) => {
  // the cell has three living neighbors, or,
  // the cell is currently alive and has two living neighbors
  var livingNeighborsCount = getLivingNeighbors(cell, state).length

  return livingNeighborsCount == 3 ||
    (contains.call(state, cell) && livingNeighborsCount == 2) ? true : false
};

const calculateNext = (state) => {
  var newState = []

  //get corners
  var { bottomLeft, topRight } = corners(state)

  //extend the search space by one row or column in each direction
  bottomLeft = [bottomLeft[0] - 1, bottomLeft[1] - 1]
  topRight = [topRight[0] + 1, topRight[1] + 1]

  for (var y = topRight[1]; y >= bottomLeft[1]; y--) {
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      if (willBeAlive([x, y], state))
        newState.push([x, y])
    }
  }

  return newState
};

const iterate = (state, iterations) => { };

const main = (pattern, iterations) => { };

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;