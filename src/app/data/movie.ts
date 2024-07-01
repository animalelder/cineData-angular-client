export type Genre = {
  name: string;
  description: string;
};

export type Director = {
  name: string;
  bio: string;
  birth: string;
  death?: string;
};

export type Movie = {
  _id: string;
  title: string;
  description: string;
  genre: Genre;
  director: Director;
  imagePath: string;
  releaseDate: string;
  featured: boolean;
};
