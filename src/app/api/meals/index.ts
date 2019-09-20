import { Repo } from '@core/contracts/repo';
import { MealsSchema, MealsModel } from './meals.model';

export * from './meals.model';
export * from './meals.service';
export * from './meals.routes';

export const mealsModel = new Repo<MealsSchema>(MealsModel);
