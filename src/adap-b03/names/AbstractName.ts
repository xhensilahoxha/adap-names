import { escape } from "querystring";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    //subclass-dependent
    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        const rawComponents: string[] = [];
        for(let i=0; i<this.getNoComponents(); i++){
            const masked = this.getComponent(i);
            let unmasked = '';

            for(let j=0; j< masked.length; j++){
                const ch = masked[j];
                if(ch === ESCAPE_CHARACTER){
                    j++;
                    if(j< masked.length){
                        unmasked += masked[j];
                    }else{
                        unmasked += ESCAPE_CHARACTER;
                    }
                }else{
                    unmasked +=ch;
                }
            }
            rawComponents.push(unmasked);
        }
        return rawComponents.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const rawComponents: string[] = [];
        
        //unescape each masked component to a raw string
        for(let i=0; i<this.getNoComponents(); i++){
            const masked = this.getComponent(i);
            let unmasked = '';

            for(let j=0; j< masked.length; j++){
                const ch = masked[j];
                if(ch === ESCAPE_CHARACTER){
                    j++;
                    if(j< masked.length){
                        unmasked += masked[j];
                    }else{
                        unmasked += ESCAPE_CHARACTER;
                    }
                }else{
                    unmasked +=ch;
                }
            }
            rawComponents.push(unmasked);
    }

    //re-mask for DEFAULT_DELIMITER and ESCAPE_CHARACTER
    const maskedForDefault = rawComponents.map(raw =>{
        let masked = '';
        for(let j=0; j< raw.length; j++){
            const ch= raw[j];
            if(ch === ESCAPE_CHARACTER || ch === DEFAULT_DELIMITER){
                masked += ESCAPE_CHARACTER;
            }
            masked+=ch;
        }
        return masked;
    });
    return maskedForDefault.join(DEFAULT_DELIMITER);
}

    /** Equality based on data representation */
    public isEqual(other: Name): boolean {
        return this.asDataString() === other.asDataString();
    }

    /** Forces 32-bit hash over the data string */
    public getHashCode(): number {
        const data = this.asDataString();
        let hash= 0;
        for(let i=0; i<data.length; i++){
            const ch= data.charCodeAt(i);
            hash = ((hash << 5) - hash) +ch;
            hash |=0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    //concrete operations of subclasses
    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for(let i=0; i< other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }
    }

}