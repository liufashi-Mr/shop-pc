const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  // 配置别名

  configureWebpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        "@": resolve("src"),
        components: resolve("src/components"),
        views: resolve("src/views"),
        store: resolve("src/store"),
        assets: resolve("src/assets"),
        utils: resolve("src/utils"),
        router: resolve("src/router"),
        api: resolve("src/api"),
        network: resolve("src/network"),
      },
    };
    config.externals = {
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      "ant-design-vue": "*",
    };
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]", // asset -> filename
          algorithm: "gzip",
          test: /\.(js|css)$/,
          threshold: 10240, // 达到10kb的静态文件进行压缩 按字节计算
          minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
          // deleteOriginalAssets: true, // 是否删除压缩的源文件
        }),
        // new BundleAnalyzerPlugin({
        //   analyzerMode: "server",
        //   generateStatsFile: true,
        //   statsOptions: { source: false },
        // })
      );
    }
  },
  // 配置代理
  devServer: {
    open: true,
    proxy: {
      "/dev-api": {
        target: "http://expo.liufashi.top/",
        // target:' http://www.stride.fun:3000',
        changeOrigin: true,
        pathRewrite: {
          "^/dev-api": "",
        },
      },
    },
  },
  // 第三方插件配置
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/assets/css/params.less")],
    },
  },
};
