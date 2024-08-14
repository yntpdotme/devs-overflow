export type Tag = {
  _id: string;
  name: string;
};

export type Author = {
  _id: string;
  name: string;
  image: string;
};

export type Question = {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
};
