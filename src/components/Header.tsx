import Image from 'next/image';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <div>
      <header className="text-white">
        <div className="bg-[#942FFB]">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-between h-[75px]">
              <div className="flex-1 flex justify-center">
                <Image 
                  src="/logo-wb.png" 
                  alt="Dropshipzone Logo" 
                  width={134} 
                  height={65} 
                  className="object-contain"
                />
              </div>
              <div>
                <a href="#" className="hover:underline">CHANGE USER</a>
              </div>
            </nav>
          </div>
        </div>
        <div className="bg-[#3B1364] h-[64px] flex items-center">
          <div className="container mx-auto px-8">
            <div className="flex justify-end">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}