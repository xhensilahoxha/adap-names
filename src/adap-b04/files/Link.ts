import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {

    protected targetNode: Node | null= null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            // satisfy the condition
            this.assertValidTargetAsPrecondition(tn);
            this.targetNode= tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        // Preconditions:
        // target must not be null
        this.assertValidTargetAsPrecondition(target);
        this.targetNode= target;
    }

    public getBaseName(): string {
        const target= this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        const target= this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        // Preconditions:
        // target must not be null
        this.assertTargetInitializedAsPrecondition(target);
        const result: Node= this.targetNode as Node;
        return result;
    }

    // =============== precondition helpers =======================
    // 1. target must not be null
    protected assertValidTargetAsPrecondition(target: Node): void {
        IllegalArgumentException.assert(
            target != null,
            "link target must not be null"
        );
    }
    // 2. link must already be initialized with a target
    protected assertTargetInitializedAsPrecondition(target: Node | null): void {
        IllegalArgumentException.assert(
            target != null,
            "link has no target node"
        );
    }
}