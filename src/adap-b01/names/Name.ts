export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    /**  @methodtype initialization-method (mutation) */
    constructor(components: string[], delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.components = [...components];                       // shallow copy: keep internal array private
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    /** @methodtype conversion-method (query) */
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

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    /** @methodtype conversion-method (query) */
    public asDataString(): string {
        // unmask current component
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

    /** Returns properly masked component string */
    /** @methodtype get-method (query) */
    public getComponent(i: number): string {
        if(i<0 || i>= this.components.length){
            throw new RangeError('Index out of range');
        }
        // return still masked component
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    /** @methodtype set-method (mutation) */
    public setComponent(i: number, c: string): void {
        if(i<0 || i>= this.components.length){
            throw new RangeError('Index out of range');
        }
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     /** @methodtype get-method (query) */
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    /** @methodtype command-method (mutation) */
    public insert(i: number, c: string): void {
        if(i<0 || i>= this.components.length){
            throw new RangeError('Index out of range');
        }
        // insert c at index i
        this.components.splice(i, 0, c);
    }
    
    
    /** Expects that new Name component c is properly masked */
    /** @methodtype command-method (mutation) */
    public append(c: string): void {
        // add component to the end
        this.components.push(c);
    }

    /** @methodtype command-method (mutation) */
    public remove(i: number): void {
        if(i<0 || i>= this.components.length){
            throw new RangeError('Index out of range');
        }
        // remove component at index i
        this.components.splice(i, 1);
    }

}
