
import Vue from 'vue'

Vue.config.productionTip = false

// require all test files (files that ends with .spec.js)
const testsContext = require.context(`../components/${process.env.SCOPE}`, true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context(`../components`, true, /^\.(\.js|\.jsx)?$/)
srcContext.keys().forEach(srcContext)
