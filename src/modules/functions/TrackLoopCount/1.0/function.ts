interface UpdateLoopArgs {
  maxLoopCount: number;
  currentCount?: number;
  resetLoop?: boolean;
}

interface UpdateLoopReturn {
  newCount: number;
  hasReachedMax: boolean;
}

export default function updateLoop({  
  currentCount = 1, 
  maxLoopCount, 
  resetLoop = false 
}: UpdateLoopArgs): UpdateLoopReturn { 
  if (resetLoop) { 
    return { newCount: 1, hasReachedMax: 1 > maxLoopCount };
  } 
  
  const newCount = currentCount + 1; 
  return { newCount, hasReachedMax: newCount > maxLoopCount };
}
