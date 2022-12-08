export const sigShip = (ship) => {
  if (ship === null) {
    return null
  }

  if (ship[0] === "~") {
    return ship;
  }
  return `~${ship}`;
}
