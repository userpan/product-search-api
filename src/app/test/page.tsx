export default function Header() {
  return (
    <div>
      <header className="bg-purple-600 text-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <a href="#" className="text-xl font-bold">DROPSHIPZONE</a>
            </div>
            <div className="space-x-4">
              <a href="#" className="hover:underline">CHANGE USER</a>
            </div>
          </nav>
        </div>
        <div className="bg-purple-700">
          <div className="container mx-auto px-4 py-2 flex items-center">
            <div></div>
            <div className="flex-grow">
              <input type="text" placeholder="chairs" className="w-full px-4 py-2 rounded-md bg-purple-600 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-white" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}