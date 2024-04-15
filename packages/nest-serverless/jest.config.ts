/* eslint-disable */
export default {
   displayName: 'nest-serverless',
   preset: '../../jest.preset.js',
   transform: {
      '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
   },
   moduleFileExtensions: ['ts', 'js', 'html'],
   coverageDirectory: '../../coverage/packages/nest-serverless',
};
