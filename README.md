![logo](images/demo.gif)

# Jenkins Jack

Jack into your remote Jenkins to execute Pipeline scripts, provide Pipeline step auto-completions, pull Shared Library step documenation, run console groovy scripts across multiple nodes, and more!

Honestly, not that much more.

## Features

* Tree View
    * Pipeline Tree
        * Manage local scripts in relation to jobs on the targeted host
        * Pull job script from host
        * Pull replay script from build on host
        * Re-open your pulled script; association saved in `settings.json`
    * Job Tree
        * View jobs and builds on the host
        * Disable, enable, delete jobs and builds on the targeted host
    * Node Tree
        * View nodes on the host
        * Disable (with offline message), enable, disconnect nodes on the targeted host
* Pipeline Jack
    * Execute (with build paramaters)
        * Stream syntax highlighted output to output channel
    * Abort executed pipeline
    * Update target pipeline job on host with script
    * Shared Library reference docs
* Script Console Jack
    * Execute groovy console script at the System level or accross one or more ndoes
* Node Jack
    * Disable (with an offline message), enable, or disconnect one or more nodes
    * Update the labels on one more more nodes
* Job Jack
    * Disable, enable, delete, or view one or more jobs
* Build Jack
    * Download a build log
    * Download a build replay script
    * Delete one or more builds
* Supports switching between Jenkins hosts for running commands
* Pipeline (GDSL) auto-completions for `groovy` files

## Extension Commands (Jacks!)

See [jacks](jacks.md) for a more comprehensive list of commands and features.

|Jack|Description|Command|
|---|---|:---|
|__Pipeline__|Remotely build/abort/update Jenkins pipeline scripts from an open `groovy` file, streaming syntax highlighted output to the output console.|`extension.jenkins-jack.pipeline`|
|__Script Console__|Remote execute on the Jenkins Script Console from an open `groovy` file, targeting one or more nodes. Results will appearing in the output console.|`extension.jenkins-jack.scriptConsole`|
|__Build__|Select a job to download logs to display on the output window or to delete from the remote Jenkins.|`extension.jenkins-jack.build`|
|__Job__|Select one or more jobs to disable, re-enable, or delete from the remote Jenkins.|`extension.jenkins-jack.job`|
|__Node__|Select one or more nodes to set offine, online, or disconnect from the remote Jenkins.|`extension.jenkins-jack.node`|

Individual jacks can be mapped to hot keys as user sees fit.

## Tree View

The extension provides tree views for managing/associating your local pipeline scripts

A tree view of pipeline jobs discovered from the targeted Jenkins host is provided to the user, accessible through sidebar via the Jenkins Jack icon.

![Pipeline Job Tree](images/doc/pipeline_job_tree_view.png)

This view allows a user to tie their their local scripts to pipeline job's discovered on the targeted host. From this view a user can:

* __Pull Job Script__: Pull a pipeline script from the host job's configuration (if one exists) and save it locally, creating the Jenkins Jack Pipeline config for the script in the process.
* __Pull Replay Script__: Pull a replay script from a host job's build and save it locally, creating the Jenkins Jack Pipeline config for the script in the process.
* __Open Script__: If a script was already pulled/configured, easily open it in the editor through this option.

Job to local script associations can be found in `settings.json` under `jenkins-jack.pipeline.tree.items`.
> **NOTE**:
> The tree view (currently) will not pull Multibranch or Org level jobs. This is because of pathing reasons as I haven't a nice way of handling this.
>For now the Pipeline Job Tree only works for standard __Pipeline__ jobs. Yes, I am sad too.

## Auto-completions (faux snippets)

From your remote Jenkins, Jenkins Jack will pull, parse, and provide Pipeline steps as auto-completions from the Pipeline step definitions (GDSL).

Any `groovy` file in the editor will have these completions. This feature can be enabled/disabled via __Settings__ by searching for __Jenkins Jack__.

## Configuration
Jenkins Jack works by hooking into the user's running Jenkins instance via the Jenkins Remote API. Before you can use the plugin, you must fill in the extension settings to point to a Jenkins host(s) in `settings.json`:

```json
"jenkins-jack.jenkins.connections": [
    {
        "name": "localhost",                            // "name" can be seen in the host selection command
        "uri": "http://localhost:8080",
        "username": "drapplesauce",


        "password": "217287g126721687162f76f387fdsy7",  // gen API token via <your-jenkins>/user/<user name>/configure
                                                        // E.g. http://127.0.0.1:8080/user/drapplesauce/configure

        "active": true                                  // Indicates the active jenkins host you're connected to.
                                                        // Also set via host selection command
    }
]
```

You can get to this via the Settings UI (`ctrl+,`) and searching for `Jenkins Jack Connections`.

### Settings
<!-- settings-start -->

|Name |Description |
| --- | ---------- |
| `jenkins-jack.jenkins.connections` | List of jenkins connections (uri, username, and password) to target when running commands |
| `jenkins-jack.jenkins.strictTls` | If unchecked, the extension will **not** check certificate validity when connecting through HTTPS. |
| `jenkins-jack.outputView.panel.defaultViewColumn` | The default view column (location) in vscode the output panel will spawn on show. See https://code.visualstudio.com/api/references/vscode-api#ViewColumn |
| `jenkins-jack.outputView.type` | The output view. |
| `jenkins-jack.pipeline.browserBuildOutput` | Show build output via browser instead of the `OUTPUT` channel |
| `jenkins-jack.pipeline.browserSharedLibraryRef` | Show Pipeline Shared Library documentation via browser instead of within vscode as markdown |
| `jenkins-jack.pipeline.params.enabled` | Enables the use of a parameters file associate with your Pipeline job |
| `jenkins-jack.snippets.enabled` | Enable Pipeline step snippets for `.groovy` files |
<!-- settings-end -->

## Quick-use

### `ctrl+shift+j`

Displays a list of all Jack sub-commands provided by the extension (`jenkins-jack.jacks`)

## Local Packaging and Installation
To create a standalone `vsix` for installation locally, run the following commands:
```bash
# From the root of the extension.
npm install -g vsce # For packaging
npm install # Install dependencies.
vsce package # Bake some bread.
code --install-extension .\jenkins-jack-0.0.1.vsix # ...or whatever version was built
```

## Support
Do you have a feature request or would like to report a bug? Super duper! Create an issue via github's [issue tracker](https://github.com/tabeyti/jenkins-jack/issues).

Currently, there are no hard guidelines defined for feature requests, bugs, or questions since I have no idea what I'm doing. These will become more defined as interest in the project increases or something something.

## Authors

* **Travis Abeyti** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. Do what you will with this.