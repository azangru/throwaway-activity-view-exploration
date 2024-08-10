import fs from 'node:fs';
import * as url from 'node:url';
import path from 'node:path';


const getDataFileStream = () => {
  const dirname = url.fileURLToPath(new URL('.', import.meta.url))
  const pathToFile = path.resolve(dirname, '../../data/new_activity_data_normalised.json');
  return fs.createReadStream(pathToFile);
  // return fs.readFileSync(pathToFile);
};

export default getDataFileStream;
