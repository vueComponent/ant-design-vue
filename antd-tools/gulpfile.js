'use strict'

// const install = require('./install')
// const runCmd = require('./runCmd')
// const getBabelCommonConfig = require('./getBabelCommonConfig')
// const merge2 = require('merge2')
// const { execSync } = require('child_process')
// const through2 = require('through2')
// const transformLess = require('./transformLess')
const webpack = require('webpack')
// const babel = require('gulp-babel')
// const argv = require('minimist')(process.argv.slice(2))
// const GitHub = require('github')

// const packageJson = require(`${process.cwd()}/package.json`)
// const getNpm = require('./getNpm')
// const selfPackage = require('../package.json')
// const chalk = require('chalk')
// const getNpmArgs = require('./utils/get-npm-args')
// const getChangelog = require('./utils/getChangelog')
const path = require('path')
// const watch = require('gulp-watch')
const gulp = require('gulp')
// const fs = require('fs')
const rimraf = require('rimraf')

const cwd = process.cwd()
// const libDir = path.join(cwd, 'lib')

function dist (done) {
  rimraf.sync(path.join(cwd, 'dist'))
  process.env.RUN_ENV = 'PRODUCTION'
  const webpackConfig = require(path.join(cwd, 'webpack.build.config.js'))
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    })
    console.log(buildInfo)
    done(0)
  })
}

gulp.task('dist', (done) => {
  dist(done)
})

