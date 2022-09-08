// src/index.ts
import { random } from "lodash-es";

// src/async-utils.ts
var any = async (array, predicate) => {
  return Promise.any(
    array.map(async (item, index, items) => {
      if (await predicate(item, index, items)) {
        return item;
      }
      throw new Error();
    })
  );
};
var findAsync = async (array, predicate) => {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (await predicate(item, i, array)) {
      return item;
    }
  }
  return Promise.resolve(void 0);
};

// src/rem.ts
var findChildRemOfPowerupSlot = (plugin) => async (rem, tagText) => await findAsync(
  await rem.getChildrenRem(),
  async (childRem) => !!await findAsync(
    await childRem.getTagRems(),
    async (tagRem) => (await plugin.richText.toString(tagRem.text)).startsWith(tagText) && await tagRem.isPowerupSlot()
  )
);
var checkHasTag = (plugin) => async (remId, tagText) => {
  if (remId) {
    const rem = await plugin.rem.findOne(remId);
    const tags = await (rem == null ? void 0 : rem.getTagRems());
    for (const tag of tags || []) {
      if (await plugin.richText.toString(tag.text) === tagText) {
        return true;
      }
    }
  }
  return false;
};

// src/common.ts
var saveJSONParse = (json) => {
  if (!json)
    return null;
  try {
    return JSON.parse(json);
  } catch (err) {
    console.log(`[saveJSONParse] error`, json);
    return null;
  }
};

// src/index.ts
var getRandomRem = (plugin) => async (rem) => {
  var _a;
  const children = rem.children;
  const randomRemId = children[random(0, children.length)];
  const randomRem = await plugin.rem.findOne(randomRemId);
  if ((_a = randomRem == null ? void 0 : randomRem.children) == null ? void 0 : _a.length) {
    const randomRemId2 = randomRem.children[random(0, randomRem.children.length)];
    return randomRemId2;
  } else {
    return randomRemId;
  }
};
var isHasTagText = (plugin) => async (remId, tagText) => {
  if (remId) {
    const rem = await plugin.rem.findOne(remId);
    const tags = await (rem == null ? void 0 : rem.getTagRems());
    for (const tag of tags || []) {
      if (await plugin.richText.toString(tag.text) === tagText) {
        return true;
      }
    }
  }
  return false;
};
export {
  any,
  checkHasTag,
  findAsync,
  findChildRemOfPowerupSlot,
  getRandomRem,
  isHasTagText,
  saveJSONParse
};
