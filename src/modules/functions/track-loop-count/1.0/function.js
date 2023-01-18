function updateLoop({  
  currentCount = 1, 
  maxLoopCount, 
  resetLoop = false 
}) { 
  if (resetLoop) { 
    return { newCount: 1, hasReachedMax: 1 > maxLoopCount };
  } 
  
  const newCount = currentCount + 1; 
  console.log({maxLoopCount, newCount})
  return { newCount, hasReachedMax: newCount > maxLoopCount };
}

module.exports = updateLoop;