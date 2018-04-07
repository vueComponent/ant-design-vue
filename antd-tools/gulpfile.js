'use strict'

// const install = require('./install')
// const runCmd = require('./runCmd')
const getBabelCommonConfig = require('./getBabelCommonConfig')
const merge2 = require('merge2')
// const { execSync } = require('child_process')
const through2 = require('through2')
const transformLess = require('./transformLess')
const webpack = require('webpack')
const babel = require('gulp-babel')
// const argv = require('minimist')(process.argv.slice(2))
// const GitHub = require('github')

// const packageJson = require(`${process.cwd()}/package.json`)
// const getNpm = require('./getNpm')
// const selfPackage = require('../package.json')
// const chalk = require('chalk')
// const getNpmArgs = require('./utils/get-npm-args')

const path = require('path')
// const watch = require('gulp-watch')
const gulp = require('gulp')
// const fs = require('fs')
const rimraf = require('rimraf')
const replaceLib = require('./replaceLib')
const stripCode = require('gulp-strip-code')

const cwd = process.cwd()
const libDir = path.join(cwd, 'lib')
const esDir = path.join(cwd, 'es')

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

function babelify (js, modules) {
  const babelConfig = getBabelCommonConfig(modules)
  delete babelConfig.cacheDirectory
  if (modules === false) {
    babelConfig.plugins.push(replaceLib)
  } else {
    babelConfig.plugins.push(require.resolve('babel-plugin-add-module-exports'))
  }
  let stream = js.pipe(babel(babelConfig))
    .pipe(through2.obj(function z (file, encoding, next) {
      this.push(file.clone())
      if (file.path.match(/\/style\/index\.js/)) {
        const content = file.contents.toString(encoding)
        file.contents = Buffer.from(content
          .replace(/\/style\/?'/g, '/style/css\'')
          .replace(/\.less/g, '.css'))
        file.path = file.path.replace(/index\.js/, 'css.js')
        this.push(file)
        next()
      } else {
        next()
      }
    }))
  if (modules === false) {
    stream = stream.pipe(stripCode({
      start_comment: '@remove-on-es-build-begin',
      end_comment: '@remove-on-es-build-end',
    }))
  }
  return stream.pipe(gulp.dest(modules === false ? esDir : libDir))
}

function compile (modules) {
  rimraf.sync(modules !== false ? libDir : esDir)
  const less = gulp.src(['components/**/*.less'])
    .pipe(through2.obj(function (file, encoding, next) {
      this.push(file.clone())
      if (file.path.match(/\/style\/index\.less$/) || file.path.match(/\/style\/v2-compatible-reset\.less$/)) {
        transformLess(file.path).then((css) => {
          file.contents = Buffer.from(css)
          file.path = file.path.replace(/\.less$/, '.css')
          this.push(file)
          next()
        }).catch((e) => {
          console.error(e)
        })
      } else {
        next()
      }
    }))
    .pipe(gulp.dest(modules === false ? esDir : libDir))
  const assets = gulp.src(['components/**/*.@(png|svg)']).pipe(gulp.dest(modules === false ? esDir : libDir))

  const source = [
    'components/**/*.js',
    'components/**/*.jsx',
    // '!components/vc-slider/**/*', // exclude vc-slider
  ]
  const jsFilesStream = babelify(gulp.src(source), modules)
  return merge2([less, jsFilesStream, assets])
}

gulp.task('dist', (done) => {
  dist(done)
})
gulp.task('compile', ['compile-with-es'], () => {
  compile()
})
gulp.task('compile-with-es', () => {
  compile(false)
})
