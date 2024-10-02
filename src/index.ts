import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IThemeManager } from '@jupyterlab/apputils';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';

const PLUGIN_ID = 'jupyterlab-notebook-messages:plugin';
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: 'A JupyterLab extension to communicate between a host page and a Jupyter instance running in an iframe.',
  autoStart: true,
  requires: [INotebookTracker, IThemeManager],
  activate: (
    app: JupyterFrontEnd,
    tracker: INotebookTracker,
    themeManager: IThemeManager
  ) => {
    console.log('[NOTEBOOK MESSAGES EXTENSION] Loaded');

    const goToCellIndex = (targetCellIndex: number) => {
      const notebookPanel: NotebookPanel | null = tracker.currentWidget;

      if (!notebookPanel) {
        console.error('No active notebook.');
        return;
      }

      const notebook = notebookPanel.content;

      if (targetCellIndex >= 0 && targetCellIndex < notebook.widgets.length) {
        notebook.activeCellIndex = targetCellIndex;
        notebook.scrollToItem(targetCellIndex);
      }
    };

    const goToCellMetadata = (
      targetMetadataKey: string,
      targetMetadataValue: string
    ) => {
      const notebookPanel: NotebookPanel | null = tracker.currentWidget;

      if (!notebookPanel) {
        console.error('No active notebook.');
        return;
      }

      const notebook = notebookPanel.content;

      const matchingCellIndex = notebook.widgets.findIndex((cell: Cell) => {
        const metadata = cell.model.metadata;
        return (
          metadata?.[targetMetadataKey] &&
          metadata?.[targetMetadataKey] === targetMetadataValue
        );
      });

      if (
        matchingCellIndex >= 0 &&
        matchingCellIndex < notebook.widgets.length
      ) {
        notebook.activeCellIndex = matchingCellIndex;
        notebook.scrollToItem(matchingCellIndex);
      }
    };

    window.addEventListener(
      'message',
      event => {
        // TODO: protect origins and filter valid origin
        console.log(event.origin);

        console.log('[IFRAME] read message:', event);
        const messageData = JSON.parse(event.data);
        console.log('Parsed message: ', messageData);

        if (messageData?.type === 'go-to-cell-index') {
          goToCellIndex(messageData?.targetCellIndex);
        }

        if (messageData?.type === 'go-to-cell-metadata') {
          goToCellMetadata(
            messageData?.targetMetadataKey,
            messageData?.targetMetadataValue
          );
        }

        if (messageData?.type === 'toggle-theme') {
          if (themeManager.theme === 'JupyterLab Dark') {
            themeManager.setTheme('JupyterLab Light');
          } else {
            themeManager.setTheme('JupyterLab Dark');
          }
        }
      },
      false
    );

    // TODO: outgoing messages management
    // const notifyHost = (): void => {
    //   const message = { type: 'from-iframe-to-host', data: 'test' };
    //   window.parent.postMessage(message, '*');
    //   console.log('[IFRAME] send message:', message);
    // };
    // themeManager.themeChanged.connect(notifyHost);
  }
};

export default extension;
