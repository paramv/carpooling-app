define([
    'bb',
    'app/state',
    'app/login/login',
    'app/signup/signup',
    'app/dash/dash'
], function(bb, State, Login, Signup, Dash) {
    var signUp;
    var login;
    var router;
    var dashView;
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
            hideOthers();
            if (!login) {
                login = new Login();
                login.$el.appendTo($('body .container .content'));
            }
            login.$el.removeClass('hidden').addClass('visible-block');
        },

        onSignup: function() {
            // if (state.get('user')) {
            //     return this.navigate('dash');
            // }
            hideOthers();
            if (!signUp) {
                signUp = new Signup();
                signUp.$el.appendTo('body .container .content');
                signUp.$el.addClass('form-signup');
            }

            signUp.$el.removeClass('hidden').addClass('visible-block');

        },

        onDash: function() {
            if (!state.get('user')) {
                return this.navigate('login', {
                    trigger: true
                });
            }
            hideOthers();
            if (!dashView) {
                dashView = new Dash();
                dashView.$el.appendTo($('body .container .content'));
            }
            
            dashView.$el.removeClass('hidden').addClass('visible-block');
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