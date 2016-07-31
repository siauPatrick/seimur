'use strict';

require('colors');
require('console.table');

const webpack = require('webpack');

function size(bytes) {
    const sizes = ['B', 'kb', 'mb'];

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);

    return `${Math.round(bytes/Math.pow(1024, i), 2)} ${sizes[i]}`;
}

function log(type, ...args) {
    if (args.length === 0) {
        type = 'log';
    }

    switch (type) {
        case 'title':
            log('\n');
            console.log(` ${args.join(' ')} `.black.bgGreen.bold);
            log('\n');
            break;
        case 'shift':
            console.log.apply(null, ['  '].concat(args));
            break;
        case 'table':
            console.table.apply(null, args);
            log('\n');
            break;
        case 'error':
            console.log(args[0].split('\n').join('\n').red.bold);
            break;
        default:
            console.log.apply(null, args);
            break;
    }
}

function handleWebpackFatalError(err) {
    log('\n');
    log('error', err);
}

function handleWebpackSoftErrors(errors) {
    log('\n');
    errors.map(line => log('error', line));
}

function handleWebpackWarnings(warnings) {
    log('\n');
    warnings.map(line => log(line));
}

function handleWebpackSuccess(stat) {
    let rows = [];

    stat.assets
        .filter(asset => asset.emitted)
        .map(asset => {
            rows.push([
                asset.name.green.bold,
                size(asset.size),
                asset.chunks.join(', ')
            ]);
        });

    if (rows.length) {
        log('table', ['Name', 'Size', 'Chunks'], rows);
        log('shift', 'Hash:', stat.hash.bold);
        log('shift', 'Time:', `${String(stat.time).bold}ms`);
    }
}

log('title', 'STARTING WEBPACK');

const compiler = webpack(require('./webpack.config.js'));

compiler.watch({
    aggregateTimeout: 250
}, (err, stats) => {
    if (err) {
        return handleWebpackFatalError(err);
    }

    const json = stats.toJson();

    if (stats.hasErrors()) {
        return handleWebpackSoftErrors(json.errors);
    }

    if (stats.hasWarnings()) {
        handleWebpackWarnings(json.warnings);
    }

    handleWebpackSuccess(json);
});
