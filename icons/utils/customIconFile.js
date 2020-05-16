const glob = require("glob");
const path = require("path");
const fs = require("fs");

class CustomIconFile {
  static generateCustomIconFile() {
    this.iconFiles = [];
    this.addIconFilesFromDirectory("lib/outline");
    this.addIconFilesFromDirectory("lib/fill");
    this.addIconFilesFromDirectory("lib/twotone");
    const output = [];
    this.iconFiles.forEach((iconFile) => {
      const modulePath = iconFile.replace(/^icons/, '');
      const moduleName = path.parse(modulePath).name;
      const moduleExport = `export {default as ${moduleName}} from '.${modulePath}';`;
      output.push(moduleExport);
    });
    fs.writeFileSync('icons/customIcons.js', output.join("\n"));
  }

  static addIconFilesFromDirectory(directory) {
    const files = glob(`icons/${directory}/*.js`, {sync: true});
    this.iconFiles = this.iconFiles.concat(files);
  }
}

module.exports = CustomIconFile;
