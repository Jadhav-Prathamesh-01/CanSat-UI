import DownloadButton from "./DownloadButton";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-2xl rounded-3xl">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Space Club Logo" className="h-16 w-16 rounded-full shadow-lg" />
      </div>

      <div className="flex-grow text-center">
        <h1 className="text-3xl font-extrabold tracking-wide text-shadow-md hover:text-indigo-200 transition duration-300 ease-in-out">
          Space Club
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <DownloadButton />
      </div>
    </header>
  );
}
