define([
    'bb',
    'app/state',
    'app/login/login',
    'app/signup/signup'
], function(bb, State, Login, Signup) {
    var signUp;
    var login;
    var router;
    var state = State.getInstance();
    var hideOthers = function() {
        $('body .container .content').children().addClass('hidden');
    }
    var Router = Backbone.Router.extend({

        routes: {
            "login": "onLogin",
            "signup": "onSignup", // #help
            "dash": "onDash",
            "search/:query": "search", // #search/kiwis
            "search/:query/p:page": "search" // #search/kiwis/p7
        },

        onLogin: function() {
            if (state.get('user')) {
                return this.navigate('dash');
            }
            if (!signUp) {
                login = new Login();
                login.$el.appendTo($('body .container'));
            }
            hideOthers();
            login.$el.addClass('visible-block');
        },

        onSignup: function() {
            if (state.get('user')) {
                return this.navigate('dash');
            }
            if (!signUp) {
                signUp = new Signup();
                signUp.$el.appendTo('body .container .content');
                signUp.$el.addClass('form-signup');
            }
            signUp.$el.removeClass('hidden').addClass('visible-block');

        },

        onDash: function() {
            hideOthers();
        },

        search: function(query, page) {
            console.log(query);
        }

    });
    return {
        getInstance: function() {
            if (!router) {
                router = new Router();
            }
            return router;
        }
    }
});