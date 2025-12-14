import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { Node } from "./Node";

import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }
    
    //for a filesystem root, we want 0 components
    public getFullName(): Name{
    return new StringName("", "/", 0);
    }

    public move(to: Directory): void {
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }
    
    /** Service-level entry point for the file system
    - detects component failures
    - translates them into a -ServiceFailureException- */
    public override findNodes(name: string | Name): Set<Node> {
        try {
            // Let Directory do the real work
            return super.findNodes(name);
        } catch (e) {
            // Wrap any internal exception as a service failure
            const ex = e as Exception;
            throw new ServiceFailureException("file system service failed in findNodes()", ex);
        }
    }
}