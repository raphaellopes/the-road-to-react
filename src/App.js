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

// hooks
const useSemiPersistentState = (key, initialValue) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}

// components
const InputWithLabel = ({ id, type = 'text', value, onInputChange, children }) => (
  <>
    <label htmlFor={id}>{children}</label>&nbsp;
    <input
      id={id}
      type={type}
      value={value}
      onChange={onInputChange}
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
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');
  const searchedStories = stories.filter(({ title }) =>
    title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = e => setSearchTerm(e.currentTarget.value);

  return (
    <div>
      <p>Hello rasta</p>

      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
      >
        Search:
      </InputWithLabel>
      <hr />
      <List list={searchedStories} />

    </div>
  );
}

export default App;
