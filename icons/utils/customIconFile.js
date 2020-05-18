const glob = require("glob");
const path = require("path");
const fs = require("fs");

const customIconsDir = "components/icon/customIcons";

class CustomIconFile {
  static generateCustomIconFile() {
    this.iconFiles = [];
    this.addIconFilesFromDirectory("outline");
    this.addIconFilesFromDirectory("fill");
    this.addIconFilesFromDirectory("twotone");

    const output = [];
    this.iconFiles.forEach((iconFile) => {
      const modulePath = iconFile.replace(/^components\/icon\/customIcons/, '');
      const moduleName = path.parse(modulePath).name;
      const moduleExport = `export {default as ${moduleName}} from '.${modulePath}';`;
      output.push(moduleExport);
    });
    fs.writeFileSync(`${customIconsDir}/customIcons.js`, output.join("\n"));
  }

  static addIconFilesFromDirectory(directory) {
    const files = glob(`${customIconsDir}/jsIcons/${directory}/*.js`, {sync: true});
    this.iconFiles = this.iconFiles.concat(files);
  }
}

module.exports = CustomIconFile;
