const libDir = process.env.LIB_DIR;

const transformIgnorePatterns = [
  '/dist/',
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  // 'node_modules/(?!.*(@babel|lodash-es))',
  'node_modules/(?!@ant-design/icons-vue|@ant-design/icons-svg|lodash-es)/',
];
const testPathIgnorePatterns = ['/node_modules/', 'node'];

function getTestRegex(libDir) {
  if (libDir === 'dist') {
    return 'demo\\.test\\.js$';
  }
  return '.*\\.test\\.(j|t)sx?$';
}
module.exports = {
  verbose: true,
  setupFiles: ['./tests/setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'vue', 'md', 'jpg'],
  modulePathIgnorePatterns: ['/_site/'],
  testPathIgnorePatterns: testPathIgnorePatterns,
  transform: {
    '\\.(vue|md)$': '<rootDir>/node_modules/@vue/vue3-jest',
    '\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest',
    '\\.svg$': '<rootDir>/node_modules/jest-transform-stub',
  },
  testRegex: getTestRegex(libDir),
  moduleNameMapper: {
    '^@/(.*)$/': '<rootDir>/$1',
    'ant-design-vue$/': '<rootDir>/components/index.ts',
    'ant-design-vue/es/': '<rootDir>/components',
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  collectCoverage: process.env.COVERAGE === 'true',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,vue}',
    '!components/*/style/index.{js,jsx}',
    '!components/style/*.{js,jsx}',
    '!components/*/locale/*.{js,jsx}',
    '!components/*/__tests__/**/type.{js,jsx}',
    '!components/vc-*/**/*',
    '!components/*/demo/**/*',
    '!components/_util/**/*',
    '!components/align/**/*',
    '!components/trigger/**/*',
    '!components/style.js',
    '!**/node_modules/**',
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
    customExportConditions: ['node', 'node-addons'],
  },
  transformIgnorePatterns,
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
