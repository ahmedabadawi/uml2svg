module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/uml2svg.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! uml2svg.js <%= grunt.template.today("yyyymmdd") %> */\n'
            },
            dist: {
                files: {
                    'dist/uml2svg.min.js' : '<%= concat.dist.dest %>'
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint','concat','uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint','concat','uglify']);
    grunt.registerTask('development', ['watch']);
};
