import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        this.name = source;

        //count components 
        if (source === ""){
        this.noComponents = 1;            // One empty component
        }else{
        this.noComponents = this.name.split(this.delimiter).length;
    }
}

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    /** asString, asDataString, isEqual, getHashCode, isEmpty, getDelimiterCharacter
        are inherited from AbstractName.
    */

    /** return the number of components */
    public getNoComponents(): number {
        return this.noComponents;
    }

    /** return component at the given index */
    public getComponent(x: number): string {
        const components= this.name === '' ? []: this.name.split(this.delimiter);
        if(x<0 || x>= components.length){
            throw new RangeError('Index out of range');
        }
        return components[x];
    }
    
    /** replace the component at the given index */
    public setComponent(n: number, c: string): void {
        const components= this.name === '' ? []: this.name.split(this.delimiter);
        if(n<0 || n>= components.length){
            throw new RangeError('Index out of range');
        }
        components[n]= c;

        this.name = components.join(this.delimiter);
        this.noComponents = components.length;

    }

    /** insert the component at index specified */
    public insert(n: number, c: string): void {
        const components= this.name === '' ? []: this.name.split(this.delimiter);
        if(n<0 || n> components.length){
            throw new RangeError('Index out of range');
        }
        components.splice(n, 0, c);

        this.name = components.join(this.delimiter);
        this.noComponents = components.length;

    }

    /** append the component at the end of name */
    // 3 cases
    // noComponents == 0
    // noComponents == 1 && name == ""
    // base case
    public append(c: string): void {
        if(this.noComponents === 0){
            // No components
            this.name = c;
            this.noComponents = 1;
        }else if(this.noComponents === 1 && this.name === ""){
            // One empty component
            this.name = this.delimiter + c;
            this.noComponents = 2;
        }else{
            // Normal case
            this.name += this.delimiter + c;
            this.noComponents++;
        }
    }

    /** remove the component at the given index */
    public remove(n: number): void {
        let components: string[];
        if(this.noComponents === 0){
            components = [];
        }else if(this.noComponents === 1 && this.name === ''){
            //One empty component
            components = ['']; 
        }else{
            components = this.name.split(this.delimiter);
        }

        //Catch error if-so: new 
        if (n < 0 || n >= components.length) {
            throw new RangeError("Index out of range");
        }

        components.splice(n, 1);
        
        // Manual reconstruction of the components dependent on their meaning
        if(components.length === 0){
            this.name = '';
            this.noComponents = 0;
        }else if(components.length === 1 && components[0] === ''){
            this.name = '';
            this.noComponents = 1;
        }else{
            this.name = components.join(this.delimiter);
            this.noComponents = components.length;
        }
    }

    /** concatenate components from another instance(Name) onto this one*/
    public concat(other: Name): void {
        const components= this.name === '' ? []: this.name.split(this.delimiter);
        for(let i=0; i< other.getNoComponents(); i++){
            components.push(other.getComponent(i));
        }
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;

    }

}