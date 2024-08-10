import Fastify from 'fastify';
import cors from '@fastify/cors';
import compress from '@fastify/compress';
import stream from 'stream';

// import { generateAllTracksData } from './mockData';
// import { getBigwigData } from './bigWigData';
import getRealisticData from './realisticData';

const fastify = Fastify({
  logger: true
});

fastify.register(cors);
await fastify.register(
  compress,
  // { global: false }
);


// Declare a route
fastify.get('/', async (request, response) => {
  // getRealisticData().pipe(process.stdout);

  return response
    .type('application/json')
    .send(getRealisticData());
    // .compress(getRealisticData());
    // .send('{"foo": 1}')

  // const data = await getBigwigData();
  // response.send({ data });
  // response.send({ data: generateAllTracksData() });
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // console.log(`Server is now listening on ${address}`);
})
