// Static assets resolved by webpack (asset/resource) and style-loader

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.scss';

// Replaced at build time by webpack DefinePlugin (see webpack.config.js and .env.example)
declare const process: {
  env: {
    API_BASE_URL: string;
    API_KEY: string;
    [key: string]: string | undefined;
  };
};
