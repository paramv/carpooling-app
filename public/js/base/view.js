define([
	'jquery',
	'underscore',
	'bb'
], function($, _, bb, Class) {
	var View = bb.View.extend({
		defaults: new bb.Model(),
		template: '',
		tagName: 'div',
		className: 'view',
		autoRender: false,

		initialize: function() {
			if (this.model) {
				this.listenTo(this.model, "change", this.render);
			}
			this.render();
		},

		render: function() {
			var $markup;
			$markup = $(this._template()).html();
			this.$el.html($markup);
		},

		_template: function() {
			var tpl = this.template;
			if (!tpl) {
				throw new Error('A valid handlebars template is required');
				return;
			}
			return (typeof tpl === 'string') ? tpl : tpl.apply(this,arguments);
		}
	});

	return View;
});