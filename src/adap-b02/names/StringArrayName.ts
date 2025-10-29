import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";


export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.components  = [...source];                     //shallow copy: keep internal array private
    }

    public asString(delimiter: string = this.delimiter): string {
        const rawComponents = this.components.map(masked => {
            let unmasked = '';
            for(let i=0; i<masked.length; i++){
                const ch = masked[i];
                if(ch === ESCAPE_CHARACTER){
                    // if backslash: skip it and take next character literally
                    i++;
                    if(i<masked.length) unmasked+= masked[i];
                    // edge case: string ends with '\'
                    else unmasked+= ESCAPE_CHARACTER;
                }else{
                    unmasked+= ch;
                }
            }
            return unmasked;
        });
        return rawComponents.join(delimiter);
}

    public asDataString(): string {
        const rawComponents = this.components.map(masked => {
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

        // remask for the default delimiter '.'
        const maskedForDefault = rawComponents.map(raw => {
            let masked = '';
            for (let i=0; i<raw.length; i++) {
                const ch = raw[i];
                // escape '.' or '\' and consider them as literal
                if (ch === ESCAPE_CHARACTER || ch === DEFAULT_DELIMITER) {
                    masked+= ESCAPE_CHARACTER;
                }
                masked+= ch;
            }
            return masked;
        });
        return maskedForDefault.join(DEFAULT_DELIMITER);
}


    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

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
        if(i<0 || i>= this.components.length){
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

    public concat(other: Name): void {
        for(let i=0; i< other.getNoComponents(); i++){
            this.components.push(other.getComponent(i));
        }
    }

}