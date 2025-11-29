import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName{

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string){
        super(delimiter ?? DEFAULT_DELIMITER);

        //shallow copy: keep internal array private
        this.components = [...source];

        //class invariant inclussion after construction
        this.assertClassInvariant();
        
    }

    public clone(): Name{
        //same delimiter and masked components
        return new StringArrayName(this.components, this.delimiter);
    }

    /** asString, asDataString, isEqual, getHashCode, isEmpty, getDelimiterCharacter
        are inherited from AbstractName.
    */

    public getNoComponents(): number{
        return this.components.length;
    }

    public getComponent(i: number): string{
        //use of precondition
        this.assertValidIndexAsPrecondition(i);
        // return still masked component
        return this.components[i];
    }

    public setComponent(i: number, c: string): void{
        //use of precondition
        this.assertValidIndexAsPrecondition(i);

        this.components[i] = c;

        //use of invariant: after mutation
        this.assertClassInvariant();
    }

    public insert(i: number, c: string): void{
        this.assertValidInsertIndexAsPrecondition(i);
        
        // insert c at index i
        this.components.splice(i, 0, c);

        this.assertClassInvariant();
    }

    public append(c: string): void{
        // add component to the end
        this.components.push(c);

        this.assertClassInvariant();
    }

    public remove(i: number): void{

        this.assertValidIndexAsPrecondition(i);
        // remove component at index i
        this.components.splice(i, 1);

        this.assertClassInvariant();
    }

}