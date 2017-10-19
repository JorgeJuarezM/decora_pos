odoo.define("decora_pos.popups",function(o){"use strict"
var i=o("point_of_sale.popups"),n=o("point_of_sale.gui"),t=i.extend({template:"InfoPopupWidget",events:{"click .button.info":"click_info"},click_info:function(){this.gui.close_popup(),this.options.info&&this.options.info.call(this)},show:function(o){this._super(o)}})
return n.define_popup({name:"info",widget:t}),t})
