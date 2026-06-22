import { Composition, Still } from "remotion";
import { TaniaPromoVideo } from "./compositions/TaniaPromoVideo";
import { TaniaMenuShowcase } from "./compositions/TaniaMenuShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="tania-promo-video"
        component={TaniaPromoVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          restaurantName: "Tania's Cuisine & Lounge",
          tagline: "Authentic Flavors, Unforgettable Moments",
        }}
      />
      <Composition
        id="tania-menu-showcase"
        component={TaniaMenuShowcase}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          restaurantName: "Tania's Cuisine & Lounge",
        }}
      />
      <Still
        id="tania-logo-still"
        component={TaniaLogoStill}
        width={1920}
        height={1080}
      />
    </>
  );
};

const TaniaLogoStill: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "white",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "96px", margin: 0, fontWeight: "bold" }}>
          Tania's
        </h1>
        <h2 style={{ fontSize: "48px", margin: "20px 0", opacity: 0.9 }}>
          Cuisine & Lounge
        </h2>
        <p style={{ fontSize: "24px", opacity: 0.7 }}>
          M&M Plaza, Gishushu, Kigali, Rwanda
        </p>
      </div>
    </div>
  );
};