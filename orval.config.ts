import { defineConfig } from 'orval';

import 'dotenv/config';

const swaggerUrl = process.env.ORVAL_SWAGGER_URL ?? 'http://localhost:4000/swagger/v1/swagger.json';

export default defineConfig({
  lgym: {
    input: {
      target: swaggerUrl,
    },
    output: {
      mode: 'tags-split',
      target: 'api/generated/lgym.ts',
      schemas: 'api/generated/model',
      client: 'react-query',
      prettier: true,
      override: {
        mutator: {
          path: './api/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
