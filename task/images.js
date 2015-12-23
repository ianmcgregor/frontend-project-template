const _ = require('lodash');
const args = require('yargs').argv;
const path = require('path');
const gulp = require('gulp');
const debug = require('gulp-debug');
const rename = require('gulp-rename');
const resize = require('gulp-image-resize');
const webp = require('imagemin-webp');

const paths = require('../package.json').paths.images;

const config = require('../src/model/config.json');

const sizes = _.uniq(config.srcSet.map(function(src) {
    return _.omit(src, 'vw');
}), 'width');

function listImages(search) {
    const projects = config.projects;
    if (search) {
        projects = projects.filter(function(project) {
            return project.title.toLowerCase().indexOf(search) > -1;
        });
    }

    return projects
        .filter(function(project) {
            return project.visible;
        })
        .map(function(project) {
            return project.images;
        })
        .reduce(function(value, images) {
            return value.concat(images);
        }, []);
}

function getSrcImages(search) {
    return listImages(search)
        .map(function(image) {
            return paths.entry + '/**/' + path.basename(image, '.jpg') + '.png';
        });
}

function convertJPG(quality) {
    return resize({
        format: 'jpg',
        quality: quality
    });
}

function convertWebP(quality) {
    return webp({
        quality: quality
    })();
}

function resizePNG(size) {
    return resize({
        width: size.width,
        height: size.height,
        crop: false,
        upscale: false,
        filter: 'Catrom',
        sharpen: true
    });
}

function convert() {
    sizes.forEach(function(size) {

        gulp.src(getSrcImages(args.project))
            .pipe(debug())
            .pipe(resizePNG(size))
            .pipe(convertJPG(0.9))
            .pipe(rename({
                suffix: '_' + size.width + 'x' + size.height
            }))
            .pipe(gulp.dest(paths.dest));

        gulp.src(getSrcImages(args.project))
            .pipe(debug())
            .pipe(resizePNG(size))
            .pipe(convertWebP(90))
            .pipe(rename({
                suffix: '_' + size.width + 'x' + size.height
            }))
            .pipe(gulp.dest(paths.dest));
    });
}

module.exports = {
    convert: convert,
    ls: function() {
        listImages().forEach(function(image) {
            console.log(image);
        });
    }
};
