export const updateFields = (
  entity: Record<string, any>,
  updateDtoKeys: Record<string, any>,
): void => {
  Object.keys(updateDtoKeys).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    entity[key] = updateDtoKeys[key];
  });
};
