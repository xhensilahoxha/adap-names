import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);

        //shallow copy: keep internal array private
        this.components = [...source];
        
    }

    public clone(): Name {
        //same delimiter and masked components
        return new StringArrayName(this.components, this.delimiter);
    }

    /** asString, asDataString, isEqual, getHashCode, isEmpty, getDelimiterCharacter
        are inherited from AbstractName.
    */

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if(i<0 || i>= this.components.length){
            throw new RangeError('Index out of range');
        }
        // return still masked component
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if(i<0 || i>= this.components.length){
            throw new RangeError('Index out of range');
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if(i<0 || i> this.components.length){
            throw new RangeError('Index out of range');
        }
        // insert c at index i
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        // add component to the end
        this.components.push(c);
    }

    public remove(i: number): void {
        if(i<0 || i>= this.components.length){
            throw new RangeError('Index out of range');
        }
        // remove component at index i
        this.components.splice(i, 1);
    }

    //Override of generic version
    public concat(other: Name): void {
        for(let i=0; i< other.getNoComponents(); i++){
            this.components.push(other.getComponent(i));
        }
    }

}