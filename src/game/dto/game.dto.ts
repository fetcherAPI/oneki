export class GameDayDto {
  gameDate: Date;
  gameResults: Array<GameDto>;
}

export class GameDto {
  goal1: Array<GoalDto>;
  goal2: Array<GoalDto>;
  result: string;
  team1: string;
  team2: string;
  _id: string;
}

class GoalDto {
  playerId: string;
  count: number;
}
