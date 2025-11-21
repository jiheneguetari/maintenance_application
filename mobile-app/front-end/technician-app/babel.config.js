module.exports = function(api) {
  // Configure le cache de Babel, standard pour Expo
  api.cache(true); 

  return {
    presets: ['babel-preset-expo'], 
    plugins: [
      'react-native-reanimated/plugin', 
    ],
  };
};