const path = require("path");

module.exports = {
  pages: {
    example: {
      entry: "example/main.ts",
      filename: "index.html",
      template: "example/public/index.html",
      title: 'Vue-Busy Example',
    }
  },
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    host: "0.0.0.0",
    port: 8000,
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
};
