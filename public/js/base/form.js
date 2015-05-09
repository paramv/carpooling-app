define([
	'jquery',
	'underscore',
	'bb',
	'./view'
], function($, _, bb, View) {
	var View = View.extend({
		tag:'form',
		initialize: function() {
			// model to form binding
			if(!this.model){
				throw new Error('Cannot create a form view without a model');
			}
			// this.listenTo(this.model, "change", this.render);
			this.render();
			this._bindFormEvents();
		},

		render: function() {
			var $markup;
			$markup = $(this._template()).html();
			this.$el.html($markup);
			this.$el.addClass('form');
		},

		_bindFormEvents:function(){
			var model = this.model;
			var keys = model.keys();
			this.$el.on('change','input',function(e){
				var $el = $(this);
				var dataBind = $el.attr('data-bind');
				if(dataBind){
					model.set(dataBind,$el.val(),{silent:true});
				}

			});
		},

		setStatus:function(level,message){
			var $status = this.$el.find('.status-text');
			this.clearStatus();
			if(level === 'error'){
				$status.addClass('error').text(message);
			}else{
				$status.text(message);
			}
			$status.removeClass('hidden');
		},

		clearStatus:function(){
			var $status = this.$el.find('.status-text');
			$status.text('').addClass('hidden');
		}
	});

	return View;
});