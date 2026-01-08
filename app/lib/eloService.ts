
const expectedResult = (player1Elo: number, player2Elo: number): number => {
  return 1 / (1 + Math.pow(10, ((player2Elo - player1Elo) / 400)));
}

export const newEloForPlayer = (playerElo: number, opponentElo: number, outcome: 0 | 1, k: number = 32) => {
  const expected = expectedResult(playerElo, opponentElo);

  return playerElo + Math.round(k * (outcome - expected));
}
