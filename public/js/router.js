define([
  'bb',
  'app/signup/signup'
], function(bb, Signup) {
  var signUp;
  var router;
  var Router = Backbone.Router.extend({

    routes: {
      "signup": "onSignup", // #help
      "search/:query": "search", // #search/kiwis
      "search/:query/p:page": "search" // #search/kiwis/p7
    },

    onSignup: function() {
      if (!signUp) {
        signUp = new Signup();
        signUp.$el.appendTo('body .container .content');
        signUp.$el.addClass('form-signup');
      }
      $('body .container .content').children().addClass('hidden');
      signUp.$el.removeClass('hidden').addClass('visible-block');
      
    },

    search: function(query, page) {
      console.log(query);
    }

  });
  return {
    getInstance:function(){
        if(!router){
            router = new Router();
        }
        return router;
    }
  }
});