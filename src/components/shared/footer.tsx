import packageJson from "../../../package.json";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-slate-800 py-6 text-sm text-slate-400">
      <div className="container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Data &amp; images by{" "}
          <a
            className="underline underline-offset-4 hover:text-slate-50"
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </a>
          . This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>

        <div className="flex shrink-0 items-center gap-4">
          <a className="underline underline-offset-4 hover:text-slate-50" href="https://t.me/zutsiy">
            @feedback
          </a>
          <span>v{packageJson.version}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
