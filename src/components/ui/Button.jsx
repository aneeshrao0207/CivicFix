import "./Button.css";
function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`civic-button civic-button-${variant} civic-button-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;