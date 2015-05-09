define(['bb'], function(bb) {
  var Workspace = Backbone.Router.extend({

    routes: {
      "help": "help", // #help
      "search/:query": "search", // #search/kiwis
      "search/:query/p:page": "search" // #search/kiwis/p7
    },

    help: function() {
      console.log('hhha')
    },

    search: function(query, page) {
      console.log(query);
    }

  });
  Workspace();
  Backbone.history.start();
});