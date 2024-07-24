import Fastify from 'fastify';
import cors from '@fastify/cors';

// import { generateAllTracksData } from './mockData';
import { getBigwigData } from './bigWigData';

const fastify = Fastify({
  logger: true
});

fastify.register(cors);


// Declare a route
fastify.get('/', async (request, response) => {
  const data = await getBigwigData();
  response.send({ data });
  // response.send({ data: generateAllTracksData() });
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // console.log(`Server is now listening on ${address}`);
})
