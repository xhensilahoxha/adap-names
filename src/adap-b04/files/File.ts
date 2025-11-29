import  { Node } from "./Node";
import  { Directory } from "./Directory";

import  { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState= FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        // Preconditions:
        // - file must currently be closed &&
        // - file must not be deleted
        this.assertCanOpenAsPrecondition();
        // @todo
    }

    public read(noBytes: number): Int8Array {
        // Preconditions:
        // - file must currently be open &&
        // - noBytes cannot be 0 or negative
        this.assertCanReadAsPrecondition(noBytes);
        // @todo
        return new Int8Array();
    }

    public close(): void {
        // Preconditions:
        // - file must currently be open 
        this.assertCanCloseAsPrecondition();

        // @todo
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    // =============== precondition helpers ===============
    protected assertCanOpenAsPrecondition(): void {
        // Preconditions:
        // - only closed->open transition is allowed &&
        // - deleted file cannot be opened
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED,
            'deleted file cannot be opened'
        );
        IllegalArgumentException.assert(
            this.state=== FileState.CLOSED,
            'file must be closed before opening'
        );
    }

    protected assertCanReadAsPrecondition(noBytes: number): void {
        // Preconditions:
        // - noBytes is greated than 0 &&
        // - file must be open for read
        IllegalArgumentException.assert(
            noBytes > 0,
            'number of bytes to read must be positive'
        );
        IllegalArgumentException.assert(
            this.state=== FileState.OPEN,
            'file must be open for reading'
        );
    }

    protected assertCanCloseAsPrecondition(): void {
        // Preconditions:
        // - only open-closed transition is allowed
        IllegalArgumentException.assert(
            this.state=== FileState.OPEN,
            "file must be open to be closed"
        );
    }
}