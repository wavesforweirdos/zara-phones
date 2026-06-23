module.exports = (api) => {
  const isTest = api.env('test');
  const isDevelopment = api.env('development');

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: isTest ? { node: 'current' } : 'defaults',
          modules: isTest ? 'commonjs' : false,
        },
      ],
      ['@babel/preset-react', { runtime: 'automatic', development: isDevelopment }],
    ],
  };
};
