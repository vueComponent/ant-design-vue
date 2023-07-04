/* eslint-disable no-console */
const { getProjectPath, getConfig } = require('./utils/projectHelper');
const runCmd = require('./runCmd');
const getBabelCommonConfig = require('./getBabelCommonConfig');
const merge2 = require('merge2');
const { execSync } = require('child_process');
const through2 = require('through2');
const transformLess = require('./transformLess');
const webpack = require('webpack');
const babel = require('gulp-babel');
const argv = require('minimist')(process.argv.slice(2));
const { Octokit } = require('@octokit/rest');

// const getNpm = require('./getNpm')
// const selfPackage = require('../package.json')
const chalk = require('chalk');
const getNpmArgs = require('./utils/get-npm-args');
const getChangelog = require('./utils/getChangelog');
const path = require('path');
// const watch = require('gulp-watch')
const ts = require('gulp-typescript');
const gulp = require('gulp');
const fs = require('fs');
const rimraf = require('rimraf');
const stripCode = require('gulp-strip-code');
const compareVersions = require('compare-versions');
const getTSCommonConfig = require('./getTSCommonConfig');
const replaceLib = require('./replaceLib');
const sortApiTable = require('./sortApiTable');

const packageJson = require(getProjectPath('package.json'));
const tsDefaultReporter = ts.reporter.defaultReporter();
const cwd = process.cwd();
const libDir = getProjectPath('lib');
const esDir = getProjectPath('es');

const tsConfig = getTSCommonConfig();

function dist(done) {
  rimraf.sync(path.join(cwd, 'dist'));
  process.env.RUN_ENV = 'PRODUCTION';
  const webpackConfig = require(getProjectPath('webpack.build.conf.js'));
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();
    const { dist: { finalize } = {}, bail } = getConfig();

    if (stats.hasErrors()) {
      (info.errors || []).forEach(error => {
        console.error(error);
      });
      // https://github.com/ant-design/ant-design/pull/31662
      if (bail) {
        process.exit(1);
      }
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
    // Additional process of dist finalize
    if (finalize) {
      console.log('[Dist] Finalization...');
      finalize();
    }
    done(0);
  });
}

const tsFiles = ['**/*.ts', '**/*.tsx', '!node_modules/**/*.*', 'typings/**/*.d.ts'];

function compileTs(stream) {
  return stream
    .pipe(ts(tsConfig))
    .js.pipe(
      through2.obj(function (file, encoding, next) {
        // console.log(file.path, file.base);
        file.path = file.path.replace(/\.[jt]sx$/, '.js');
        this.push(file);
        next();
      }),
    )
    .pipe(gulp.dest(process.cwd()));
}

gulp.task('tsc', () =>
  compileTs(
    gulp.src(tsFiles, {
      base: cwd,
    }),
  ),
);

function babelify(js, modules) {
  const babelConfig = getBabelCommonConfig(modules);
  babelConfig.babelrc = false;
  delete babelConfig.cacheDirectory;
  if (modules === false) {
    babelConfig.plugins.push(replaceLib);
  }
  const stream = js.pipe(babel(babelConfig)).pipe(
    through2.obj(function z(file, encoding, next) {
      this.push(file.clone());
      if (file.path.match(/\/style\/index\.(js|jsx|ts|tsx)$/)) {
        const content = file.contents.toString(encoding);
        file.contents = Buffer.from(
          content
            .replace(/\/style\/?'/g, "/style/css'")
            .replace(/\/style\/?"/g, '/style/css"')
            .replace(/\.less/g, '.css'),
        );
        file.path = file.path.replace(/index\.(js|jsx|ts|tsx)$/, 'css.js');
        this.push(file);
      } else if (modules !== false) {
        const content = file.contents.toString(encoding);
        file.contents = Buffer.from(
          content
            .replace(/lodash-es/g, 'lodash')
            .replace(/@ant-design\/icons-vue/g, '@ant-design/icons-vue/lib/icons'),
        );
        this.push(file);
      }
      next();
    }),
  );
  return stream.pipe(gulp.dest(modules === false ? esDir : libDir));
}

function compile(modules) {
  const { compile: { transformTSFile, transformFile, includeLessFile = [] } = {} } = getConfig();
  rimraf.sync(modules !== false ? libDir : esDir);

  // =============================== LESS ===============================
  const less = gulp
    .src(['components/**/*.less'])
    .pipe(
      through2.obj(function (file, encoding, next) {
        // Replace content
        const cloneFile = file.clone();
        const content = file.contents.toString().replace(/^\uFEFF/, '');

        cloneFile.contents = Buffer.from(content);

        // Clone for css here since `this.push` will modify file.path
        const cloneCssFile = cloneFile.clone();

        this.push(cloneFile);

        // Transform less file
        if (
          file.path.match(/(\/|\\)style(\/|\\)index\.less$/) ||
          file.path.match(/(\/|\\)style(\/|\\)v2-compatible-reset\.less$/) ||
          includeLessFile.some(regex => file.path.match(regex))
        ) {
          transformLess(cloneCssFile.contents.toString(), cloneCssFile.path)
            .then(css => {
              cloneCssFile.contents = Buffer.from(css);
              cloneCssFile.path = cloneCssFile.path.replace(/\.less$/, '.css');
              this.push(cloneCssFile);
              next();
            })
            .catch(e => {
              console.error(e);
            });
        } else {
          next();
        }
      }),
    )
    .pipe(gulp.dest(modules === false ? esDir : libDir));
  const assets = gulp
    .src(['components/**/*.@(png|svg)'])
    .pipe(gulp.dest(modules === false ? esDir : libDir));
  let error = 0;

  // =============================== FILE ===============================
  let transformFileStream;

  if (transformFile) {
    transformFileStream = gulp
      .src(['components/**/*.tsx'])
      .pipe(
        through2.obj(function (file, encoding, next) {
          let nextFile = transformFile(file) || file;
          nextFile = Array.isArray(nextFile) ? nextFile : [nextFile];
          nextFile.forEach(f => this.push(f));
          next();
        }),
      )
      .pipe(gulp.dest(modules === false ? esDir : libDir));
  }

  // ================================ TS ================================
  const source = [
    'components/**/*.js',
    'components/**/*.jsx',
    'components/**/*.tsx',
    'components/**/*.ts',
    'typings/**/*.d.ts',
    '!components/*/__tests__/*',
  ];

  // Strip content if needed
  let sourceStream = gulp.src(source);
  if (modules === false) {
    sourceStream = sourceStream.pipe(
      stripCode({
        start_comment: '@remove-on-es-build-begin',
        end_comment: '@remove-on-es-build-end',
      }),
    );
  }

  if (transformTSFile) {
    sourceStream = sourceStream.pipe(
      through2.obj(function (file, encoding, next) {
        let nextFile = transformTSFile(file) || file;
        nextFile = Array.isArray(nextFile) ? nextFile : [nextFile];
        nextFile.forEach(f => this.push(f));
        next();
      }),
    );
  }

  const tsResult = sourceStream.pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e);
        error = 1;
      },
      finish: tsDefaultReporter.finish,
    }),
  );

  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1);
    }
  }

  tsResult.on('finish', check);
  tsResult.on('end', check);
  const tsFilesStream = babelify(tsResult.js, modules);
  const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? esDir : libDir));
  return merge2([less, tsFilesStream, tsd, assets, transformFileStream].filter(s => s));
}

function tag() {
  console.log('tagging');
  const { version } = packageJson;
  execSync(`git config --global user.email ${process.env.GITHUB_USER_EMAIL}`);
  execSync(`git config --global user.name ${process.env.GITHUB_USER_NAME}`);
  execSync(`git tag ${version}`);
  execSync(
    `git push https://${process.env.GITHUB_TOKEN}@github.com/vueComponent/ant-design-vue.git ${version}:${version}`,
  );
  execSync(
    `git push https://${process.env.GITHUB_TOKEN}@github.com/vueComponent/ant-design-vue.git master:master`,
  );
  console.log('tagged');
}

function githubRelease(done) {
  const changlogFiles = [
    path.join(cwd, 'CHANGELOG.en-US.md'),
    path.join(cwd, 'CHANGELOG.zh-CN.md'),
  ];
  console.log('creating release on GitHub');
  if (!process.env.GITHUB_TOKEN) {
    console.log('no GitHub token found, skip');
    return;
  }
  if (!changlogFiles.every(file => fs.existsSync(file))) {
    console.log('no changelog found, skip');
    return;
  }
  const github = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  const date = new Date();
  const { version } = packageJson;
  const enChangelog = getChangelog(changlogFiles[0], version);
  const cnChangelog = getChangelog(changlogFiles[1], version);
  const changelog = [
    `\`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}\``,
    enChangelog,
    '\n',
    '---',
    '\n',
    cnChangelog,
  ].join('\n');
  const [_, owner, repo] = execSync('git remote get-url origin') // eslint-disable-line
    .toString()
    .match(/github.com[:/](.+)\/(.+)\.git/);
  github.repos
    .createRelease({
      owner,
      repo,
      tag_name: version,
      name: version,
      body: changelog,
    })
    .then(() => {
      done();
    })
    .catch(err => {
      console.log(err);
    });
}

gulp.task(
  'tag',
  gulp.series(done => {
    tag();
    githubRelease(done);
  }),
);

gulp.task(
  'check-git',
  gulp.series(done => {
    runCmd('git', ['status', '--porcelain'], (code, result) => {
      if (/^\?\?/m.test(result)) {
        return done(`There are untracked files in the working tree.\n${result}
      `);
      }
      if (/^([ADRM]| [ADRM])/m.test(result)) {
        return done(`There are uncommitted changes in the working tree.\n${result}
      `);
      }
      return done();
    });
  }),
);

function publish(tagString, done) {
  let args = ['publish', '--with-antd-tools'];
  if (tagString) {
    args = args.concat(['--tag', tagString]);
  }
  const publishNpm = process.env.PUBLISH_NPM_CLI || 'npm';
  runCmd(publishNpm, args, code => {
    tag();
    githubRelease(() => {
      done(code);
    });
  });
}

function pub(done) {
  const notOk = !packageJson.version.match(/^\d+\.\d+\.\d+$/);
  let tagString;
  if (argv['npm-tag']) {
    tagString = argv['npm-tag'];
  }
  if (!tagString && notOk) {
    tagString = 'next';
  }
  if (packageJson.scripts['pre-publish']) {
    runCmd('npm', ['run', 'pre-publish'], code2 => {
      if (code2) {
        done(code2);
        return;
      }
      publish(tagString, done);
    });
  } else {
    publish(tagString, done);
  }
}

let startTime = new Date();
gulp.task('compile-with-es', done => {
  console.log('start compile at ', startTime);
  console.log('[Parallel] Compile to es...');
  compile(false).on('finish', done);
});

gulp.task('compile-with-lib', done => {
  console.log('[Parallel] Compile to js...');
  compile().on('finish', done);
});

gulp.task('compile-finalize', done => {
  // Additional process of compile finalize
  const { compile: { finalize } = {} } = getConfig();
  if (finalize) {
    console.log('[Compile] Finalization...');
    finalize();
  }
  done();
});

gulp.task(
  'compile',
  gulp.series(gulp.parallel('compile-with-es', 'compile-with-lib'), 'compile-finalize', done => {
    console.log('end compile at ', new Date());
    console.log('compile time ', (new Date() - startTime) / 1000, 's');
    done();
  }),
);

gulp.task(
  'dist',
  gulp.series(done => {
    dist(done);
  }),
);

gulp.task(
  'pub',
  gulp.series('check-git', 'compile', 'dist', done => {
    // if (!process.env.GITHUB_TOKEN) {
    //   console.log('no GitHub token found, skip');
    // } else {
    //   pub(done);
    // }
    pub(done);
  }),
);

gulp.task(
  'pub-with-ci',
  gulp.series(done => {
    if (!process.env.NPM_TOKEN) {
      console.log('no NPM token found, skip');
    } else {
      const github = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });
      const [_, owner, repo] = execSync('git remote get-url origin') // eslint-disable-line
        .toString()
        .match(/github.com[:/](.+)\/(.+)\.git/);
      const getLatestRelease = github.repos.getLatestRelease({
        owner,
        repo,
      });
      const listCommits = github.repos.listCommits({
        owner,
        repo,
        per_page: 1,
      });
      Promise.all([getLatestRelease, listCommits]).then(([latestRelease, commits]) => {
        const preVersion = latestRelease.data.tag_name;
        const { version } = packageJson;
        const [_, newVersion] = commits.data[0].commit.message.trim().match(/bump (.+)/) || []; // eslint-disable-line
        if (
          compareVersions(version, preVersion) === 1 &&
          newVersion &&
          newVersion.trim() === version
        ) {
          // eslint-disable-next-line no-unused-vars
          runCmd('npm', ['run', 'pub'], code => {
            done();
          });
        } else {
          console.log('donot need publish' + version);
        }
      });
    }
  }),
);

gulp.task(
  'guard',
  gulp.series(done => {
    function reportError() {
      console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
      console.log(chalk.bgRed('!! `npm publish` is forbidden for this package. !!'));
      console.log(chalk.bgRed('!! Use `npm run pub` instead.        !!'));
      console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
    }
    const npmArgs = getNpmArgs();
    if (npmArgs) {
      for (let arg = npmArgs.shift(); arg; arg = npmArgs.shift()) {
        if (
          /^pu(b(l(i(sh?)?)?)?)?$/.test(arg) &&
          npmArgs.indexOf('--with-antd-tools') < 0 &&
          !process.env.npm_config_with_antd_tools
        ) {
          reportError();
          done(1);
          return;
        }
      }
    }
    done();
  }),
);

gulp.task(
  'sort-api-table',
  gulp.series(done => {
    sortApiTable();
    done();
  }),
);
