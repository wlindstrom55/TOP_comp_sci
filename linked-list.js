//okay so here we're gonna try to make a linkedlist with factory functions?

function Node(element) {
    this.element = element;
    this.next = null;
}

function LinkedList() {
        this.head = null; //this has to start as null! 
        this.size = 0;
    return {
        head: this.head,
        size: this.size,
        add(element) { //simply add element to the end of the list
            let current;
            let node = new Node(element);
            if(this.head == null) {
                this.head = node;
            } else {
                current = this.head;
                while(current.next) { //iterate to end of list
                    current = current.next;
                }
                current.next = node;
            }
            this.size++;
        },

        insertAt(element, index) {
            if (index < 0 || index > this.size) { //if index is oob, retry
                return console.log("Please enter a valid index.");
            } else {
                let current, prev;
                current = this.head;
                let node = new Node(element);
                if(index == 0) {
                    node.next = this.head; //set our nodes next as the start element.
                    this.head = node; //set the LL's head as our new node
                } else {
                    current = this.head;
                    let it = 0;
                    while(it < index) { //while iterating, we're only really keeping track of previous and current and shifting the two
                        it++;
                        prev = current;
                        current = current.next;
                    }
                    // adding an element - note to add we are literally just saving into the other objects!
                    node.next = current; //insert before last-iterated-to curr
                    prev.next = node; //insert into the prev
                }
                this.size++;
            }
        },

        removeFrom(index) {
            if (index < 0 || index > this.size) { //if index is oob, retry
                return console.log("Please enter a valid index.");
            } else {
                //iterate to index, delete references and then sew the list back up
                let current = this.head;
                let it = 0;
                let prev;
                if(index == 0) {
                    this.head = current.next;
                } else {
                    while(it < index) {
                        it++;
                        prev = current;
                        current = current.next;
                    }
                    prev.next = current.next; //closes the gap
                }
                this.size--;
                //return the remove element to be printed
                return current.element;
            }
        },

        removeElement(element) {
            let current = this.head;
            let prev = null;
            // iterate over the list
            while (current != null) {
                // comparing element with current
                // element if found then remove the
                // and return true
                if (current.element === element) {
                    if (prev == null) { //if on first iteration you find the right element,
                        this.head = current.next; //delete that by overriding it.
                    } else {
                        prev.next = current.next; //otherwise if there IS a previous after first iteration,
                        //set hypo prev's next to the next next
                    }
                    this.size--;
                    return current.element;
                }
                //these do the work of iterating.
                prev = current;
                current = current.next;
            } //end while loop
            return -1;
        },

        indexOf(element) {
            var count = 0;
            var current = this.head;
        
            // iterate over the list
            while (current != null) {
                // compare each element of the list
                // with given element
                if (current.element === element) {
                    return count;
                }
                count++;
                current = current.next; //iterates
            }
            // not found
            return -1;
        },

        isEmpty() {
            return this.size == 0;
        },
    
        size_of_list() {
            console.log(this.size);
        },
    
        printList() {
            var curr = this.head;
            var str = "";
            while (curr) {
                str += curr.element + " ";
                curr = curr.next;
            }
            console.log(str);
        },
    } //end return
} //end linkedlist

// creating an object for the
// Linkedlist class
var ll = new LinkedList();
 
// testing isEmpty on an empty list
// returns true
console.log(ll.isEmpty());
 
// adding element to the list
ll.add(10);
 
// prints 10
ll.printList();
 
// returns 1
console.log(ll.size_of_list());
 
// adding more elements to the list
ll.add(20);
ll.add(30);
ll.add(40);
ll.add(50);
 
// returns 10 20 30 40 50
ll.printList();
 
// prints 50 from the list
console.log("is element removed ?" + ll.removeElement(50));
 
// prints 10 20 30 40
ll.printList();
 
// returns 3
console.log("Index of 40 " + ll.indexOf(40));
 
// insert 60 at second position
// ll contains 10 20 60 30 40
ll.insertAt(60, 2);
 
ll.printList();
 
// returns false
console.log("is List Empty ? " + ll.isEmpty());
 
// remove 3rd element from the list
console.log(ll.removeFrom(3));
 
// prints 10 20 60 40
ll.printList();
