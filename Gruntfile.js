module.exports = function (grunt) {

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('src/manifest.json'),
        config: {
            tempDir: (grunt.cli.tasks[0] === 'tgut') ? 'build/tgut-temp/' : 'build/tgs-temp/',
            buildName: (grunt.cli.tasks[0] === 'tgut') ? 'tgut-<%= manifest.version %>' : 'tgs-<%= manifest.version %>'
        },
        copy: {
            main: {
                expand: true,
                src: 'src/**',
                dest: '<%= config.tempDir %>'
            }
        },
        'string-replace': {
            debug: {
                files: {
                    '<%= config.tempDir %>src/js/': '<%= config.tempDir %>src/js/gsUtils.js'
                },
                options: {
                    replacements: [{
                        pattern: /debugInfo\s*=\s*true/,
                        replacement: 'debugInfo = false'
                    },{
                        pattern: /debugError\s*=\s*true/,
                        replacement: 'debugError = false'
                    }]
                }
            },
            localesTgut: {
                files: {
                    '<%= config.tempDir %>src/_locales/': '<%= config.tempDir %>src/_locales/**'
                },
                options: {
                    replacements: [{
                        pattern: /The Great Suspender/ig,
                        replacement: 'The Great Update Tester'
                    }]
                }
            },
            noticeTgut: {
                files: {
                    '<%= config.tempDir %>src/js/': '<%= config.tempDir %>src/js/background.js'
                },
                options: {
                    replacements: [{
                        pattern: /greatsuspender\.github\.io\/notice\.json/,
                        replacement: 'greatsuspender.github.io/notice-tgut.json'
                    }]
                }
            }
        },
        crx: {
            public: {
                src: [
                    '<%= config.tempDir %>src/**/*',
                    '!**/html2canvas.js',
                    '!**/Thumbs.db'
                ],
                dest: 'build/zip/<%= config.buildName %>.zip'
            },
            private: {
                src: [
                    '<%= config.tempDir %>src/**/*',
                    '!**/html2canvas.js',
                    '!**/Thumbs.db'
                ],
                dest: 'build/crx/<%= config.buildName %>.crx',
                options: {
                    'privateKey': 'key.pem'
                }
            }
        },
        clean: ['<%= config.tempDir %>']
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-crx');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', ['copy', 'string-replace:debug', 'crx:public', 'crx:private', 'clean']);
    grunt.registerTask('tgut', ['copy', 'string-replace:debug', 'string-replace:localesTgut', 'string-replace:noticeTgut', 'crx:public', 'crx:private', 'clean']);
};
