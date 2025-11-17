// Passmeny – liten meny som visar knappen för Pass 0.
// När man klickar scrollas sidan ner till rätt sektion via callbacken onSelect.

import "../index.css";

type PassmenyProps = {
  selected?: "pass0" | null;
  onSelect?: () => void;
};

export default function Passmeny({ selected = null, onSelect }: PassmenyProps = {}) {
  // Vi har bara ett pass just nu, så klick triggar alltid samma callback.
  const handleClick = () => {
    onSelect?.();
  };

  return (
    <div className="pass-menu">
      <button
        className="pass-button"
        onClick={handleClick}
        aria-pressed={selected === "pass0"}
      >
        Pass 0
      </button>
    </div>
  );
}
