import { Rem, RNPlugin } from "@remnote/plugin-sdk";
import { random } from "lodash-es";
export * from "./async-utils";
export * from "./rem";
export * from "./common";

export const getRandomRem = (plugin: RNPlugin) => async (rem: Rem) => {
  const children = rem.children;
  const randomRemId = children[random(0, children.length)];
  const randomRem = await plugin.rem.findOne(randomRemId);
  if (randomRem?.children?.length) {
    const randomRemId = randomRem.children[random(0, randomRem.children.length)];
    return randomRemId;
  } else {
    return randomRemId;
  }
};

export const isHasTagText = (plugin: RNPlugin) => async (remId: string, tagText: string) => {
  if (remId) {
    const rem = await plugin.rem.findOne(remId);
    const tags = await rem?.getTagRems();
    for (const tag of tags || []) {
      if ((await plugin.richText.toString(tag.text)) === tagText) {
        return true;
      }
    }
  }
  return false;
};
