fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Kakarot'
description 'QB menu and input UI'
version '1.2.0'

provides {
    'qb-menu',
    'qb-input'
}

client_scripts {
    'client/config.lua',
    'client/input.lua',
    'client/menu.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/menu.js',
    'html/input.js',
    'html/style.css',
    'html/styles/*.css'
}
