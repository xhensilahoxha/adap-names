import { Node } from "./Node";

import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node{

    protected childNodes: Set<Node>= new Set<Node>();

    constructor(bn: string, pn: Directory){
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean{
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void{
        // Preconditions:
        // - child shouldn't be null
        this.assertValidChildAsPrecondition(cn);
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void{
        // Preconditions:
        // - child must already be in directory
        this.assertChildIsMemberAsPrecondition(cn);
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }
    
    // =============== precondition helpers ===============
    protected assertValidChildAsPrecondition(cn: Node): void{
        // Preconditions:
        // - child must not be null
        IllegalArgumentException.assert(cn != null, 'child node must not be null');
    }

    protected assertChildIsMemberAsPrecondition(cn: Node): void{
        // Preconditions:
        // - node must already be in directory
        IllegalArgumentException.assert(
            this.childNodes.has(cn),
            'directory does not contain given child'
        );
    }
}