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
        underscore: '/components/underscore/underscore-min',
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
    'bb',
    'hbs',
    'app/state',
    'app/login/login',
    'app/router',
    'hbs'
], function($, bb, HB, State, Login, Router) {
    var login;
    var router;
    HB.get().registerHelper('debug', function(val) {
        console.log(this);
        if (val) {
            console.log(val)
        }
    });

    HB.get().registerHelper('ifUsersAreDifferent', function(value) {
        if (this._id !== value.data._parent.root.user._id) {
            return value.fn(this);
        }
        return value.inverse(this);
    });
    var state = State.getInstance();
    $.ajaxSetup({
        cache: false
    });
    $.get('/auth').done(function(resp) {
        router = Router.getInstance();

        if (resp._userLoggedIn) {

            state.set('user', resp.user);
            bb.history.start();
            router.navigate('dash', {
                trigger: true
            });
            return;
        }
        bb.history.start();
        if (bb.history.getFragment() !== 'signup') {
            bb.history.navigate('login');
        }

    }).fail(function() {

    });



});