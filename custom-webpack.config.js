const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LwcWebpackPlugin = require("lwc-webpack-plugin");
const lwc_root = "./src";
const module_dir = path.resolve(process.cwd(), lwc_root, "modules");
//const { LwcModuleResolverPlugin } = require("lwc-webpack-plugin/dist/module-resolver");

const resources = [
  {from: path.resolve(process.cwd(), 'node_modules/@salesforce-ux/design-system/assets/icons'), to: path.join(process.cwd(), 'dist/slds/assets/icons')},
  {from: path.resolve(process.cwd(), 'node_modules/@salesforce-ux/design-system/assets/images'), to: path.join(process.cwd(), 'dist/slds/assets/images')},
  {from: path.resolve(process.cwd(), 'node_modules/@salesforce-ux/design-system/assets/styles'), to: path.join(process.cwd(), 'dist/slds/assets/styles')}
];

module.exports = function (angularConfig) {
  const lwcConfig = {
    plugins: [
      
      new LwcWebpackPlugin(),
      {
        apply(compiler) {
          compiler.options.module.rules.push({
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-typescript"],
                plugins: [
                  ["@babel/plugin-syntax-class-properties"],
                  ["@babel/plugin-syntax-decorators", { legacy: true }],
                ],
              },
            },
          });
        },
      },
      ...resources.length ? [new CopyWebpackPlugin({patterns: resources})] : []
    ],
    /*
    module: {
      rules: [
        {
          test: /\.(js|ts|html|css)$/,
          include: [module_dir, path.resolve(process.cwd(), "node_modules")],
          use: [
            {
              loader: require.resolve("lwc-webpack-plugin/dist/loader"),
              options: {
                stylesheetConfig: {},
                experimentalDynamicComponent: {},
              },
            },
          ],
        },
      ],
    },
    resolve: {
      symlinks: false,
      alias: {
        lwc: require.resolve("@lwc/module-resolver"),
      },
    },*/
  };

  /* Exclude LWC from angular compilation */
  const exclude = [module_dir];
  const lwc_config = JSON.parse(
    fs.readFileSync("lwc.config.json", { encoding: "UTF8" })
  );
  for (const module of lwc_config.modules) {
    for (const type of Object.keys(module)) {
      if (type === "npm") {
        exclude.push(path.resolve(process.cwd(), "node_modules", module[type]));
      } else if (type === "dir") {
        exclude.push(path.resolve(process.cwd(), module[type]));
      }
    }
  }

  for (const processor of angularConfig.module?.rules || []) {
    if (processor.exclude && Array.isArray(processor.exclude)) {
      processor.exclude.push(...exclude);
    } else {
      processor.exclude = exclude;
    }
  }

  return merge(angularConfig, lwcConfig);
};
