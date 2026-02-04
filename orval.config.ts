import { defineConfig } from 'orval';

export default defineConfig({
  lgym: {
    input: {
      target: 'http://localhost:4000/swagger/v1/swagger.json',
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
