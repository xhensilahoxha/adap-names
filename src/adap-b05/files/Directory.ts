import { Node } from "./Node";
import { Name } from "../names/Name";
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
       
    /** Searches this directory (as a component) for nodes whose -full name- === the given -Name-
    -use unchecked exceptions
    -don't translate to -ServiceFailureException- here
    - let -RootNode- handle service failure translation */
    public override findNodes(name: string | Name): Set<Node> {
        // Start with matches on this directory itself
        const result = super.findNodes(name);

        // Then search all children recursively
        for (const child of this.childNodes) {
            for (const found of child.findNodes(name)) {
                result.add(found);
            }
        }
        return result;
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