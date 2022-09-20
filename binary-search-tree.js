class Node {
    constructor(data) {
        this.data = data; //the value of the node
        this.left = null; //left subchildren (tree)
        this.right = null; //right subchildren (tree)
    }
}

class Tree {
    constructor() {
        this.root = null;
        this.dataArray = [];
    }

    buildTree(array) { //take an array, iterate through array, and then call insert on each val
        array.forEach(element => {
            this.insert(element);
        });
    }

    //these versions of buildTree only work with a sorted array since they pick root from the middle.
    //after I built my insertion function, decided to retire these but keep around for reference.
//     buildTree(array, start, end) {
//         if(start > end) { //base case
//             return null;
//         } else {
//             let mid = parseInt((start + end) / 2);
//             let node = new Node(array[mid]);
//             node.left = this.buildTree(array, start, mid - 1);
//             node.right = this.buildTree(array, mid + 1, end);
//             this.root = node;
//         }
// }
    
    // buildTree() {
    //  if(this.root == null) { //if there is no root (hasn't been set on first insertion or has been cleared), take new root from center of passed in (sorted) array. (for rebalancing)
    //         let mid = (array.length / 2) - 1;
    //         let newNode = new Node(array[mid]);
    //         //this.insert(array[mid]);
    //         this.root = newNode;
    //         array.splice(mid, 1);
    //     }
    // }
    //also keeping this around for reference
    // clearTree() {
    //     root = null; //can't just do this, it deletes the tree but doesn't actually change the root to null.
    //     console.log('Tree cleared');
    // }

    deleteTree(node) { 
        if(node == null) return; //base
        //delete both subtrees
        this.deleteTree(node.left);
        this.deleteTree(node.right);
        console.log('Deleting node: ' + node.data);
    }

    deleteTreeRef(nodeRef) { //wrapper function that deletes the tree and sets root node as null.
        this.deleteTree(nodeRef);
        nodeRef = null;
    }

    insert(data) { //helper method to create a new node to be inserted, then calls insertNode
        console.log('Inserting: ' + data);
        if(this.find(this.root, data)) { //check for duplicates!
            return null;
        }
        let newNode = new Node(data);
        if(this.root === null) { //if root is null then node will be added to tree and made root
            this.root = newNode;
        } else { //otherwise try to find the correct position in the tree and add the node.
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) { //inserts a new node in a tree. Moves over tree to find lcoation to insert node with given data
        //important: this function will build our tree in such a way that it can be called a BST (proof: inorder traversal should yield smallest to largest)
        if(newNode.data < node.data) { //if less, go left
            if(node.left === null) { //base
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else { //otherwise if greater, go right
            if(node.right === null) { //base
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
//3 depth-first traversals here:
    inorder(node) { //traverses left, root, right
        if(node !== null) {
            this.inorder(node.left);
            console.log(node.data); //this is 'reading' the root
            this.inorder(node.right);
        }
    }

    preorder(node) { //traverses root, left, right
        if(node !== null) {
            console.log(node.data);
            this.preorder(node.left);
            this.preorder(node.right);
        }
    }

    postorder(node) { //traverses left, right, root
        if(node !== null){ 
            this.postorder(node.left);
            this.postorder(node.right);
            console.log(node.data);
        }
    }

//this is breadth-first traversal
    levelorderIterative(node) { //should take another function as param - this will traverse the tree breadth-first using a queue. ( array acting as FIFO queue )
        if(node === null) { //base case
            return;
        } else {
            let q = [];
            q.push(node);
            //iterative solution
            while(q.length != 0) { //iterate while queue is not empty (at least one discovered node)
                let curr = q.shift(); //take off the front of queue.
                if(curr.left != null) {
                    q.push(curr.left); //push address of children into back of queue.
                }
                if(curr.right != null) {
                    q.push(curr.right);
                }
                return curr.data;
            }
        }
    }

    levelorderRecursive = function(root) { 
        let q = []; //NOTE: we have to set up our function as a closure like this because we need an array that isn't initalized within the scope of our recursing function
                    //so it doesn't reset with each call.
        function lot(node, l) { //Params: node is root, lowercase L here represents the 'level' of our passed in node. So, 0 when we call it
            if(!node) return; //base
            if(q[l]) { //if there is an array at the corresponding index(level), push our node data onto it
                q[l].push(node.data);
            } else { //otherwise, if there is not an array, we create a new array containing data of our node. 
                q[l] = [node.data];
            }
            //these lines do the recursion, once for left child and once for right child. With each call, we pass with current level + 1. This way, with subsequent calls, all nodes on same level
            //will have the same level number passed as their arg. The level propert basically functions as a counter for the depth of the tree.
            lot(node.left, l + 1);
            lot(node.right, l + 1);
        }
        lot(root, 0);
        return q; //we should end up with an array where every index is an array with its own array of all the values on that level.
    }

    remove(data) {
        this.root = this.removeNode(this.root, data); //root re-initialized with root of a modified tree.
    }

    removeNode(node, key) { //recursively iterates through tree to delete
        if(node === null) {
            return null;
        } else if(key < node.data) { //if data to delete is less than roots data then move to left subtree
            node.left = this.removeNode(node.left, key);
            return node;
        } else if(key > node.data) { //if data to delete is greater than roots data then move to right subtree.
            node.right = this.removeNode(node.right, key);
            return node;
        } else { 
            //if data is similar to the roots data, then delete this node
            if(node.left === null && node.right === null) { //deleting node with no children (leaf)
                node = null;
                return node;
            }
            if(node.left === null) { //deleting node with one child (left)
                node = node.right; //replace node with its child!
                return node;
            } else if(node.right === null) { //(right)
                node = node.left;
                return node;
            }
            //otherwise, you're deleting a node with two children
            //minimum node of the right subtree is stored in aux.
            let aux = this.findMinNode(node.right);
            node.data = aux.data; //then set node to be deleted to data of min node

            node.right = this.removeNode(node.right, aux.data);
            return node;
        }
    }

    findMinNode(node) { //finds minimum node in tree, searching starts from given node
        if(node.left === null) { //basically this iterates through node.left until null (finds the leaf)
            return node;
        } else {
            return this.findMinNode(node.left);
        }
    }

    height = function(root) { //accept a node and return the height, defined as: the number of edges in longest path from a given node to a leaf node.
        //so you essentially want to traverse the method with level order, incrementing as you go; very similar to our levelorderRecursive function.
        let arr = [];

        function heightRec(node, l) { //'l' will represent the 'level'
            if(!node) return; //base
            if(arr[l]) {  //if there is an array at level, push current node.data to it
                arr[l].push(node.data);
            } else {      //otherwise if there is not an array at level, create one and put our node.data into it.
                arr[l] = [node.data];
            }
            heightRec(node.left, l + 1);
            heightRec(node.right, l + 1)
        }
        heightRec(root, 0); //pass in root, 0 starting level
        return arr.length; //the height will be the length of our array of arrays. (the # of levels)
    }
    
    depth(data, root) {
        let q = this.levelorderRecursive(root); //gives us our level order array representation from which we will gleam the depth.
        //console.log(q); //print out retrieved array
        for(let i = 0 ; i < q.length; i++) {
            for(let p = 0; p < q[i].length; p++) {
                if(q[i][p] == data) {
                    console.log(`The depth of the ${q[i][p]} node is = ` + (i + 1)); //correct index of q, plus one, to offset 0-index array
                }
            }
        }
    }

    isBalanced = function(root) { //check on tree - a balanced tree is one where the difference b/w heights 
        //of left subtree and right subtree of every node is not more than 1.
        //originally tried to recursively check subtrees and increment a counter, but had issues 
        //especially after resetting the root node. Switched to using height()
        // let countLeft = 0;
        // let countRight = 0;

        let left = this.height(root.left);
        let right = this.height(root.right);

        // function leftTrav(node) {
        //     if(node.left == null) {
        //         return console.log(`left has ${left} height`);
        //     } else {
        //         countLeft++;
        //         leftTrav(node.left);
        //     }
        // }

        // function rightTrav(node) {
        //     if(node.right == null) {
        //         return console.log(`right has ${right} height`);
        //     } else {
        //         countRight++;
        //         rightTrav(node.right);
        //     }
        // }

        // leftTrav(root);
        // rightTrav(root);

        if(root == null) {
            console.log('Root is null.')
            return true;
        }
        if((left == right - 1) || (left == right + 1) || (left == right)) {
            console.log('The tree is balanced!');
            return true;
        } else {
            console.log('Tree is not balanced.');
            return false;
        }
    } //end isBalanced()

    //this function will rebalance an unbalanced tree. Essentially will select a new root from array,
    // and build the tree with that root in such a way that it becomes balanced.
    rebalance(root) {
        let left = this.height(root.left);
        let right = this.height(root.right);
        let n = left - right;
        if(n == 1 || n == 0 || n == -1) {
            return console.log('Tree is already balanced');
        }
        if(left > right) { //if left side is larger, shift root to left child of root
            this.root = root.left; 
        }
        else if(left < right) {
            this.root = root.right;
        }
        //get the starter array:
        let newArr = this.dataArray;
        //then clear the old tree:
        this.deleteTreeRef(root);
        //and then rebuild the tree:
        this.buildTree(newArr);
    }

    getRootNode() { //returns root node of a tree
        return this.root;
    }

    find(node, data) { //search for a node with given data
        if(node === null) { //base case
            return null;
        } else if(data < node.data) { //if value is less than data, search left
            return this.find(node.left, data);
        } else if(data > node.data) {
            return this.find(node.right, data); //if value is greater than data, search right
        } else { //if data is equal to the node data, return it
            //let results = [];
            return node;
        }
    }

    prettyPrint(node, prefix = '', isLeft = true) {
        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false); 
          //it's pretty hard to understand how this works, but basically when we are popping stuff off the stack and printing, 
          //we are calling that function invocation with a different prefix. So when we print it below, that prefix prints first,
          //and then the console log below with appropriate lines. 
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`); //if left, downward descending and upward ascend if right
        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
            // note: prefix is switched up here. 
        }
      }
} //end Tree class

function randomInt(max) {
    return Math.ceil(Math.random() * max);
}
function randomArray(maxSize, maxNum) {
    let arr = [];
    let size = randomInt(maxSize);
    for(let i = 0; i < size; i++) {
        let num = randomInt(maxNum);
        arr.push(num);
    }
    return arr;
}

// //console.log(BST.find(27)); //lookup works
// //console.log(BST.levelorderIterative(root));
// //console.log(BST.levelorderRecursive(root));
//console.log("height: " + BST.height(root));
// BST.depth(8, root);

//1. Create a BST from an array of random numbers.
console.log('\n\t\tStep 1: Create BST from random array...\n\t\t-----------------------------------\n');
let startArr = randomArray(20, 200);
console.log('start array is: ' + startArr);
let BST = new Tree();
BST.dataArray = startArr;
BST.buildTree(startArr);
let root = BST.getRootNode();
BST.prettyPrint(root);
console.log('right: ' + BST.height(root.right));
console.log('left: ' + BST.height(root.left));
BST.isBalanced(root);

//2. confirm the tree is balanced by calling isBalanced
console.log('\n\t\tStep 2: Rebalance tree if need be, confirm new balance...\n\t\t------------------------------------\n');
while(BST.isBalanced(root) !== true) { 
    BST.rebalance(root);
    root = BST.getRootNode(); //this must be called to update our outer root var after each rebalance/tree deletion
}
BST.isBalanced(root);
BST.prettyPrint(root);

//.3 Print out all elements in level, pre, post, and in order
console.log('\n\t\tStep 3: Print out all elements in level/pre/post/inorder traversal\n\t\t--------------------------------------------\n');
console.log('Inorder: (should go from smallest to largest)\n');
BST.inorder(root);
console.log('\nLevelorder: (each subarray represents a level of the tree)\n');
console.log(BST.levelorderRecursive(root));
console.log('\nPreorder:\n');
BST.preorder(root);
console.log('\nPostorder:\n');
BST.postorder(root);

//.4 Unbalance the tree by adding several numbers > 100
console.log("\n\t\tStep 4: Unbalancing the tree:\n\t\t----------------------------------\n")
BST.insert(455);
BST.insert(465);
BST.insert(565);
BST.insert(666);
BST.insert(777);
BST.insert(1122);

//.5 Confirm tree is unbalanced by calling isBalanced
console.log('\n\t\tStep 5: Confirm tree is unbalanced\n\t\t----------------------------------------\n')
BST.isBalanced(root);
BST.prettyPrint(root);

//.6 Balance the tree by calling rebalance
console.log('\n\t\tStep 6: Rebalance the tree again\n\t\t--------------------------------\n');
while(BST.isBalanced(root) !== true) { 
    BST.rebalance(root);
    root = BST.getRootNode();
}

//7. Confirm that the tree is balanced by calling isBalanced
console.log('\n\t\tStep 7: Confirm tree is rebalanced again\n\t\t--------------------------------------\n');
BST.isBalanced(root);
BST.prettyPrint(root);

//8. Print out all elements in level, pre, post, and in order
console.log('\n\t\tStep 8: Print out all elements again w/ our breadth-first and depth-first traversals\n\t\t------------------------------------------\n');
console.log('Levelorder:\n');
console.log(BST.levelorderRecursive(root));
console.log('Preorder:\n');
BST.preorder(root);
console.log('Postorder:\n');
BST.postorder(root);
console.log('Inorder:\n');
BST.inorder(root); 