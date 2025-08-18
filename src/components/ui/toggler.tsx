interface TogglerProps {
  open: boolean;
}

export default function Toggler({ open }: TogglerProps) {
  return (
    <div className={`hamburger-menu ${open ? "open" : ""}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
