import {
  declareIndexPlugin,
  ReactRNPlugin,
  WidgetLocation,
  BuiltInPowerupCodes,
  Rem,
  RNPlugin,
} from '@remnote/plugin-sdk';
import { random } from 'lodash-es';
import { findChildRemOfPowerupSlot } from 'remnote-utils';

export const getRandomRem = (plugin: RNPlugin) => async (rem: Rem) => {
  const descendants = await rem.getDescendants();
  const findRandomRem = async (remIds: string[]) => {
    const randomIndex = random(0, remIds.length);
    const randomRemId = remIds[randomIndex];
    const randomRem = await plugin.rem.findOne(randomRemId);
    if (randomRem?.isPowerup()) {
      remIds.splice(randomIndex, 1);
      return await findRandomRem(remIds);
    }
    return randomRemId;
  };
  return await findRandomRem(descendants.map((a) => a._id));
};

// sort ids => grid ids
export const getGrid = ({ ids, columnCount, rowCount }) => {
  return Array.from({ length: rowCount }).flatMap((_, rowIndex) => {
    return Array.from({ length: columnCount }).map(
      (_, columnIndex) => ids[rowIndex + rowCount * columnIndex]
    );
  });
};

export const getGridFromDataRem = async ({
  childrenRem,
  columnCount,
  rowCount,
}: {
  childrenRem: Rem[];
  columnCount: number;
  rowCount: number;
}) => {
  const ids = childrenRem.flatMap((cRem, colIndex) => {
    if (colIndex > columnCount - 1) return [];
    if (cRem.children.length > rowCount - 1) {
      return [cRem._id, ...cRem.children.slice(0, rowCount - 1)];
    }
    if ((cRem.children.length = rowCount - 1)) {
      return [cRem._id, ...cRem.children];
    }
    if (cRem.children.length < rowCount - 1) {
      return [...cRem.children, ...Array(rowCount - 1 - cRem.children.length).fill(undefined)];
    }
  });
  if (childrenRem.length < columnCount) {
    return ids.concat(Array((columnCount - childrenRem.length) * rowCount).fill(undefined));
  } else {
    return ids;
  }
};

export const getTableDataRem = (plugin: RNPlugin) => async (focusRem?: Rem) => {
  const _focusRem = focusRem || (await plugin.focus.getFocusedRem());
  if (_focusRem) {
    return await findChildRemOfPowerupSlot(plugin)(_focusRem, 'Data');
  }
};

export const initTableData =
  (plugin: RNPlugin) =>
  async (dataRem: Rem, { columnCount, rowCount }) => {
    Array.from({ length: columnCount }).forEach(async (_, colIndex) => {
      const colRem = await plugin.rem.createRem();
      Array.from({ length: rowCount - 1 }).forEach(async (_, rowIndex) => {
        const rem = await plugin.rem.createRem();
        rem?.setParent(colRem!._id, rowIndex);
      });
      colRem?.setParent(dataRem!._id, +colIndex);
    });
  };

export const addRow = (plugin: RNPlugin) => async (dataRem: Rem, currentRowIndex?: number) => {
  const colChildren = await dataRem.getChildrenRem();
  colChildren.forEach(async (rem) => {
    const newRem = await plugin.rem.createRem();
    newRem?.setParent(rem!._id, currentRowIndex);
  });
};

export const addColumn = (plugin: RNPlugin) => async (dataRem: Rem, currentColIndex?: number) => {
  const rowCount = (await plugin.rem.findOne(dataRem.children[0]))?.children?.length || 0;
  const colRem = await plugin.rem.createRem();
  colRem?.collapse(colRem._id);

  await Promise.all(
    Array.from({ length: rowCount }).map(async (_, rowIndex) => {
      const rem = await plugin.rem.createRem();
      rem?.setParent(colRem!._id, rowIndex);
    })
  );
  await colRem?.setParent(dataRem!._id, currentColIndex);
};
