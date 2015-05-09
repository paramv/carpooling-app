requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '.',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: 'js',
        jquery: '/components/jquery/dist/jquery.min',
        underscore:'/components/underscore/underscore-min',
        bootstrap: '/components/bootstrap/dist/js/bootstrap.min',
        bb: '/components/backbone/backbone',
        hbs: '/components/require-handlebars-plugin/hbs'
    },
    hbs: { // optional
        helpers: true, // default: true
        i18n: false, // default: false
        templateExtension: 'hbs', // default: 'hbs'
        partialsUrl: '' // default: ''
    },

    shims: {
        bootstrap: ['jquery']
    }

});

require([
    'jquery',
    'app/base/class',
    'app/state',
    'app/login/login',
], function($, Class,State,Login) {
    var $login = new Login().$el;
    $('.container').append($login);
});