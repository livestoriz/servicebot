var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/build');
var APP_DIR = path.resolve(__dirname, 'views');
var PLUGIN_DIR = path.resolve(__dirname, 'plugins');

let glob = require("glob");
let pluginConfig = new Promise((resolve, reject) => {
    glob('./plugins/**/views/reducer.js', (err, files) => {
        let plugins = files.map((file) => {return file.split("/")[2]});
        console.log(plugins);
        resolve(plugins);
    })
})


var config = function(){
    return pluginConfig.then((plugins) => {
        console.log(plugins);
    return {
    entry: {
            "bundle" : ['react-hot-loader/patch', APP_DIR + '/index.jsx'],
            "plugins" : ['react-hot-loader/patch', PLUGIN_DIR + '/reducers.js']



    },
    output: {
        path: BUILD_DIR,
        publicPath: "/build/",
        filename: '[name].js'
    },

    devServer: {
        historyApiFallback: true,
        hot: true,
        contentBase: path.resolve(__dirname,'public'),
        inline: true,
        host: 'localhost', // Defaults to `localhost`
        port: 3002, // Defaults to 8080
        proxy: {
            '^/api/**': {
                target: 'http://localhost:3001',
                secure: false
            }
        }
    },
    externals : {
        servicebot_plugins : JSON.stringify(plugins)
    },
    module : {
        loaders : [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel-loader'
            },
            {
                test : /\.jsx?/,
                include : PLUGIN_DIR,
                loader : 'babel-loader'
            },

            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            { test: /js[\/\\].+\.(jsx|js)$/,
                loader: 'imports-loader?jQuery=jquery,$=jquery,this=>window'
            }

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            // (the commons chunk name)

            filename: "commons.js",
            // (the filename of the commons chunk)

            // minChunks: 3,
            // (Modules must be shared between 3 entries)

            // chunks: ["pageA", "pageB"],
            // (Only use these entries)
        })
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: JSON.stringify('production')
        //     }
        // })

    ]
}})};


module.exports = config;
