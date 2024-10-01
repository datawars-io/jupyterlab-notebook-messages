import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

const PLUGIN_ID = 'jupyterlab-notebook-messages:plugin';

const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: 'A JupyterLab extension to read messages via JavaScript API.',
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settings: ISettingRegistry) => {
    if (app.name === 'JupyterLab') {
      return;
    }

    Promise.all([app.restored, settings.load(PLUGIN_ID)])
      .then(() => {
        console.log(`[NOTEBOOK MESSAGES EXTENSION] Loaded`);

        setTimeout(() => {
          console.log("TEST!!!")
        }, 1000);
      })
      .catch(reason => {
        console.error(
          `Something went wrong when reading the settings.\n${reason}`
        );
      });
  }
};

export default extension;
