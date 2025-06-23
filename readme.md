# qb-ui

menu and input system for the QBCore Framework.

This resource combines the original [qb-menu](../qb-menu) and [qb-input](../qb-input) scripts. The legacy names are still provided so existing scripts can continue to use them without any modification.

## Installation

Place the `qb-ui` folder inside your server's resources directory and add the following line to your `server.cfg`:

```
ensure qb-ui
```

Once installed you may remove the standalone `qb-menu` and `qb-input` resources.

## Usage

Two exports are provided to interact with the UI:

- `openMenu(data, sortItems, skipHeader)` – display a context menu
- `ShowInput(data)` – display an input dialog

Both functions behave the same as in the original `qb-menu` and `qb-input`
resources. Below are short examples demonstrating their usage.

### Example – Menu

```lua
RegisterCommand('uitestmenu', function()
    exports['qb-ui']:openMenu({
        {
            header = 'Main Title',
            isMenuHeader = true,
        },
        {
            header = 'Say Hello',
            txt = 'Trigger a client event',
            params = {
                event = 'qb-ui:client:hello',
                args = { message = 'Hello world!' }
            }
        }
    })
end)

RegisterNetEvent('qb-ui:client:hello', function(data)
    TriggerEvent('QBCore:Notify', data.message)
end)
```

### Example – Input Dialog

```lua
RegisterCommand('uitestinput', function()
    local result = exports['qb-ui']:ShowInput({
        header = 'Character Info',
        submitText = 'Save',
        inputs = {
            {
                text = 'Citizen ID',
                name = 'cid',
                type = 'text',
                isRequired = true,
            },
            {
                text = 'Include Tax',
                name = 'tax',
                type = 'checkbox',
                options = {
                    { value = 'yes', text = 'Yes', checked = true },
                    { value = 'no', text = 'No' },
                }
            },
            {
                text = 'Volume',
                name = 'volume',
                type = 'slider',
                min = 0,
                max = 100,
                step = 5,
                default = 50,
            }
        }
    })

    if result then
        print('CID:', result.cid)
        print('Tax:', result.tax)
        print('Volume:', result.volume)
    end
end)
```

### Styling

The look of the UI can be changed by editing `Config.Style` inside
`qb-ui/client/config.lua`. The default style is defined in
`html/styles/default.css`. To create a custom style:

1. Copy `html/styles/default.css` and give it a new name, for example
   `custom.css`.
2. Edit your new file and make any desired changes.
3. Set `Config.Style = 'custom'` and restart the resource.

When you are satisfied with the results, consider submitting a pull request so
others can use your style.

## License

QBCore Framework
Copyright (C) 2021 Joshua Eger

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
