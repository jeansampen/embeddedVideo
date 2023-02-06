module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            // For development, we want to alias the library to the source
            // 'expo-handle-touch-view': path.join(__dirname, './expo-handle-touch-view', 'src', 'index.ts'),
          },
        },
      ],
    ],
  };
};
