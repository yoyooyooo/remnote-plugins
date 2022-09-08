import { describe, it, expect } from 'vitest';
import { getGrid, getGridFromDataRem } from '.';

describe('index', () => {
  it('getGrid', () => {
    expect(
      getGrid({
        ids: ['1', '1-1', '1-2', '1-3', '2', '2-1', '2-2', '2-3', '3', '3-1', '3-2', '3-3'],
        rowCount: 4,
        columnCount: 3,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "2",
        "3",
        "1-1",
        "2-1",
        "3-1",
        "1-2",
        "2-2",
        "3-2",
        "1-3",
        "2-3",
        "3-3",
      ]
    `);
  });
  it('getGridFromDataRem', async () => {
    const childrenRem = [
      {
        _id: '1',
        children: ['1-1', '1-2', '1-3', '1-4'],
      },
      {
        _id: '2',
        children: ['2-1', '2-2', '2-3', '2-4'],
      },
    ] as any;
    expect(
      await getGridFromDataRem({
        childrenRem,
        rowCount: 5,
        columnCount: 2,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "1-1",
        "1-2",
        "1-3",
        "1-4",
        "2",
        "2-1",
        "2-2",
        "2-3",
        "2-4",
      ]
    `);
    expect(
      await getGridFromDataRem({
        childrenRem,
        rowCount: 4,
        columnCount: 2,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "1-1",
        "1-2",
        "1-3",
        "2",
        "2-1",
        "2-2",
        "2-3",
      ]
    `);
    expect(
      await getGridFromDataRem({
        childrenRem,
        rowCount: 5,
        columnCount: 1,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "1-1",
        "1-2",
        "1-3",
        "1-4",
      ]
    `);
    expect(
      await getGridFromDataRem({
        childrenRem,
        rowCount: 3,
        columnCount: 1,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "1-1",
        "1-2",
      ]
    `);
    expect(
      await getGridFromDataRem({
        childrenRem,
        rowCount: 5,
        columnCount: 3,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "1-1",
        "1-2",
        "1-3",
        "1-4",
        "2",
        "2-1",
        "2-2",
        "2-3",
        "2-4",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]
    `);
    expect(
      await getGridFromDataRem({
        childrenRem,
        rowCount: 6,
        columnCount: 2,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "1-1",
        "1-2",
        "1-3",
        "1-4",
        undefined,
        "2",
        "2-1",
        "2-2",
        "2-3",
        "2-4",
        undefined,
      ]
    `);
    expect(
      await getGridFromDataRem({
        childrenRem,
        rowCount: 6,
        columnCount: 3,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "1-1",
        "1-2",
        "1-3",
        "1-4",
        undefined,
        "2",
        "2-1",
        "2-2",
        "2-3",
        "2-4",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]
    `);
    expect(
      await getGridFromDataRem({
        childrenRem: [...childrenRem, { _id: '3', children: ['3-1'] }],
        rowCount: 5,
        columnCount: 3,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "1-1",
        "1-2",
        "1-3",
        "1-4",
        "2",
        "2-1",
        "2-2",
        "2-3",
        "2-4",
        "3",
        "3-1",
        undefined,
        undefined,
        undefined,
      ]
    `);
    expect(
      await getGridFromDataRem({
        childrenRem: childrenRem.slice(0, 1),
        rowCount: 5,
        columnCount: 2,
      })
    ).toMatchInlineSnapshot(`
      [
        "1",
        "1-1",
        "1-2",
        "1-3",
        "1-4",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]
    `);
  });
});
