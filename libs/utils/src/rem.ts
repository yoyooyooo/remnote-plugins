import { Rem, RNPlugin } from "@remnote/plugin-sdk";
import { findAsync } from "./async-utils";

export const findChildRemOfPowerupSlot = (plugin: RNPlugin) => async (rem: Rem, tagText: string) =>
  await findAsync(
    await rem.getChildrenRem(),
    async (childRem) =>
      !!(await findAsync(
        await childRem.getTagRems(),
        async (tagRem) =>
          (await plugin.richText.toString(tagRem.text)).startsWith(tagText) &&
          (await tagRem.isPowerupSlot())
      ))
  );

export const checkHasTag = (plugin: RNPlugin) => async (remId: string, tagText: string) => {
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
