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
        $('body .container .content').children().each(function(i, el) {
            $(el).addClass('hidden').removeClass('visible-block');
        });
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
            // if (state.get('user')) {
            //     return this.navigate('dash');
            // }
            if (!login) {
                login = new Login();
                login.$el.appendTo($('body .container .content'));
            }
            hideOthers();
            login.$el.removeClass('hidden').addClass('visible-block');
        },

        onSignup: function() {
            // if (state.get('user')) {
            //     return this.navigate('dash');
            // }
            if (!signUp) {
                signUp = new Signup();
                signUp.$el.appendTo('body .container .content');
                signUp.$el.addClass('form-signup');
            }
            hideOthers();
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