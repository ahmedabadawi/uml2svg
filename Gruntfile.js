module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', 
                    'example/**/*.js'],
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
        mocha: {
            all: {
                src: ['test/sequencediagram-spec.html'],
            },
            options: {
                run: true
            }
        },
//        mochaTest: {
//            test: {
//                options: {
//                    reporter: 'spec',
//                    spawn: false
//                },
//                //src: ['tests/**/*.js'],
//            }
//        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint','concat','mocha']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha');
    //grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['jshint','concat','mocha','uglify']);
    grunt.registerTask('development', ['watch']);
};
