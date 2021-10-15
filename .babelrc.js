module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: [
            'IE >= 11',
            'Edge >= 16',
            'Chrome >= 64',
            'Firefox >= 58',
            'Safari >= 11'
          ]
        }
      }
    ]
  ]
};
