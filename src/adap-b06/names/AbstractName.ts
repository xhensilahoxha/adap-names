import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from '../common/Printable';
import { Name } from './Name';

import { IllegalArgumentException } from '../common/IllegalArgumentException';
import { InvalidStateException } from '../common/InvalidStateException';

//In this classe we treat the Name value objects by:
//formatting, equality, hashing, and contracts
export abstract class AbstractName implements Name{
  protected delimiter: string= DEFAULT_DELIMITER;

  constructor(delimiter: string= DEFAULT_DELIMITER){

    //precondition applied
    IllegalArgumentException.assert(delimiter.length=== 1, 
                                  'delimiter must be a single char.');
    this.delimiter= delimiter;

    this.assertClassInvariant();
  }

  //required by Cloneable<Name>
  public abstract clone(): Name;

  public asString(delimiter: string= this.delimiter): string{
    const rawComponents: string[]= [];

    for(let i=0; i<this.getNoComponents(); i++){
      const masked= this.getComponent(i);
      rawComponents.push(this.unmask(masked));
    }

    return rawComponents.join(delimiter);
  }

  public toString(): string{
    return this.asDataString();
  }

  public asDataString(): string{
    //unmask each storedcomponent
    const rawComponents: string[]=[];
    for(let i=0; i<this.getNoComponents(); i++){
      rawComponents.push(this.unmask(this.getComponent(i)));
    }

    //re-mask for default & escape char
    const maskedForDefault= rawComponents.map((raw)=>this.maskForDefault(raw));
    
    return maskedForDefault.join(DEFAULT_DELIMITER);
  }

  public getDelimiterCharacter(): string{
    return this.delimiter;
  }

  //value equality
  public isEqual(other: Name): boolean{
    IllegalArgumentException.assert(other != null, 
                                  'other must not be null');
    return this.asDataString()=== other.asDataString();
  }

  // same as B05
  public isEmpty(): boolean{
    return this.getNoComponents()=== 0;
  }

  public getHashCode(): number{
    //32-bit hash: same operation
    const data=this.asDataString();
    let hash=0;
    for(let i=0; i<data.length; i++){
      hash=((hash << 5) - hash) + data.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }


  // ---- immutable 'with-s'

  public withComponent(i: number, c: string): Name{
    this.assertValidIndexAsPrecondition(i);
    return this.doWithComponent(i, c);
  }

  public withInserted(i: number, c: string): Name{
    this.assertValidInsertIndexAsPrecondition(i);
    return this.doWithInserted(i, c);
  }

  public withAppended(c: string): Name{
    return this.doWithAppended(c);
  }

  public withRemoved(i: number): Name{
    this.assertValidIndexAsPrecondition(i);
    return this.doWithRemoved(i);
  }

  public withConcatenated(other: Name): Name{
    IllegalArgumentException.assert(other != null, 
    'other name must not be null');
    return this.doWithConcatenated(other);
  }
// -------------

  //----subclass own methods 
  public abstract getNoComponents(): number;
  public abstract getComponent(i: number): string;

  protected abstract doWithComponent(i: number, c: string): Name;
  protected abstract doWithInserted(i: number, c: string): Name;
  protected abstract doWithAppended(c: string): Name;
  protected abstract doWithRemoved(i: number): Name;
  protected abstract doWithConcatenated(other: Name): Name;

  // ==========================helpers
  protected unmask(masked: string): string{
    let unmasked= '';
    for(let j=0; j<masked.length; j++){
      const ch=masked[j];
      if(ch === ESCAPE_CHARACTER){
        j++;
        if(j<masked.length) unmasked += masked[j];
        else unmasked += ESCAPE_CHARACTER; 
      } else{
        unmasked += ch;
      }
    }
    return unmasked;
  }

  protected maskForDefault(raw: string): string{
    let masked= '';
    for(let j=0; j<raw.length; j++){
      const ch=raw[j];
      if(ch===ESCAPE_CHARACTER || ch===DEFAULT_DELIMITER){
        masked += ESCAPE_CHARACTER;
      }
      masked += ch;
    }
    return masked;
  }

  //----contract helpers 
  protected assertValidIndexAsPrecondition(i: number): void{
    IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), 
    'index out of range');
  }

  protected assertValidInsertIndexAsPrecondition(i: number): void{
    IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), 
    'index out of range');
  }

  protected assertClassInvariant(): void{
    InvalidStateException.assert(this.getNoComponents() >= 0, 
    'number of components must be >= 0');
    InvalidStateException.assert(this.delimiter.length=== 1, 
    'delimiter must be a single character');
  }
}
