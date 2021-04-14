import { useState, useEffect } from 'react';

const stories = [
  {
    title: 'React',
    url: 'http://reactjs.org',
    author: 'Jordan Walke',
    numComments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'http://redux.js.org',
    author: 'Dan Abramov, Andrew Clark',
    numComments: 2,
    points: 5,
    objectID: 1
  },
];

// components
const Search = ({ search, onSearch }) => (
  <>
    <label htmlFor="search">Search:</label>
    <input
      id="search"
      type="text"
      value={search}
      onChange={onSearch}
    />
  </>
);

const Item = ({ url, title, author, numComments, points }) => (
  <div>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{numComments}</span>
    <span>{points}</span>
  </div>
)

const List = ({ list }) =>
  list.map(({ objectID, ...rest }) => (
    <Item key={objectID} {...rest} />
  )
);


// root component
const App = () => {
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('search') || 'React');
  const searchedStories = stories.filter(({ title }) =>
    title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = e => {
    setSearchTerm(e.currentTarget.value)
  }

  useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm])

  return (
    <div>
      <p>Hello rasta</p>

      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      <List list={searchedStories} />

    </div>
  );
}

export default App;
