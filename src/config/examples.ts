export type ExampleVideo = {
  title: string;
  category: string;
  duration: string;
  poster: string;
  video?: string;
  status: "coming-soon" | "available";
};

export const exampleVideos: ExampleVideo[] = [
  {
    title: "Travel Edit",
    category: "Vertical video",
    duration: "Coming Soon",
    poster: "/examples/travel-poster.svg",
    status: "coming-soon"
  },
  {
    title: "Cinematic Edit",
    category: "Vertical video",
    duration: "Coming Soon",
    poster: "/examples/cinematic-poster.svg",
    status: "coming-soon"
  },
  {
    title: "Beat Edit",
    category: "Vertical video",
    duration: "Coming Soon",
    poster: "/examples/beat-poster.svg",
    status: "coming-soon"
  },
  {
    title: "Lifestyle Edit",
    category: "Vertical video",
    duration: "Coming Soon",
    poster: "/examples/lifestyle-poster.svg",
    status: "coming-soon"
  }
];
