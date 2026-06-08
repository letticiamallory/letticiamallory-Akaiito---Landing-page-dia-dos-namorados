import {
  MUSIC_SECTION_ASSETS,
  type MusicPolaroidPair,
  type MusicPolaroidSlot,
} from "@/lib/music-section-assets";
import "./music-polaroid.css";

function MusicPolaroidCard({
  slot,
  side,
  showHearts,
  showHeart,
}: {
  slot: MusicPolaroidSlot;
  side: "left" | "right";
  showHearts?: boolean;
  showHeart?: boolean;
}) {
  const caption = slot.caption?.trim();

  return (
    <div className={`music-polaroid music-polaroid--${side}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MUSIC_SECTION_ASSETS.polaroidFrame}
        alt=""
        className="music-polaroid__frame"
        draggable={false}
      />
      {slot.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slot.photoUrl} alt="" className="music-polaroid__photo" draggable={false} />
      ) : (
        <div className="music-polaroid__photo music-polaroid__photo--empty" aria-hidden />
      )}
      {caption && <p className="music-polaroid__caption">{caption}</p>}
      {showHearts && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={MUSIC_SECTION_ASSETS.hearts}
          alt=""
          className="music-polaroid__deco-hearts"
          draggable={false}
        />
      )}
      {showHeart && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={MUSIC_SECTION_ASSETS.heartRed}
          alt=""
          className="music-polaroid__deco-heart"
          draggable={false}
        />
      )}
    </div>
  );
}

export function MusicPolaroidHang({
  polaroids,
  className = "",
}: {
  polaroids?: MusicPolaroidPair;
  className?: string;
}) {
  const left = polaroids?.left ?? {};
  const right = polaroids?.right ?? {};
  const hasContent =
    left.photoUrl ||
    left.caption ||
    right.photoUrl ||
    right.caption;

  if (!hasContent) {
    return (
      <div className={`music-polaroid-hang ${className}`.trim()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MUSIC_SECTION_ASSETS.clothesline}
          alt=""
          className="music-polaroid-hang__line"
          draggable={false}
        />
        <div className="music-polaroid-hang__row">
          <MusicPolaroidCard slot={{}} side="left" showHearts />
          <MusicPolaroidCard slot={{}} side="right" showHeart />
        </div>
      </div>
    );
  }

  return (
    <div className={`music-polaroid-hang ${className}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MUSIC_SECTION_ASSETS.clothesline}
        alt=""
        className="music-polaroid-hang__line"
        draggable={false}
      />
      <div className="music-polaroid-hang__row">
        <MusicPolaroidCard slot={left} side="left" showHearts />
        <MusicPolaroidCard slot={right} side="right" showHeart />
      </div>
    </div>
  );
}
