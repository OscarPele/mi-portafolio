import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeSelector.css";

type ThemeSelectorProps = {
  ariaLabel?: string;
  className?: string;
  variant?: "home" | "inline";
};

export default function ThemeSelector({
  ariaLabel = "Cambiar tema",
  className = "",
  variant = "inline",
}: ThemeSelectorProps) {
  const { theme, toggleTheme } = useTheme();
  const ThemeIcon = theme === "dark" ? IoMoon : IoSunny;

  const classes = [
    "theme-selector",
    theme === "dark" ? "theme-selector--dark" : "",
    variant === "home" ? "theme-selector--home" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={toggleTheme}
      role="switch"
      aria-checked={theme === "dark"}
      aria-label={ariaLabel}
    >
      <span className="theme-selector__track">
        <span className="theme-selector__icon theme-selector__icon--sun" aria-hidden="true">
          <IoSunny size={14} />
        </span>
        <span className="theme-selector__icon theme-selector__icon--moon" aria-hidden="true">
          <IoMoon size={14} />
        </span>

        <span className="theme-selector__thumb">
          <span className="theme-selector__thumb-icon" aria-hidden="true">
            <ThemeIcon size={14} />
          </span>
        </span>
      </span>
    </button>
  );
}
