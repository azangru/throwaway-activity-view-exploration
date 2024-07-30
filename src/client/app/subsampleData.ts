/**
 * if source data has 10,000 points
 * and the sample has 800 points
 * 
 * then:
 * sampling step = 10000 / 800
 */

/**
 * Using the stupidest sampling strategy possible — just pick out numbers after a step
 */
export const subsampleData = (sourceData: number[], sampleCount: number) => {
  const samplingStep = Math.floor(sourceData.length / sampleCount);

  const sampledData: number[] = [];
  
  for (let i = 0; i < sampleCount; i++) {
    const indexIntoOriginalData = i * samplingStep;
    const originalValues = sourceData.slice(indexIntoOriginalData, samplingStep);
    
    // get the average
    let newValue = 0;

    for (let j = 0; j < originalValues.length; j++) {
      newValue += originalValues[j];
    }
    newValue / originalValues.length;

    sampledData.push(newValue);
  }

  return sampledData;
};

export const compressData = (sourceData: number[]) => {
  let currentItem = {
    value: sourceData[0],
    count: 1,
    totalCount: sourceData.length
  };
  const result: (typeof currentItem)[] = [];

  for (let i = 1; i < sourceData.length; i++) {
    const value = sourceData[i];
    if (value === currentItem.value) {
      currentItem.count++;
    } else {
      result.push(currentItem);
      currentItem = { value, count: 1, totalCount: sourceData.length };
    }
  }

  result.push(currentItem);

  return result;
};

export const approximateData = (sourceData: number[]) => {
  return sourceData.map(number => Math.round(number * 100));
}
