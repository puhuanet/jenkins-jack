# Change Log
All notable changes to the "jenkins-jack" extension will be documented in this file.

## 1.1.0

### Features

#### __Pipeline Job Tree View__

Jenkins Jack now provides a tree of pipeline jobs discovered from the targeted Jenkins host, accessible through sidebar via the Jenkins Jack icon.

![Pipeline Job Tree](images/doc/pipeline_job_tree_view.png)

This view allows a user to tie their their local scripts to pipeline job's discovered on the targeted host. From this view a user can:

* __Pull Job Script__: Pull a pipeline script from the host job's configuration (if one exists) and save it locally, creating the Jenkins Jack Pipeline config for the script in the process.
* __Pull Replay Script__: Pull a replay script from a host job's build and save it locally, creating the Jenkins Jack Pipeline config for the script in the process.
* __Open Script__: If a script was already pulled/configured, easily open it in the editor through this option.

Job to local script configuration can be found in `settings.json` under `jenkins-jack.pipeline.tree.items`.
> **NOTE**:
> The tree view (currently) will not pull Multibranch or Org level jobs. This is because of pathing reasons as I haven't a nice way of handling this.
>For now the Pipeline Job Tree only works for standard __Pipeline__ jobs. Yes, I am sad too.

#### __Pipeline Jack__

* __Folder Support__: Jenkins Jack pipeline execution now supports pipelines in folders! The folder path is entered/stored in the script's json configuration under the `folder` property:
   ```json
   // For myfolder/testjob
   // in config .testjob.config.json
   {
      "name": "testjob",
      "params": null,
      "folder": "myfolder"
   }
   ```

* __Interactive Build Parameter Input__: Pipeline execution now supports interactive build parameter input for the user during Pipeline execution.
![Interactive Build Parameter Input](images/doc/interactive_build_param.png)

   When enabled, during Pipeline execution a user will be presented with input boxes to enter values for build parameters discovered on the Pipeline job. Values entered are also saved in the Pipeline's local config under the `params` property.

   > __NOTE__: This option is disabled as default, but can be enabled via `settings.json` under `jenkins-jack.pipeline.params.interactiveInput`.

* __Persisting SCM Jenkinsfile Config During Pipeline Execution__: When running a pipeline script against a job that contains SCM information for a Jenkinsfile on the host, SCM information is restored to the job's config following pipeline execution.
This allows users to run their own custom pipeline scripts against a job configured to pull a pipeline script from SCM without permanently altering the job's configuration (similar to replay).

#### Build Jack

__Pipeline Replay Script Download__: Users can now download a replay script to the editor from a selected job and build number.
### Fixed
* Fixed "Can't Connect to Jenkins" message still appearing after connecting to a valid Jenkins host following a bad connection.

#### Other

* Added an edit hosts command and quick pick item for the host selection option so that users don't need to navigate to `settings.json` themselves.

## 1.0.1
* __Stream Output to Editor Window__: All output can now be streamed to an editor window instead of the user's Output Channel.
 The output view type can be set in settings via `jenkins-jack.outputView.type` contribution point.
 The default location of the `panel` view type can be set via `jenkins-jack.outputView.panel.defaultViewColumn` contribution point.
### Fixed
* Fixed issue where `Could not connect to the remote Jenkins` message would appear even after puting in correct connection information
* Fixed command `extension.jenkins-jack.jacks` quick pick spacer icon
## 1.0.0
First version. Yip skiddlee dooo!
## 0.1.6
* New [logo](./images/logo.png)
### Fixed
* Shared Library Reference now pulls definitions from any pipelines executed that include a shared lib (e.g. `@Library('shared')`).
## 0.1.6
* __Build Jack:__ Build description now given when showing the list of build numbers to download.
### Fixed
* Most "jacks" can now be invoked (`ctrl+shift+j`) without the need to be in a `groovy` file. Certain jack commands won't display if the view you are editing isn't set to the `groovy` language mode (e.g. Pipeline, Script Console)
* Fixed progress window text formating.
## 0.1.5
* __Job Jack:__ Execute disable, enable, and delete operations on one or more targeted jobs.
* __Node Jack:__ Execute set-online, set-offline, and disconnect operations on one or more targeted nodes.
* __Build Jack:__ Stream syntax higlighted build logs or delete one or more builds from a targeted job.
### Fixed
* Default host connection now populates with default values properly
* Fixed conditional logic for retrieving build numbers via jenkins url
## 0.1.4
* __Multiple Host Connection Support:__ Now supports multiple Jenkins host connections and the ability to swap between hosts (`ctrl+shift+j -> Host Selection`)
   __NOTE:__ Additional hosts are added via `settings.json` which can be found in Settings by typing `Jenkins Jack`.
* __Build Parameter Support for Pipeline Exection:__ Groovy files used for Pipeline execution now support parameters via a config file: `<FILE>.conf.json`. Config file will be created automatically if one doesn't exist for a groovy file.
* __Disabling Strict TLS:__ An option in Settings has been added to disable TLS checks for `https` enpoints that don't have a valid cert.
* __Better Jenkins URI Parsing:__ Now supports prefixed (`http`/`https`) URIs.
* __Progress Indicators Support Cancellation:__ Progress indicators now actually support canceling during pipeline execution, script console execution, or build log downloads.
### Fixed
* __Snippets Refresh Fix__: When host information is changed, snippets will now update GDSL global shared library definitions correctly without a need for restarting the editor.
## 0.1.3
### Fixed
- Broken `.pipeline` command in `packages.json`
- Create job hang for Pipeline fixed; better error handling.
## 0.1.2
### Fixed
- Snippets configuration now work
## 0.1.1
- Initial release




