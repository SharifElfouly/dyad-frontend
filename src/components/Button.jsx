export default function Button({ children, onClick }) {
  return (
    <div
      className="border-2 border-white pt-4 pb-4 pr-10 pl-10 cursor-pointer"
      onClick={() => onClick && onClick()}
    >
      <div>{children}</div>
    </div>
  );
}
