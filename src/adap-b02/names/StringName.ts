import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        if(delimiter) this.delimiter = delimiter;
        //count components 
        this.noComponents = this.name === "" ? 0 : this.name.split(this.delimiter).length;
    }

    public asString(delimiter: string = this.delimiter): string {
        const components = this.name.split(this.delimiter);
        const unmasked = components.map(masked => {
            let result = '';
            for(let i=0; i<masked.length; i++){
                const ch = masked[i];
                if(ch === ESCAPE_CHARACTER){
                    // if backslash: skip it and take next character literally
                    i++;
                    if(i<masked.length) result+= masked[i];
                    // edge case: ends with '\'
                    else result+= ESCAPE_CHARACTER;
                }else{
                    result+= ch;
                }
            }
            return result;
        });
        return unmasked.join(delimiter);
    }

    public asDataString(): string {
        const components = this.name.split(this.delimiter).map(masked => {
            //unescape internal content
            let unmasked = '';
            for(let i=0; i<masked.length; i++){
                const ch = masked[i];
                if(ch === ESCAPE_CHARACTER){
                    i++;
                    if(i<masked.length) unmasked+= masked[i];
                    else unmasked+= ESCAPE_CHARACTER;
                }else{
                    unmasked+= ch;
                }
            }
            return unmasked;
        });

        // escape for default delimiter/escape char
        const maskedForDefault = components.map(raw => {
            let masked = '';
            for (let i=0; i<raw.length; i++) {
                const ch = raw[i];
                if (ch === ESCAPE_CHARACTER || ch === DEFAULT_DELIMITER) {
                    masked+= ESCAPE_CHARACTER;
                }
                masked+= ch;
            }
            return masked;
        });
        return maskedForDefault.join(DEFAULT_DELIMITER);
}

    /** return the currently used delimiter char */
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /** return true if name has 0 components */
    public isEmpty(): boolean {
        return this.name.length === 0;
    }

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
        if(n<0 || n>= components.length){
            throw new RangeError('Index out of range');
        }
        components.splice(n, 0, c);

        this.name = components.join(this.delimiter);
        this.noComponents = components.length;

    }

    /** append the component at the end of name */
    public append(c: string): void {
       if(this.name === "") this.name = c;
       else this.name += this.delimiter +c;
       this.noComponents++;
    }

    /** remove the component at the given index */
    public remove(n: number): void {
        const components= this.name === '' ? []: this.name.split(this.delimiter);
        if(n<0 || n>= components.length){
            throw new RangeError('Index out of range');
        }
        components.splice(n, 1);

        this.name = components.join(this.delimiter);
        this.noComponents = components.length;

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