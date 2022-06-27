'use strict';

const { execSync } = require('child_process');
const fg = require('fast-glob');

const components = fg.sync('*', { cwd: 'components', onlyDirectories: true });
// precomputed scope
const scopeComplete = execSync('git status --porcelain || true')
  .toString()
  .trim()
  .split('\n')
  .find(r => ~r.indexOf('M  '))
  ?.replace(/(\/)/g, '%%')
  ?.match(/components%%((\w|-)*)/)?.[1];

/** @type {import('cz-git').CommitizenGitOptions} */
module.exports = {
  scopes: ['site', 'util', 'script', 'tool', ...components],
  scopeFilters: ['__tests__', '_util'],
  customScopesAlign: !scopeComplete ? 'top' : 'bottom',
  defaultScope: scopeComplete,
  maxHeaderLength: 100,
  allowEmptyIssuePrefixs: false,
  allowCustomIssuePrefixs: false,
};
