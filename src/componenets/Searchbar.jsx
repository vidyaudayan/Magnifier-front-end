export const SearchBar = ({ isMobile = false, searchQuery, handleInputChange, handleSearchSubmit }) => (
    <form 
      onSubmit={handleSearchSubmit}
      className={`flex ${isMobile ? 'w-full mb-4' : 'flex-grow max-w-2xl mx-4'}`}
    >
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search for users..."
          className="w-full bg-white border text-black border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery || ''}
          onChange={handleInputChange}
        />
      </div>
      <button
        type="submit"
        className={`ml-2 bg-blue-500 text-white rounded-full px-4 hover:bg-blue-600 transition ${
          isMobile ? 'py-2' : 'py-1'
        }`}
      >
        Search
      </button>
    </form>
  );