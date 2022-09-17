class Node {
    constructor(data) {
        this.data = data; //the value of the node
        this.left = null; //left subchildren (tree)
        this.right = null; //right subchildren (tree)
    }
}

class Tree {
    constructor() {
        //this.array = array;
        this.root = null; //return val of buildtree will be distilled down to root through recursion
    }

    buildTree(array, start, end) {
        if(start > end) { //base case
            return null;
        } else {
            let mid = parseInt((start + end) / 2);
            let node = new Node(array[mid]);
            node.left = this.buildTree(array, start, mid - 1);
            node.right = this.buildTree(array, mid + 1, end);
            this.root = node;
        }
    }

    insert(data) { //helper method to create a new node to be inserted, then calls insertNode
        let newNode = new Node(data);
        if(this.root === null) { //if root is null then node will be added to tree and made root
            this.root = newNode;
        } else { //otherwise try to find the correct position in the tree and add the node.
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) { //inserts a new node in a tree. Moves over tree to find lcoation to insert node with given data
        if(newNode.data < node.data) { //if less, go left
            if(node.left === null) { //base, but instead of returning we set the 'left' of the node to the new node.
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else { //otherwise, go right
            if(node.right === null) { //base
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
//3 depth-first traversals here:
    //note that the only thing that really changes or matters here, is the order in which the algorithm does its magic.
    inorder(node) {//traverses left, root, right
        if(node !== null) { //base
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

//this is breadth-first traversal. time-complexity is O(n), relative to number of nodes. 
    levelorderIterative(node) { //should take another function as param - this will traverse the tree breadth-first using a queue. ( array acting as FIFO queue )
        if(node === null) { //base case
            return;
        } else {
            let q = [];
            q.push(node);
            //iterative solution here!
            while(q.length != 0) { //iterate while queue is not empty (at least one discovered node)
                let curr = q.shift(); //take off the front of queue.
                if(curr.left != null) {
                    q.push(curr.left); //push address of children into back of queue.
                }
                if(curr.right != null) {
                    q.push(curr.right);
                }
                //console.log("levelOrder: current node is: " + curr.toString());
                return curr.data;
            }
        }
    }

    levelorderRecursive = function(root) { 
        let q = []; //NOTE: we have to set up our function within a callback like this because we need an array that isn't initalized within the scope of our recursing function
                    //so it doesn't reset with each call. The recursive version of this will not 'shift()' any elements, so isn't really a queue?
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
        } else { //if data is similar to the roots data, then delete this node
            if(node.left === null && node.right === null) { //deleting node with no children (leaf)
                node = null;
                return node;
            }
            if(node.left === null) { //deleting node with one child (left)
                node = node.right;
                return node;
            } else if(node.right === null) { //(right)
                node = node.left;
                return node;
            }
            //deleting node with two children
            //minimum node of the right subtree is stored in aux.
            let aux = this.findMinNode(node.right);
            node.data = aux.data;

            node.right = this.removeNode(node.right, aux.data);
            return node;
        }
    }

    height = function(root) { //accept a node and return the height, defined as: the number of edges in longest path from a given node to a leaf node.
        //so you essentially want to traverse the method with level order, incrementing as you go; very similar to our levelorderRecursive function.
        let arr = [];

        function heightRec(node, l) { //use counter to determine number of levels?
            if(!node) return; //base
            if(arr[l]) {  //this logic separates the queue up by levels, each index is a level.
                arr[l].push(node.data);
            } else {
                arr[l] = [node.data];
            }
            heightRec(node.left, l + 1);
            heightRec(node.right, l + 1)
        }
        heightRec(root, 0); //run heightRec with passed in root, 0 starting level
        return arr.length; //the height will be the length of our array of arrays. (aka, the # of levels)
    }
    
    depth(data, root) {
        let q = this.levelorderRecursive(root); //gives us our level order array representation from which we will gleam the depth.
        //console.log(q); //print out retrieved array
        for(let i = 0 ; i < q.length; i++) {
            for(let p = 0; p < q[i].length; p++) {
                if(q[i][p] == data) {
                    console.log(`The depth of the ${q[i][p]} is = ` + (i + 1)); //correct index of q, plus one, to offset 0-index array
                }
            }
        }
    }

    isBalanced = function(root) { //check on tree - a balanced tree is one where the difference b/w heights 
        //of left subtree and right subtree of every node is not more than 1.
        

    }

    findMinNode(node) { //finds minimum node in tree, searching starts from given node
        if(node.left === null) { //basically this iterates through node.left until null (finds the leaf)
            return node;
        } else {
            return this.findMinNode(node.left);
        }
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
}

// const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// let tree = new Tree();
// let n = arr1.length;
// //tree.buildTree(arr1, 0 , n - 1);
// tree.buildTree(arr1, 0, n - 1);
// //tree.prettyPrint(root);
// //tree.prettyPrint(tree.root);
// tree.inorder(tree.root);
// console.log(tree);

let BST = new Tree();
BST.insert(15);
BST.insert(25);
BST.insert(10);
BST.insert(7);
BST.insert(22);
BST.insert(17);

//new
BST.insert(99);
BST.insert(100);
BST.insert(1000);
BST.insert(4000);
BST.insert(8);

BST.insert(13);
BST.insert(5);
BST.insert(9);
BST.insert(27);
let root = BST.getRootNode();
BST.inorder(root);
BST.remove(7);
root = BST.getRootNode();//reset
BST.inorder(root);
BST.prettyPrint(root);
//console.log(BST.find(27)); //works
//console.log(BST.levelorder(root)); //seems to work
//console.log(BST.levelorderRecursive(root));
//console.log(BST.height(root));
BST.depth(8, root);