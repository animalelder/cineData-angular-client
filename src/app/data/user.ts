export type User = {
  id: string;
  username: string;
  password?: string;
  email: string;
  birthdate?: Date;
  favoriteMovies?: string[];
};
