// 0 = green -> 1 = red
// c.f. https://jsfiddle.net/jongobar/sNKWK/
export function getColorFromRedGreenRange(value: number) {
  console.log(value);
  const hue = ((1 - value) * 120).toString(10);
  return `hsl(${hue},100%,50%)`;
}
