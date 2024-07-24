import * as url from 'node:url';
import path from 'node:path';
import { BigWig } from '@gmod/bbi';

/**
 * Available since Node 20.11
 * import.meta.dirname  // The current module's directory name
 * import.meta.filename // The current module's file name
 */

const dirname = url.fileURLToPath(new URL('.', import.meta.url))

const pathToFile = path.resolve(dirname, '../../data/atac_seq_brain_f_9_mo.bw');

const file = new BigWig({
  path: pathToFile
});


export const getBigwigData = async () => {
  const header = await file.getHeader();

  // console.log('header', header);

  const data = await file.getFeatures('25', 3551249, 3651249);

  return data.map(item => item.score);
};
