'use strict';
const webpack = require('webpack');
const through2 = require('through2');
const path = require('path');
const gulp = require('gulp');
const readline = require('readline');
const fs = require('fs');

const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const cwd = process.cwd();

function dist(done) {
  rimraf.sync(path.join(cwd, '_site'));
  process.env.RUN_ENV = 'PRODUCTION';
  const webpackConfig = require(path.join(cwd, 'webpack.site.config.js'));
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    });
    console.log(buildInfo);
    done(0);
  });
}

function copyHtml() {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(cwd, 'site/demoRoutes.js')),
  });
  fs.writeFileSync(
    path.join(cwd, '_site/404.html'),
    fs.readFileSync(path.join(cwd, 'site/404.html')),
  );
  fs.writeFileSync(
    path.join(cwd, '_site/index-cn.html'),
    fs.readFileSync(path.join(cwd, '_site/index.html')),
  );
  fs.writeFileSync(path.join(cwd, '_site/CNAME'), 'vue.ant.design');
  rl.on('line', line => {
    if (line.indexOf('path:') > -1) {
      const name = line.split("'")[1].split("'")[0];
      console.log('create path:', name);
      const toPaths = [
        `_site/components/${name}`,
        // `_site/components/${name}-cn`,
        `_site/iframe/${name}`,
        // `_site/iframe/${name}-cn`,
      ];
      toPaths.forEach(toPath => {
        rimraf.sync(path.join(cwd, toPath));
        mkdirp(path.join(cwd, toPath), function() {
          fs.writeFileSync(
            path.join(cwd, `${toPath}/index.html`),
            fs.readFileSync(path.join(cwd, '_site/index.html')),
          );
        });
      });
    }
  });
  const source = [
    'docs/vue/*.md',
    '*.md',
    // '!components/vc-slider/**/*', // exclude vc-slider
  ];
  gulp.src(source).pipe(
    through2.obj(function z(file, encoding, next) {
      const paths = file.path.split('/');
      const name = paths[paths.length - 1].split('.')[0].toLowerCase();
      const toPaths = [
        '_site/docs',
        '_site/docs/vue',
        `_site/docs/vue/${name}`,
        `_site/docs/vue/${name}-cn`,
      ];
      toPaths.forEach(toPath => {
        mkdirp(path.join(cwd, toPath), function() {
          fs.writeFileSync(
            path.join(cwd, `${toPath}/index.html`),
            fs.readFileSync(path.join(cwd, '_site/index.html')),
          );
        });
      });
      next();
    }),
  );
}

gulp.task(
  '_site',
  gulp.series(done => {
    dist(() => {
      copyHtml();
      done();
    });
  }),
);
gulp.task(
  'copy-html',
  gulp.series(() => {
    copyHtml();
  }),
);
