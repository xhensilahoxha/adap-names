import { Name } from "../names/Name";
import { Directory } from "./Directory";

import { IllegalArgumentException } from "../common/IllegalArgumentException";

/** This is the base class for File, Directory, and Link
    -preconditions are implemented using IllegalArgumentException */

export class Node {

    protected baseName: string= "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        // preconditions: 
        // -parent directory must be valid
        this.assertValidParentAsPrecondition(pn);

        this.doSetBaseName(bn);
        this.parentNode= pn; 
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode= pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        // preconditions: 
        // - target directory must be valid
        this.assertValidParentAsPrecondition(to);

        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode= to;
    }

    public getFullName(): Name {
        const result: Name= this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName= bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }
    
    // ============== precondition helper ===============
    protected assertValidParentAsPrecondition(pn: Directory): void{
        // preconditions: 
        // -parent directory can't be null/undefined
        IllegalArgumentException.assert(pn != null, 
            'parent directory must not be null'
        );
    }
}
