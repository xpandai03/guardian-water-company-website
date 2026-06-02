// Explainer video for the "What's Commonly Found in Northeast Ohio Water?"
// section — David's Notebook LM "City vs. Well" walkthrough. Plays on demand
// with native controls (no autoplay); the browser renders the first frame as
// the poster. 16:9 frame matches the source (1280×720).
export function WaterEducationVideo() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-accent/15 bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        controls
        playsInline
        preload="metadata"
      >
        <source src="/videos/ne-ohio-water-city-vs-well.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
