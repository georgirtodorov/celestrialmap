var shell = require('shelljs/make'),
    ug = require('uglify-js'),
    fs = require('fs'),
    vm = require('vm'),
    //tar = require('tar-fs'),
    //zlib = require('zlib'),
    version = require('./package.json').version,
    copy = "// Copyright 2015-2019 Olaf Frohn https://github.com/ofrohn, see LICENSE\n",
    begin = "!(function() {",
    end = "this.Celestial = Celestial;\n})();",
    filename = './celestial',
    filelist = [
    './src/js/celestial.js', 
    './src/js/projection.js', 
    './src/js/transform.js', 
    './src/js/horizontal.js', 
    './src/js/add.js',
    './src/js/get.js',
    './src/js/config.js', 
    './src/js/canvas.js',
    './src/js/util.js',
    './src/js/form.js',
    './src/js/location.js',
    './src/js/kepler.js',
    './src/js/moon.js',
    './src/js/datetimepicker.js',
    './lib/js/d3.geo.zoom.js'
    ],
    FINAL = true;

    
target.all = function() {
  target.test();
  target.build();
};

target.test = function() {
  cd('src');

  //jshint linting
  ls("*.js").forEach(function(file) {
    if (exec('jshint ' + file).code !== 0) {
      echo('JSHINT FAILED');
      exit(0);
    }
  });

  echo('JSHint tests passed');
  cd('..');

  //run tests
/*  cd('test');
  ls("*-test.js").forEach(function(file) {
    if (exec('node ' + file).code !== 123) {
      echo('TEST FAILED for ' + file);
      exit(0);  
    }
  });

  echo('Unit tests passed');

  cd('..');*/
};

target.build = function() {

  vm.runInThisContext(fs.readFileSync('./src/celestial.js', 'utf-8'), './src/celestial.js');
  echo('V' + Celestial.version);

  if (!FINAL) filename += Celestial.version;
  
  if (version !== Celestial.version)
    exec("npm version " + Celestial.version);

  var file = cat(filelist);
  file = copy + begin + file.replace(/\/\* global.*/g, '') + end;
  file.to(filename + '.js');
  
  echo('Minifying');

  var out = ug.minify(filename + '.js');
  fs.writeFileSync(filename + '.min.js', copy + out.code);
  /*var read = ug.parse(fs.readFileSync(filename + '.js', "utf8"));
  read.figure_out_scope();

  var comp = read.transform( UglifyJS.Compressor(); );
  comp.figure_out_scope();
  comp.compute_char_frequency();
  comp.mangle_names();

  var out = comp.print_to_string();
  fs.writeFileSync(filename + '.min.js', out);
  */

  //echo('Writing data');

  // zip data + prod. code + css
  /*tar.pack('./', {
       entries: ['celestial.css', 'readme.md', 'LICENSE', 'celestial.min.js', 'celestial.js', 'images/dtpick.png', 'data', 'demo', 'lib/d3.min.js', 'lib/d3.geo.projection.min.js'] 
     })
     .pipe(zlib.createGzip())
     .pipe(fs.createWriteStream(filename + '.tar.gz'))
  */
  echo('Done');
};