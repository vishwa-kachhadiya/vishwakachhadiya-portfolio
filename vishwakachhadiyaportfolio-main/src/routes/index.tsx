import { createFileRoute } from "@tanstack/react-router";
import VideoIntro from "@/components/VideoIntro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vishwa Kachhadiya — AI Researcher & Engineer" },
      {
        name: "description",
        content:
          "Cinematic portfolio of Vishwa Kachhadiya — AI researcher bridging deep learning, space systems (ISRO, DRDO-GTRE), and modern frontend craft.",
      },
      { property: "og:title", content: "Vishwa Kachhadiya — AI Researcher & Engineer" },
      {
        property: "og:description",
        content: "Deep learning, aerospace research, and cinematic frontend engineering.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <VideoIntro />;
}
