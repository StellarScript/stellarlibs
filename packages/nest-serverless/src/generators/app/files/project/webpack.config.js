const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

module.exports = {
   output: {
      path: join(__dirname, '<%= offsetFromRoot %>dist/<%= projectName %>'),
      libraryTarget: 'umd',
   },
   plugins: [
      new NxWebpackPlugin({
         target: 'node20',
         compiler: 'tsc',
         main: './src/main.ts',
         tsConfig: './tsconfig.app.json',
         outputHashing: 'none',
         generatePackageJson: true,
         externalDependencies: [
            '@nestjs/websockets/socket-module',
            '@nestjs/microservices/microservices-module',
            '@nestjs/microservices',
            'cache-manager',
            'kuromoji',
            'terminal-kit',
         ],
      }),
   ],
};
