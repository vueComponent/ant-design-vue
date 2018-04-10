'use strict'
const webpack = require('webpack')
const through2 = require('through2')
const path = require('path')
const gulp = require('gulp')
const readline = require('readline')
const fs = require('fs')

const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const cwd = process.cwd()

function dist (done) {
  rimraf.sync(path.join(cwd, 'site-dist'))
  process.env.RUN_ENV = 'PRODUCTION'
  const webpackConfig = require(path.join(cwd, 'webpack.site.config.js'))
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

function copyHtml () {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(cwd, 'site/demo.js')),
  })

  rl.on('line', (line) => {
    const name = line.split('antd/')[1].split('/')[0]
    console.log('create path:', name)
    const toPath1 = `site-dist/components/${name}`
    const toPath2 = `site-dist/components/${name}-cn`
    rimraf.sync(path.join(cwd, toPath1))
    rimraf.sync(path.join(cwd, toPath2))
    mkdirp(path.join(cwd, toPath1), function () {
      fs.writeFileSync(path.join(cwd, `${toPath1}/index.html`), fs.readFileSync(path.join(cwd, 'site-dist/index.html')))
    })
    mkdirp(path.join(cwd, toPath2), function () {
      fs.writeFileSync(path.join(cwd, `${toPath2}/index.html`), fs.readFileSync(path.join(cwd, 'site-dist/index.html')))
    })
  })
  const source = [
    'docs/vue/*.md',
    // '!components/vc-slider/**/*', // exclude vc-slider
  ]
  gulp.src(source).pipe(through2.obj(function z (file, encoding, next) {
    const paths = file.path.split('/')
    const name = paths[paths.length - 1].split('.')[0]
    const toPaths = [
      'site-dist/docs',
      'site-dist/docs/vue',
      `site-dist/docs/vue/${name}`,
      `site-dist/docs/vue/${name}-cn`,
    ]
    toPaths.forEach(toPath => {
      mkdirp(path.join(cwd, toPath), function () {
        fs.writeFileSync(path.join(cwd, `${toPath}/index.html`), fs.readFileSync(path.join(cwd, 'site-dist/index.html')))
      })
    })
    next()
  }))
}

gulp.task('site-dist', (done) => {
  dist(() => {
    copyHtml()
  })
})
gulp.task('copy-html', () => {
  copyHtml()
})

