import app from './app.js';
import { port } from './config.js';

app
  .listen(port, () => {
    console.log(`server running on port : ${port}`);
  })
  .on('error', (e: any) => console.log(e));
