import {
  AppEvents,
  RemRichTextEditor,
  renderWidget,
  useAPIEventListener,
  usePlugin,
  useRunAsync,
  Rem,
  WidgetLocation,
} from '@remnote/plugin-sdk';
import clsx from 'clsx';
import { debounce } from 'debounce';
import { useEffect, useState } from 'react';
import { checkHasTag, findChildRemOfPowerupSlot, saveJSONParse } from 'remnote-utils';
import { getGrid, getGridFromDataRem } from '../utils';

renderWidget(() => {
  const plugin = usePlugin();
  const [activeRemId, setActiveRemId] = useState('');
  const [hasTablePowerUp, setHasTablePowerUp] = useState(false);
  const [gridData, setGridData] = useState({
    columnCount: 0,
    rowCount: 0,
    dataRem: undefined as Rem | undefined,
    descendantIds: [] as string[],
  });
  const ctx = useRunAsync(
    () => plugin.widget.getWidgetContext<WidgetLocation.UnderRemEditor>(),
    []
  );

  const getGridData = async (ctxRem: Rem) => {
    const dataRem = ctxRem && (await findChildRemOfPowerupSlot(plugin)(ctxRem, 'Data'));
    if (dataRem) {
      const childrenRem = await dataRem.getChildrenRem();
      const setting = saveJSONParse(await ctxRem!.getPowerupProperty('Table', 'Size'));
      const columnCount = setting?.columnCount || childrenRem.length || 1;
      const rowCount =
        setting?.rowCount || Math.max(...childrenRem.map((a) => a.children.length + 1));
      const descendantIds = await getGridFromDataRem({ childrenRem, columnCount, rowCount });
      return { columnCount, rowCount, descendantIds, dataRem };
    }
  };

  const onRemChanged = async () => {
    const ctxRem = await plugin.rem.findOne(ctx?.remId);
    if (!ctxRem) return;
    checkHasTag(plugin)(ctxRem?._id!, 'Table').then(async (hasTablePowerUp) => {
      setHasTablePowerUp(hasTablePowerUp);
      if (hasTablePowerUp) {
        const gridData = await getGridData(ctxRem);
        gridData && setGridData(gridData);
      }
    });
  };

  useAPIEventListener(AppEvents.RemChanged, ctx?.remId, debounce(onRemChanged, 500));
  useEffect(() => {
    onRemChanged();
  }, [ctx?.remId]);

  if (!hasTablePowerUp) return null;

  const { columnCount, rowCount, descendantIds, dataRem } = gridData;

  return (
    <div className="flex py-[2px] pr-[1px]">
      <div
        className={`rn-plugin-table flex-1 grid overflow-auto align-middle gap-[1px] ml-[11px] relative caret-red-600`}
        style={{
          '--rn-plugin-table-border-color': '#cfcfcf',
          '--rn-plugin-table-border-active-color': '#82B4D7',
          gridTemplateColumns: `repeat(${columnCount}, minmax(100px, 1fr))`,
          gridTemplateRows: `repeat(${rowCount}, minmax(34px, auto))`,
        }}
      >
        {getGrid({
          columnCount,
          rowCount,
          ids: descendantIds,
        }).map((remId, i) => {
          const rowIndex = Math.floor(i / columnCount);
          const colIndex = i % columnCount;
          return (
            <div
              key={remId || i}
              className={clsx(
                `rn-plugin-table-cell w-full box-border`,
                i < columnCount && 'rn-plugin-table-header',
                `rn-plugin-table-row-${rowIndex}`,
                `rn-plugin-table-col-${colIndex}`
              )}
              onContextMenu={(e) => {
                e.preventDefault();
              }}
              onClick={async () => {
                remId && setActiveRemId(remId);
                // plugin.app.toast(JSON.stringify({ rowIndex, colIndex, gridIndex: i }));
                if (!remId && dataRem) {
                  const rem = await plugin.rem.createRem();
                  rem?.setParent(dataRem.children[colIndex]);
                  const ctxRem = await plugin.rem.findOne(ctx?.remId);
                  if (ctxRem) {
                    const gridData = await getGridData(ctxRem);
                    gridData && setGridData(gridData);
                  }
                }
              }}
            >
              {remId ? (
                <RemRichTextEditor
                  readOnly={remId !== activeRemId}
                  remId={remId}
                  width="100%"
                  maxHeight="32px"
                />
              ) : (
                <div className="text-green-500" onClick={() => {}}>
                  create rem
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* <div className="action-bar bg-pink-300">
        <div
          className="cursor-pointer"
          onClick={() => {
            plugin.app.toast('refresh');
          }}
        >
          <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" width={24} height={24}>
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"></path>
          </svg>
        </div>
      </div> */}
    </div>
  );
});
