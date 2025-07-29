import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../../ui/Input";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If on wholesale path, search for customers
      if (location.pathname.includes("/wholesale")) {
        // Pass search to wholesale customer tab
        navigate(
          `/wholesale?tab=customers&search=${encodeURIComponent(searchQuery)}`
        );
      } else {
        // Default search for services
        navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const placeholder = location.pathname.includes("/wholesale")
    ? "Search for customers..."
    : "Search for services, games, apps...";

  return (
    <div className="relative mx-4 flex-1 max-w-md">
      <form onSubmit={handleSearch}>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          {/* Icon */}
          <span className="pl-3 text-gray-500"></span>

          {/* Input */}
          <input
            type="search"
            placeholder={placeholder}
            className="flex-1 px-2 py-2 text-sm focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Search button */}
          <div
            type="submit"
            className="bg-blue-950 hover:bg-blue-700 rounded text-white px-4 py-2 text-sm h-full"
          >
            <Search className="h-4 w-4" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
