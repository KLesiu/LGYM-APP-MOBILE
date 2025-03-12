import { codegen } from "swagger-axios-codegen";

// See docs: https://www.npmjs.com/package/swagger-axios-codegen
codegen({
  remoteUrl: "https://localhost:7075/swagger/v1/swagger.json",
  outputDir: "./services/api/",
  fileName: 'api.ts',
  strictNullChecks: true,
  useCustomerRequestInstance: false,
  methodNameMode: 'path',
  modelMode: "class",
  extendGenericType: [],
  useStaticMethod: true

});
