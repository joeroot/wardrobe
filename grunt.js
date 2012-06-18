module.exports = function(grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! \n<%= pkg.name %>: <%= pkg.description %> \n' +
        'Homepage: <%= pkg.homepage %> \n' +
        'By: <%= pkg.author %> \n' +
        'Version: <%= pkg.version %> \n' +
        'Released: <%= grunt.template.today("dd-mm-yy") %>\n*/'
    },
    lint: {
      all: ['grunt.js', 'src/*.js', 'src/**/*.js', 'test/**/*.js']
    },
    concat: {
      dist: {
        src: ['<banner>', 'src/wardrobe.js', 'src/**/*.js'],
        dest: 'lib/wardrobe.js',
        separator: '\n\n'
      },
      command: {
        src: ['src/command.js', 'src/wardrobe.js', 'src/**/*.js'],
        dest: 'lib/wardrobe.command.js',
        separator: '\n\n'
      }
    },
    min: {
      dist: {
        src: ['lib/wardrobe.js'],
        dest: 'lib/wardrobe.min.js'
      }
    }
  });

  grunt.registerTask('default', 'lint concat min'); // add qunit tests, 'quint'
};