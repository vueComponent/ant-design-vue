const glob = require("glob");
const fs = require("fs");
const path = require("path");
const cheerio = require('cheerio');

class SvgConverter {
  constructor() {
    this.addSvgFiles();
    console.log('CONVERTING SVG => ANT ICON');
    this.svgFiles.forEach((file) => this.convertSvgToAntIcon(file));
  }

  convertSvgToAntIcon(svgFileName) {
    const svg = fs.readFileSync(svgFileName).toString();
    const svgPath = path.parse(svgFileName);
    const iconName = svgPath.name;
    const type = svgPath.dir.split('/').pop().toLowerCase();
    const moduleName = this.getModuleName(type, iconName);
    const iconFileContent = this.getAntIconFromSvg(moduleName, iconName, type, svg);
    this.createAntIcon(type, moduleName, iconFileContent);
    console.log(`[${svgFileName}] => ${moduleName}`);
  }

  getAntIconFromSvg(moduleName, iconName, type, svg) {
    const svgNode = cheerio.load(svg);
    const nodeTree = this.getNodeTree(svgNode('svg').first().get(0));

    const iconComponent = {
      name: iconName,
      theme: type,
      icon: nodeTree,
    };

    const formattedIconComponent = JSON.stringify(iconComponent, null, 4);
    return `const ${moduleName}=${formattedIconComponent};\nexport default ${moduleName};`;
  }

  getNodeTree(node) {
    const attributes = {};
    Object.keys(node.attribs).map((name) => {
      attributes[name] = node.attribs[name];
    });

    const item = {
      tag: node.tagName,
      attrs: attributes,
    };

    const children = [];
    for (const childNode of node.children) {
      children.push(this.getNodeTree(childNode));
    }

    if (children.length !== 0) {
      item.children = children;
    }

    return item;
  }

  capitalizeString(str) {
    str = str.replace(/-(.)/g, (matched, char) => {
      return char.toUpperCase();
    }).replace(/-/g, '');

    if (str.length) {
      str = str.charAt(0).toUpperCase() + str.slice(1);
    }

    return str;
  }

  getModuleName(type, iconName) {
    return this.capitalizeString(iconName) + this.capitalizeString(type);
  }

  createAntIcon(type, moduleName, iconFileContent) {
    const dirName = `icons/lib/${type}`;
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
    fs.writeFileSync(`${dirName}/${moduleName}.js`, iconFileContent);
  }

  addSvgFiles() {
    this.svgFiles = [];
    this.addSvgFilesFromDirectory("src/outline");
    this.addSvgFilesFromDirectory("src/fill");
    this.addSvgFilesFromDirectory("src/twotone");
  }

  addSvgFilesFromDirectory(directory) {
    const files = glob(`icons/${directory}/*.svg`, {sync: true});
    this.svgFiles = this.svgFiles.concat(files);
  }
}

new SvgConverter();
