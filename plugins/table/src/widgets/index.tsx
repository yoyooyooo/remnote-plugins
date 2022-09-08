import {
  declareIndexPlugin,
  ReactRNPlugin,
  WidgetLocation,
  BuiltInPowerupCodes,
  Rem,
} from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import { any, findAsync, findChildRemOfPowerupSlot, saveJSONParse } from 'remnote-utils';
import { initTableData, addRow, addColumn, getTableDataRem } from '../utils';

const initSetting = {
  columnCount: 2,
  rowCount: 2,
};

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.registerPowerup(
    'Table', // human-readable name
    'Table', // powerup code used to uniquely identify the powerup
    'a table view rem', // description
    {
      slots: [
        {
          code: 'Setting',
          name: 'Setting',
        },
        {
          code: 'Size',
          name: 'Size',
        },
        {
          code: 'Data',
          name: 'Data',
        },
      ],
    }
  );

  await plugin.app.registerCommand({
    id: 'debug:getCurrentRem',
    name: 'debug:getCurrentRem',
    action: async () => {
      const focusRem = await plugin.focus.getFocusedRem();
      focusRem && plugin.app.toast(JSON.stringify(await plugin.rem.findOne(focusRem._id), null, 2));
    },
  });

  await plugin.app.registerCommand({
    id: 'qqq',
    name: 'qqq',
    action: async () => {
      const focusRem = await plugin.focus.getFocusedRem();
      if (focusRem) {
        alert(JSON.stringify(typeof focusRem.addPowerup));
      }
    },
  });

  await plugin.app.registerCommand({
    id: 'TurnToTable',
    name: 'Turn To Table',
    action: async () => {
      let focusRem = await plugin.focus.getFocusedRem();
      focusRem = await plugin.rem.findOne(focusRem?._id);
      if (focusRem) {
        if (!(await focusRem.hasPowerup('Table'))) {
          focusRem.addPowerup('Table');
          focusRem.collapse(focusRem._id);
        }
        await focusRem.setPowerupProperty('Table', 'Size', [JSON.stringify(initSetting)]);

        // if (!(await findChildRemOfPowerupSlot(plugin)(focusRem, 'Setting'))) {
        //   const settingPowerup = await plugin.powerup.getPowerupSlotByCode('Table', 'Setting');
        //   const settingRem = await plugin.rem.createWithMarkdown(`Setting`);
        //   settingRem?.addTag(settingPowerup?._id!);
        //   settingRem?.setParent(focusRem._id, 0);
        // }

        let dataRem = await getTableDataRem(plugin)(focusRem);
        if (!dataRem) {
          const dataPowerup = await plugin.powerup.getPowerupSlotByCode('Table', 'Data');
          dataRem = await plugin.rem.createWithMarkdown(`Data`)!;
          focusRem.collapse(dataRem?._id);
          dataRem?.addTag(dataPowerup?._id!);
          dataRem?.setParent(focusRem._id);
        }

        initTableData(plugin)(dataRem!, {
          columnCount: initSetting.columnCount,
          rowCount: initSetting.rowCount,
        });
      }
    },
  });

  await plugin.app.registerCommand({
    id: 'Table: Add Row',
    name: 'Table: Add Row',
    action: async () => {
      const focusRem = await plugin.focus.getFocusedRem();
      if (focusRem) {
        if (await focusRem.hasPowerup('Table')) {
          const size = saveJSONParse(await focusRem.getPowerupProperty('Table', 'Size'));
          await focusRem.setPowerupProperty('Table', 'Size', [
            JSON.stringify({
              ...size,
              rowCount: (size?.rowCount || 0) + 1,
              columnCount: size?.columnCount || 0,
            }),
          ]);
        }
      }
    },
  });

  await plugin.app.registerCommand({
    id: 'Table: Add Row(create rem)',
    name: 'Table: Add Row(create rem)',
    action: async () => {
      const focusRem = await plugin.focus.getFocusedRem();
      if (focusRem) {
        if (!(await focusRem.hasPowerup('Table'))) return;

        let dataRem = await findChildRemOfPowerupSlot(plugin)(focusRem, 'Data');
        if (dataRem) {
          addRow(plugin)(dataRem);
        }
      }
    },
  });

  await plugin.app.registerCommand({
    id: 'Table: Add Column',
    name: 'Table: Add Column',
    action: async () => {
      const focusRem = await plugin.focus.getFocusedRem();
      if (focusRem) {
        if (await focusRem.hasPowerup('Table')) {
          const size = saveJSONParse(await focusRem.getPowerupProperty('Table', 'Size'));
          await focusRem.setPowerupProperty('Table', 'Size', [
            JSON.stringify({
              ...size,
              rowCount: size?.rowCount || 0,
              columnCount: (size?.columnCount || 0) + 1 || 0,
            }),
          ]);
        }
      }
    },
  });
  await plugin.app.registerCommand({
    id: 'Table: Add Column(create rem)',
    name: 'Table: Add Column(create rem)',
    action: async () => {
      const focusRem = await plugin.focus.getFocusedRem();
      if (focusRem) {
        if (!(await focusRem.hasPowerup('Table'))) return;

        let dataRem = await findChildRemOfPowerupSlot(plugin)(focusRem, 'Data');
        if (dataRem) {
          addColumn(plugin)(dataRem);
        }
      }
    },
  });

  await plugin.app.registerWidget('table', WidgetLocation.UnderRemEditor, {
    dimensions: {
      height: 'auto',
      width: '100%',
    },
    widgetTabIcon: 'https://cdn-icons-png.flaticon.com/512/2069/2069571.png',
    widgetTabTitle: ' ',
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
