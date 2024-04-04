export const computeRemainingCooldown = (startTime: number, cooldown: number) => {
  const timePassedFromLastPlay = Date.now() - startTime;
  console.log("timePassedFromLastPlay", timePassedFromLastPlay);
  const _cooldown = cooldown - timePassedFromLastPlay;

  return _cooldown > 0 ? _cooldown + Date.now() : 0;
};
