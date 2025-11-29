import { describe, it, expect } from 'vitest';

import { StringArrayName } from '../../../src/adap-b04/names/StringArrayName';
import { StringName } from '../../../src/adap-b04/names/StringName';
import { Name } from '../../../src/adap-b04/names/Name';

// Exception types used for contracts
import { IllegalArgumentException } from '../../../src/adap-b04/common/IllegalArgumentException';
import { InvalidStateException } from '../../../src/adap-b04/common/InvalidStateException';


// These [Precondition---Checks] verify that illegal method arguments trigger IllegalArgumentException as expected
/** ================================================================================== */
describe('Preconditions', ()=>{
  it('StringArrayName: getComponent/ index==size', ()=>{
    const testName= new StringArrayName(['oss', 'cs', 'fau']);
    expect(()=> testName.getComponent(3)).toThrow(IllegalArgumentException);
  });

  it('StringArrayName: getComponent/ negative index', ()=>{
    const testName= new StringArrayName(['oss', 'cs', 'fau']);
    expect(()=> testName.getComponent(-1)).toThrow(IllegalArgumentException);
  });

  it('StringArrayName: setComponent/ invalid index', ()=>{
    const testName= new StringArrayName(['oss', 'cs', 'fau']);
    expect(()=> testName.setComponent(5, 'de')).toThrow(IllegalArgumentException);
  });
  

  it('StringArrayName: insert', ()=>{
    const testName= new StringArrayName(['oss', 'cs']);
    expect(()=> testName.insert(-1, 'fau')).toThrow(IllegalArgumentException);
    expect(()=> testName.insert(3, 'fau')).toThrow(IllegalArgumentException);
  });

  it('StringArrayName: remove', ()=>{
    const testName= new StringArrayName(['oss', 'cs']);
    expect(()=> testName.remove(2)).toThrow(IllegalArgumentException);
  });

/** ================================================================================== */
  it('StringName: getComponent/ invalid index', ()=>{
    const testName= new StringName('oss.cs.fau');
    expect(()=> testName.getComponent(-1)).toThrow(IllegalArgumentException);
    expect(()=> testName.getComponent(3)).toThrow(IllegalArgumentException);
  });

  it('StringName: insert and remove', ()=>{
    const testName= new StringName('oss.cs');
    expect(()=> testName.insert(-1, 'fau')).toThrow(IllegalArgumentException);
    expect(()=> testName.remove(5)).toThrow(IllegalArgumentException);
  });

/** ================================================================================== */
  it('AbstractName: constructor/ single-char. delimiter', ()=>{
    expect(()=> new StringName('oss.cs.fau', '')).toThrow(IllegalArgumentException);
    expect(()=> new StringName('oss.cs.fau', '::')).toThrow(IllegalArgumentException);
  });

  it('concat', ()=>{
    const testName= new StringArrayName(['oss']);
    expect(()=> testName.concat(null as unknown as Name)).toThrow(IllegalArgumentException);
    expect(()=> testName.concat(undefined as unknown as Name)).toThrow(IllegalArgumentException);
  });
});


/** ================================================================================== */
// These tests confirm that valid operations don't violate the invariant
describe('Class invariants', ()=>{
  it('StringArrayName works properly', ()=>{
    const myName= new StringArrayName(['oss', 'cs']);

    expect(()=>{
      myName.append('fau');
      myName.insert(1, 'chair');
      myName.remove(0);
    }).not.toThrow(InvalidStateException);

    expect(myName.getNoComponents()).toBeGreaterThanOrEqual(0);
  });

  it('StringName is consistent', ()=>{
    const myName= new StringName('oss.cs');

    expect(()=>{
      myName.append('fau');
      myName.setComponent(0, 'cs');
      myName.remove(1);
    }).not.toThrow(InvalidStateException);

    const s= myName.asString('.');
    const parts= s=== '' ? 0 : s.split('.').length;
    expect(myName.getNoComponents()).toBe(parts=== 0 ? 0 : parts);
  });
});


/** ================================================================================== */
// These tests ensure that concat() works in the right way for the  component count and order
describe('Postconditions of concat', ()=>{
  it('StringArrayName.concat works properly', ()=>{
    const left= new StringArrayName(['oss', 'cs']);
    const right= new StringArrayName(['fau', 'de']);

    left.concat(right);

    expect(left.getNoComponents()).toBe(4);
    expect(left.asString('.')).toBe('oss.cs.fau.de');
  });

  it('StringName.concat works properly', ()=>{
    const left= new StringName('oss.cs');
    const right= new StringName('fau.de');

    left.concat(right);

    expect(left.getNoComponents()).toBe(4);
    expect(left.asString('.')).toBe('oss.cs.fau.de');
  });
});

