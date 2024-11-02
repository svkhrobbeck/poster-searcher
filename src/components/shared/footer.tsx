import packageJson from "../../../package.json";

const Footer = () => {
  return (
    <footer className="bg-slate-900 py-4">
      <div className="container flex gap-3 justify-between items-center">
        <a
          className="opacity-95 underline hover:opacity-85 duration-300 transition-all"
          href="https://t.me/zutsiy"
        >
          @feedback
        </a>

        <p>
          Version: <span>{packageJson.version}</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
