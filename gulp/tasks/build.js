const runSequence = require("run-sequence");

const quench = require("../quench/quench.js");
const createCopyTask = require("../quench/createCopyTask.js");
const createJsTask   = require("../quench/createJsTask.js");
const createCssTask   = require("../quench/createCssTask.js");
const createBrowserSyncTask = require("../quench/createBrowserSyncTask.js");

module.exports = function buildTask(projectRoot) {

  const buildDir = `${projectRoot}/build`;
  const clientDir = `${projectRoot}/client`;

  return function(){

    createCopyTask("build-copy", {
      src: [
        `${clientDir}/index.html`,
        `${clientDir}/img/**`
      ],
      dest: buildDir,
      base: `${clientDir}`
    });


    createJsTask("build-js", {
      dest: `${buildDir}/js/`,
      files: [
        {
          gulpTaskId: "build-js-index",
          entry: `${clientDir}/js/index.js`,
          filename: "index.js",
          watch: [
            `${clientDir}/js/**/*.js`,
            `${clientDir}/js/**/*.jsx`
          ]
        },
        {
          gulpTaskId: "build-js-polyfill",
          entry: `${clientDir}/polyfill/index.js`,
          filename: "polyfill.js",
          watch: [
            `${clientDir}/polyfill/**`
          ]
        }
      ]
    });

    createCssTask("build-css", {
      src: [
        `${clientDir}/scss/**/*.scss`,
        `${clientDir}/js/**/*.scss`
      ],
      dest: `${buildDir}/css/`,
      watch: [
        `${clientDir}/scss/**/*.scss`,
        `${clientDir}/js/**/*.scss`
      ],
      filename: "index.css"
    });


    createBrowserSyncTask("build-browser-sync", {
      server: buildDir
    });


    const buildTasks = ["build-js", "build-css", "build-copy"];

    if (quench.isWatching()){
      return runSequence(buildTasks, "build-browser-sync");
    }
    else {
      return runSequence(buildTasks);
    }

  };

};
