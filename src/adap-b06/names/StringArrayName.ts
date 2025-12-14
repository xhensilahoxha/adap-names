import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { DEFAULT_DELIMITER } from "../common/Printable";


export class StringArrayName extends AbstractName{
  protected readonly components: readonly string[];

  constructor(components: string[], delimiter: string= DEFAULT_DELIMITER){
    
    super(delimiter);
    
    //defensive copy
    this.components= [...components];
    
    // invariant check
    this.assertClassInvariant();
  }

  //basic query 1
  public getNoComponents(): number{
    return this.components.length;
  }

  //basic query 2
  public getComponent(i: number): string{
    this.assertValidIndexAsPrecondition(i);
    return this.components[i];
  }

  //clone returns new object with identical value
  public clone(): Name{
    return new StringArrayName([...this.components], this.delimiter);
  }

 
// -----------immutable operations for updating

  protected doWithComponent(i: number, c: string): Name{
    this.assertValidIndexAsPrecondition(i);
    const updatedComponents= [...this.components];
    updatedComponents[i]= c;
    return new StringArrayName(updatedComponents, this.delimiter);
  }

  protected doWithInserted(i: number, c: string): Name{
    this.assertValidInsertIndexAsPrecondition(i);
    const updatedComponents= [...this.components];
    updatedComponents.splice(i, 0, c);
    return new StringArrayName(updatedComponents, this.delimiter);
  }

  protected doWithAppended(c: string): Name{
    return new StringArrayName([...this.components, c], this.delimiter);
  }

  protected doWithConcatenated(other: Name): Name{
    const updatedComponents= [...this.components];
    for(let i= 0; i < other.getNoComponents(); i++){
      updatedComponents.push(other.getComponent(i));
    }
    return new StringArrayName(updatedComponents, this.delimiter);
  }

  protected doWithRemoved(i: number): Name{
    this.assertValidIndexAsPrecondition(i);
    const updatedComponents= [...this.components];
    updatedComponents.splice(i, 1);
    
    return new StringArrayName(updatedComponents, this.delimiter);
  }

// -----------

// delegated to AbstractName
  protected assertClassInvariant(): void{
    super.assertClassInvariant();
  }
}
