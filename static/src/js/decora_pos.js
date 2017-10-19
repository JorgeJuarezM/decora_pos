odoo.define("decora_pos.decora",function(e){"use strict"
var i=e("point_of_sale.screens"),t=e("point_of_sale.models"),o=e("web.core"),r=o._t,a=t.PosModel.prototype,s=t.Orderline.prototype
t.load_models({model:"pos.piece.config",fields:["piezas_mayoreo_iguales","piezas_mayoreo_diferentes","aplica_media_caja"],loaded:function(e,i){e.pieces=i[0]}}),t.PosModel=t.PosModel.extend({load_server_data:function(){return _.find(this.models,function(e){return"product.product"===e.model}).fields.push("se_puede_vender_por_caja","precio_menudeo","precio_mayoreo","piezas_x_caja","precio_x_caja","qty_available","type","post_qty_available"),_.find(this.models,function(e){return"pos.piece.config"===e.model}).fields.push("piezas_mayoreo_iguales","piezas_mayoreo_diferentes","aplica_media_caja"),a.load_server_data.call(this)},push_order:function(e,i){var t=a.push_order.call(this,e,i)
return e&&e.orderlines.each(function(e){var i=e.get_product()
i.post_qty_available-=e.get_quantity(),$("[data-product-id='"+i.id+"'] .qty-available-tag.available").html(i.post_qty_available)}),t},push_and_invoice_order:function(e){var i=a.push_and_invoice_order.call(this,e)
return e&&e.get_client()&&e.orderlines&&e.orderlines.each(function(e){var i=e.get_product()
i.post_qty_available-=e.get_quantity(),$("[data-product-id='"+i.id+"'] .qty-available-tag.available").html(i.post_qty_available)}),i}}),t.Orderline=t.Orderline.extend({initialize:function(e,i){s.initialize.call(this,e,i),this.config=this.config||""},set_config:function(e){this.config=e,this.trigger("change",this)},get_config:function(e){return this.config},clone:function(){var e=s.clone.call(this)
return e.config=this.config,e},export_as_JSON:function(){var e=s.export_as_JSON.call(this)
return e.config=this.config,e},init_from_JSON:function(e){s.init_from_JSON.apply(this,arguments),this.config=e.config}})
var n=function(e,i,t,o,r,a,s){if(e=e||[],o=o||!1,t=t||!0,i=i||!1,r=r||!1,a=a||0,s=s||0,i&&!o)throw new Error("You cant merge empty line!!")
if(i){e.forEach(function(e){e.get_product().id===o.get_product().id&&e.get_unit_price()!==o.get_unit_price()&&o.set_unit_price(e.get_unit_price())})
var n=!1
e.forEach(function(e){e.can_be_merged_with(o)&&!1!==t&&(e.merge(o),n=!0)}),n||e.add(o)}e.forEach(function(e){e.is_per_box=!1,e.is_wholesale=!1,e.is_retail=!0}),e.forEach(function(e){var i=e.get_quantity(),t=e.get_product()
if(t.se_puede_vender_por_caja){var o=t.piezas_x_caja
r&&(o/=2),i>=o&&(e.set_unit_price(t.precio_x_caja),e.is_per_box=!0)}})
var _=e.filter(function(e){return e.is_per_box}),c=e.filter(function(e){return!e.is_per_box}),p=s,d=a
if(c.reduce(function(e,i){return i.get_quantity()+e},0)>=d||_.length>0)c.forEach(function(e){var i=e.get_product()
e.set_unit_price(i.precio_mayoreo),e.is_wholesale=!0})
else{var u=c.reduce(function(e,i){var t=i.get_product()
return e[t.id]?e[t.id]+=i.get_quantity():e[t.id]=i.get_quantity(),e},{})
Object.keys(u).some(function(e){return u[e]>=p})&&c.forEach(function(e){var i=e.get_product()
e.set_unit_price(i.precio_mayoreo),e.is_wholesale=!0})}e.filter(function(e){return!e.is_wholesale&&!e.is_per_box}).forEach(function(e){var i=e.get_product()
e.set_unit_price(i.list_price),e.is_retail=!0})},c=function(e){e=e||[]
return 0!==e.post_qty_available}
t.Order=t.Order.extend({message_storable:function(e){this.pos.gui.show_popup("info",{title:r("Oops! | No hay cantidad disponible en stock"),body:r('No tienes stock disponible para "'+e.display_name+'". Intenta aprovisionar tu stock y vuelve para realizar tu venta! :)')})},message_empty_wholesale_config:function(){this.pos.gui.show_popup("info",{title:r("Oops! | Falta Configurar Piezas por Mayoreo"),body:r('Necesitas configurar el # de piezas por mayoreo para productos iguales y diferentes, haga esto en configuraciones en la sección de "Piezas TPV".')})},add_product:function(e,i){if(this._printed)return this.destroy(),this.pos.get_order().add_product(e,i)
this.assert_editable(),i=i||{}
var o=JSON.parse(JSON.stringify(e))
o.pos=this.pos,o.order=this
var r=new t.Orderline({},{pos:this.pos,order:this,product:e})
void 0!==i.quantity&&r.set_quantity(i.quantity),void 0!==i.price&&r.set_unit_price(i.price),r.set_config(this.pos.pieces)
var a=this.pos.pieces.aplica_media_caja,s=this.pos.pieces.piezas_mayoreo_diferentes,_=this.pos.pieces.piezas_mayoreo_iguales
if(this.fix_tax_included_price(r),void 0!==i.discount&&r.set_discount(i.discount),void 0!==i.extras)for(var p in i.extras)r[p]=i.extras[p]
if(0===s||0===_)return void this.message_empty_wholesale_config()
var d=e.type,u=!1
if("product"===d&&(u=!0),u&&!c(e))return void this.message_storable(e)
n(this.orderlines,!0,i.merge,r,a,s,_),this.select_orderline(this.get_last_orderline()),r.has_product_lot&&this.display_lot_popup()}}),i.NumpadWidget.include({change_price_offer_pad:function(){var e=this,i=e.pos.get_order(),t=i.get_orderlines(),o=(i.get_last_orderline(),this.pos.pieces.aplica_media_caja),r=this.pos.pieces.piezas_mayoreo_diferentes,a=this.pos.pieces.piezas_mayoreo_iguales
n(t,!1,!0,!1,o,r,a)},clickAppendNewChar:function(e){this._super(e),this.change_price_offer_pad()},clickDeleteLastChar:function(){this._super(),this.change_price_offer_pad()}})})
