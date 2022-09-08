export const saveJSONParse = (json?: string) => {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch (err) {
    console.log(`[saveJSONParse] error`, json);
    return null;
  }
};
