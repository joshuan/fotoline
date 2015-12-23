"use strict"
module.exports = (grunt) ->

  targetCoffee = 'coffee/_fotoline_compile.coffee'

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    concat:
      options:
        separator: '\n\n'
      fotoline:
        src: [
          'coffee/0_before.coffee'
          'coffee/Item.coffee'
          'coffee/Collection.coffee'
          'coffee/Row.coffee'
          'coffee/Fotoline.coffee'
          'coffee/Arrows.coffee'
          'coffee/Thumbs.coffee'
          'coffee/zy_init.coffee'
          'coffee/zz_after.coffee'
        ]
        dest: targetCoffee

    coffee:
      fotoline:
        files:
          'fotoline.js': targetCoffee

    clean: [ targetCoffee ]

    less:
      fotoline:
        files:
          "fotoline.css": "less/fotoline.less"

    mkdir:
      dist:
        options: [
          create: ['dist']
        ]

    autoprefixer:
      dist:
        options:
          browsers: ['last 2 versions', 'ie > 8', '> 1%']
        files:
          'fotoline.css': 'fotoline.css'

    cssmin:
      dist:
        options:
          keepSpecialComments: 0
        files:
          'dist/fotoline.css': 'fotoline.css'

    uglify:
      dist:
        files:
          'dist/fotoline.min.js': 'fotoline.js'

  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-mkdir')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask "default", [
    "concat:fotoline"
    "coffee:fotoline"
    "clean"
    "less:fotoline"
    "autoprefixer"
  ]

  grunt.registerTask "dist", [
    "default"
    "uglify"
    "cssmin"
  ]