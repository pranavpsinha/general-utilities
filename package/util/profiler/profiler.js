require('dotenv');
const fs = require('fs');
const v8profiler = require('v8-profiler-next');

class Profiler {
  constructor(options) {
    const { title, active, outputDir } = options;
    this.title = title;
    this.active = active;
    this.outputDir = outputDir;
  }

  start(tag = 'GEN', prefix = 'EVMAN-') {
    if (this.active) {
      try {
        const filename = prefix + tag + this.title;
        v8profiler.startProfiling(filename, true);
      } catch (e) {
        console.log(e.message);
      }
    }
  }

  finish(tag = 'GEN', prefix = 'EVMAN-') {
    if (this.active) {
      try {
        const filename = prefix + tag + this.title;
        const profile = v8profiler.stopProfiling(filename);
        profile.export((error, result) => {
          if (error) {
            console.log('error', error);
          } else {
            fs.writeFileSync(
              `${process.cwd()}/${this.outputDir}/${filename}.log`,
              result
            );
            fs.writeFileSync(
              `${process.cwd()}/${this.outputDir}/${filename}.cpuprofile`,
              result
            );
          }
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  }
}

module.exports = new Profiler({
  active: 'Y' === process.env.PROFILER_ACTIVE,
  title: `-${new Date().getTime()}`,
  outputDir: process.env.PROFILER_OUTPUT_DIR || 'cpuprofile'
});