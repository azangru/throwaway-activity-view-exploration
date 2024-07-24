/**
 * 10,000 data points per row
 * 50 rows
 */

const template1 = [
  0, 0, 1, 4, 3, 6, 0, 0, 9, 8
];

const template2 = [
  2, 0, 4, 9, 0, 6, 8, 8, 9, 8
];

const template3 = [
  9, 0, 8, 5, 6, 6, 6, 8, 9, 8
];


const templates = [
  template1,
  template2,
  template3
];

const getRandomTemplate = () => {
  const randomTemplateIndex = Math.round(Math.random() * (templates.length - 1));
  const template = templates[randomTemplateIndex];

  if (!template) {
    throw new Error('Failed to pick a template');
  }

  return template;
};

const generateTrackData = (template: number[]) => {
  const repeatTimes = 1000;
  const trackData = [];

  for (const num of template) {
    for (let i = 0; i < repeatTimes; i++) {
      trackData.push(num);
    }
  }

  return trackData;
};

export const generateAllTracksData = () => {
  const numTracks = 50;

  const allTracksData = [];
  
  for (let i = 0; i < numTracks; i++) {
    const template = getRandomTemplate();
    const trackData = generateTrackData(template);
    allTracksData.push(trackData);
  }

  return allTracksData;
};
