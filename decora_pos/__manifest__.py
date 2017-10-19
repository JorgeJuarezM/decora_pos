# -*- coding: utf-8 -*-

{
    'name': 'POS Stock',
    'version': '1.0',
    'author': '@jorgejuarezmx',
    'category': 'POS',
    'summary': """POS Stock By Warehouse Locations, Multiple Prices""",
    'depends': ['product', 'point_of_sale'],
    'data': [
        'security/ir.model.access.csv',
        'views/product_views.xml', 
        'views/point_of_sale.xml', 
        'views/pos_piece_config_views.xml', 
        'data/piece_config_data.xml'
    ],
    'qweb': ['static/src/xml/decora_pos.xml'],
    'installable': True,
    'application': True,
    'price': 5.00,
    'currency': 'USD',
    'images': ['static/images/screen.png']
}
