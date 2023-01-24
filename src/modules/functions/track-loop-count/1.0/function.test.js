const updateLoop = require('./function');

describe('track loop count', () => {
  it('Should return the a newCount that is one greater than the currentCount', () => {
    const currentCount = 3;

    const { newCount } = updateLoop({ currentCount, maxLoopCount: 5 });

    const diff = newCount - currentCount;
    expect(newCount).toEqual(4);
    expect(diff).toEqual(1);
  });

  it('Should return false for hasReachedMax when newCount is smaller than the maxCount', () => {
    const currentCount = 3;
    const maxLoopCount = 5;

    const { hasReachedMax, newCount } = updateLoop({ currentCount, maxLoopCount });

    expect(newCount).toEqual(4);
    expect(hasReachedMax).toEqual(false);
  });

  it('Should return true for hasReachedMax when newCount is larger than the maxCount', () => {
    const currentCount = 5;
    const maxLoopCount = 5;

    const { hasReachedMax, newCount } = updateLoop({ currentCount, maxLoopCount });

    expect(newCount).toEqual(6);
    expect(hasReachedMax).toEqual(true);
  });

  it('Should return a newCount of 2 if currentCount is not provided', () => {
    const { newCount } = updateLoop({ maxLoopCount: 5 });

    expect(newCount).toEqual(2);
  });

  it('Should return newCount of 1 if resetLoop is true', () => {
    const { newCount } = updateLoop({ maxLoopCount: 5, resetLoop: 1 });

    expect(newCount).toEqual(1);
  });
});
