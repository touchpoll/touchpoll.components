import {NumberToTimePipe} from './number.to.time.pipe';

describe('NumberToTimePipe', () => {
  let pipe: NumberToTimePipe;

  beforeEach(() => {
    pipe = new NumberToTimePipe();
  });

  it('create an instance', () => {
    const pipe = new NumberToTimePipe();
    expect(pipe).toBeTruthy();
  });

  it('should map null to 00:00:00', () => {
    // @ts-ignore
    expect(pipe.transform(null)).toEqual('00:00:00');
  });

  it('should map undefined to 00:00:00', () => {
    // @ts-ignore
    expect(pipe.transform(undefined)).toEqual('00:00:00');
  });

  it('should support int', () => {
    expect(() => pipe.transform(123456789.11)).not.toThrow();
  });

  it('should support int ', () => {
    expect(pipe.transform(1200)).toEqual('00:20:00');
  });

  it('минуты меньше 10', () => {
    expect(pipe.transform(120)).toEqual('00:02:00');
  });
  it('секунды меньше 10', () => {
    expect(pipe.transform(10)).toEqual('00:00:10');
  });
});
