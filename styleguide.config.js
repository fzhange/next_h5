module.exports = {
    components: 'components/**/[A-Z]*.js',
    webpackConfig:{
        module:{
            rules:[
                {
                    // Babel loader will use your project’s babel.config.js
                    test: /\.jsx?$/, 
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    //Other loaders that are needed for your components
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },{
                    test: /\.less$/,
                    exclude: /node_modules/, 
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "less-loader", // compiles Less to CSS
                        options: {
                            lessOptions:{
                                "javascriptEnabled":true
                            }
                        }
                    }]
                }
            ]
        }   
    }
}