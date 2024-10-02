# JupyterLab Notebook messages extension

A JupyterLab extension to communicate between a host page and a Jupyter instance running in an iframe.

## Valid messages

### Inbound messages

#### Go to certain cell by index

- type: **go-to-cell-index**
- targetCellIndex: [number]

```javascript
'{"type": "go-to-cell-index", "targetCellIndex": 0}'
```

#### Go to the first cell that matches a metadata key and value

- type: **go-to-cell-metadata**
- targetMetadataKey: [string]
- targetMetadataValue: [string]

```javascript
'{"type": "go-to-cell-metadata", "targetMetadataKey": "custom_key", "targetMetadataValue": "custom_value"}'
```

#### Toggle theme

If the current theme is `JupyterLab Light`, it switches the theme to `JupyterLab Dark`, and vice versa. 

- type: **toggle-theme**

```javascript
'{"type": "toggle-theme"}'
```

### Outbound messages

TODO

## Requirements

- JupyterLab >= 4.0

## Development install

> Note: You will need NodeJS to build the extension package.

> The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone this repo to your local environment

# Change directory to the cloned directory

# Install package in development mode
pip install -e .

# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite

# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch

# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

### Example frontend host

Run the example frontend host with an iframe containing a Jupyter Notebook:

```bash
cd example/
python -m http.server 8000
```

### Publishing

* Update version in `package.json`
* Run `jlpm run build`
* Run `hatch build` and `hatch publish`

### Uninstall

Delete the extension folder direction from the installation directory:

```bash
cd /Users/{USER}/.venv/share/jupyter/labextensions/jupyterlab-notebook-messages
```

## Production install

```bash
pip install jupyterlab-notebook-messages
```

## Troubleshooting

> Refused to frame because an ancestor violates the following Content Security Policy directive: "frame-ancestors 'self'".

Create a default config file:

```bash
jupyter notebook --generate-config
```

then add a new header at the end of the file:

```bash
# show all Jupyter paths
jupyter --paths

nano jupyter_notebook_config.d

c.NotebookApp.tornado_settings={'headers': {'Content-Security-Policy': "frame-ancestors self *"}}
```