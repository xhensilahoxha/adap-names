import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";

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

    //class invariant : object is in valid state 
    this.assertClassInvariant();
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
        //precondition: 0 <= n < noComponents
        this.assertValidIndexAsPrecondition(x);
        
        const components= this.getComponentsArray();
        return components[x];
    }
    
    /** replace the component at the given index */
    public setComponent(n: number, c: string): void {
        //precondition: index is valid
        this.assertValidIndexAsPrecondition(n);

        const components= this.getComponentsArray();
        components[n]= c;  

        this.name= components.join(this.delimiter);
        this.noComponents= components.length;

        this.assertClassInvariant();

    }

    /** insert the component at index specified */
    public insert(n: number, c: string): void {
        //precondition: insert index must be valid
        this.assertValidInsertIndexAsPrecondition(n);

        const components= this.getComponentsArray();
        components.splice(n,0,c);

        this.name= components.join(this.delimiter);
        this.noComponents= components.length;

        this.assertClassInvariant();
    }

    /** append the component at the end of name */
    // 3 cases
    // noComponents == 0
    // noComponents == 1 && name == ""
    // base case
    public append(c: string): void {
        if(this.noComponents === 0){
            // No components ->just set to new component
            this.name = c;
            this.noComponents = 1;
        }else if(this.noComponents === 1 && this.name === ""){
            // One empty component -> '' becomse '.c'
            this.name = this.delimiter + c;
            this.noComponents = 2;
        }else{
            // Normal case
            this.name += this.delimiter + c;
            this.noComponents++;
        }
        this.assertClassInvariant();
    }

    /** remove the component at the given index */
    public remove(n: number): void {
        //precondition: index should be valid 
        this.assertValidIndexAsPrecondition(n);

        let components= this.getComponentsArray();
        components.splice(n,1);

        if(components.length === 0){
            this.name = '';
            this.noComponents= 0;
        }else if(components.length === 1 && components[0] === ''){
            this.name = '';
            this.noComponents= 1;
        }else{
            this.name= components.join(this.delimiter);
            this.noComponents= components.length;
        }

        // class invariant holds
        this.assertClassInvariant();
    }

/** Goal of this is to strengthen logic for /StringName/
     * If the logical component count is zero,
     * then the internal name must be an empty string
 */
    protected assertClassInvariant(): void{
        super.assertClassInvariant();   

        InvalidStateException.assert(
            this.noComponents != 0 || this.name === '',
            'empty name must have 0 components'
        );
    }

    /** ======== Internal array view: helper method ============ */
    protected getComponentsArray(): string[]{
        let components: string[];

        if(this.noComponents === 0){
            components= [];
        }else if(this.noComponents === 1 && this.name === ''){
            //1 empty component
            components= [''];
        }else{
            //normal case: split using delimiter
            components= this.name.split(this.delimiter);
        }

        //sanity check of components length
        InvalidStateException.assert(
            components.length === this.noComponents,
            'components length must match ->noComponents'
        );
        return components;
    }

}