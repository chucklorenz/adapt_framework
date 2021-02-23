module.exports = function(grunt, options) {
  return {
    dev: {
      options: {
        name: 'index',
        baseUrl: '<%= sourcedir %>',
        out: '<%= outputdir %>adapt/js/adapt.min.js',
        cachePath: '<%= outputdir %>.cache',
        // fetch these bower plugins an add them as dependencies to the app.js
        plugins: [
          '<%= sourcedir %>custom/*/package.json',
          '<%= sourcedir %>node_modules/*/package.json'
        ],
        pluginsPath: '<%= sourcedir %>/plugins.js',
        pluginsModule: 'plugins',
        pluginsFilter: function(filepath) {
          return grunt.config('helpers').includedFilter(filepath);
        },
        umdImports: [
          '../node_modules/object.assign/dist/browser.js',
          '../node_modules/react/umd/react.development.js',
          '../node_modules/react-dom/umd/react-dom.development.js',
          '../node_modules/html-react-parser/dist/html-react-parser.min.js'
        ],
        reactTemplates: [
          '<%= sourcedir %>core/templates/**/*.jsx',
          '<%= sourcedir %>components/*/templates/**/*.jsx',
          '<%= sourcedir %>extensions/*/templates/**/*.jsx',
          '<%= sourcedir %>menu/*/templates/**/*.jsx',
          '<%= sourcedir %>theme/*/templates/**/*.jsx'
        ],
        external: {
          jquery: 'empty:',
          underscore: 'empty:',
          backbone: 'empty:',
          modernizr: 'empty:',
          handlebars: 'empty:',
          velocity: 'empty:',
          imageReady: 'empty:',
          inview: 'empty:',
          a11y: 'empty:',
          scrollTo: 'empty:',
          libraries: 'empty:',
          bowser: 'empty:',
          'core/js/libraries/bowser': 'empty:',
          'coreJS/libraries/bowser': 'empty:'
        },
        map: {
          coreJS: 'core/js',
          coreViews: 'core/js/views',
          coreModels: 'core/js/models',
          coreCollections: 'core/js/collections',
          coreHelpers: 'core/js/helpers',
          // This library from the media component has a circular reference to core/js/adapt, it should be loaded after Adapt
          // It needs to be moved from the libraries folder to the js folder
          'libraries/mediaelement-fullscreen-hook': '../libraries/mediaelement-fullscreen-hook',
          'components/': '',
          'extensions/': '',
          'theme/': '',
          'menu/': '',
          'core': 'adapt-contrib-core'
        },
        generateSourceMaps: true
      },
      // newer configuration
      files: {
        '<%= outputdir %>adapt/js/adapt.min.js': [
          '<%= sourcedir %>/node_modules/*/js/*.js'
        ]
      }
    },
    compile: {
      options: {
        name: 'index',
        baseUrl: '<%= sourcedir %>',
        out: '<%= outputdir %>adapt/js/adapt.min.js',
        cachePath: '<%= outputdir %>.cache',
        // fetch these bower plugins an add them as dependencies to the app.js
        plugins: [
          '<%= sourcedir %>custom/*/package.json',
          '<%= sourcedir %>node_modules/*/package.json'
        ],
        pluginsPath: '<%= sourcedir %>/plugins.js',
        pluginsModule: 'plugins',
        pluginsFilter: function(filepath) {
          return grunt.config('helpers').includedFilter(filepath);
        },
        umdImports: [
          '../node_modules/object.assign/dist/browser.js',
          '../node_modules/react/umd/react.production.min.js',
          '../node_modules/react-dom/umd/react-dom.production.min.js',
          '../node_modules/html-react-parser/dist/html-react-parser.min.js'
        ],
        reactTemplates: [
          '<%= sourcedir %>core/templates/**/*.jsx',
          '<%= sourcedir %>components/*/templates/**/*.jsx',
          '<%= sourcedir %>extensions/*/templates/**/*.jsx',
          '<%= sourcedir %>menu/*/templates/**/*.jsx',
          '<%= sourcedir %>theme/*/templates/**/*.jsx'
        ],
        external: {
          jquery: 'empty:',
          underscore: 'empty:',
          backbone: 'empty:',
          modernizr: 'empty:',
          handlebars: 'empty:',
          velocity: 'empty:',
          imageReady: 'empty:',
          inview: 'empty:',
          a11y: 'empty:',
          scrollTo: 'empty:',
          libraries: 'empty:',
          bowser: 'empty:',
          'core/js/libraries/bowser': 'empty:',
          'coreJS/libraries/bowser': 'empty:'
        },
        map: {
          coreJS: 'core/js',
          coreViews: 'core/js/views',
          coreModels: 'core/js/models',
          coreCollections: 'core/js/collections',
          coreHelpers: 'core/js/helpers',
          // This library from the media component has a circular reference to core/js/adapt, it should be loaded after Adapt
          // It needs to be moved from the libraries folder to the js folder
          'libraries/mediaelement-fullscreen-hook': '../libraries/mediaelement-fullscreen-hook',
          'components/': '',
          'extensions/': '',
          'theme/': '',
          'menu/': '',
          'core': 'adapt-contrib-core'
        }
      }
    }
  };
};
