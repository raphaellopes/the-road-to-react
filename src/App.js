import { useState, useEffect, useReducer } from 'react';

const initialStories = [
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

const getAsyncStories = () => new Promise(resolve =>
  setTimeout(
    () => resolve({ data: { stories: initialStories } }),
    2000
  )
);

// reducer
const storiesReducer = (state, action) => {
  if (action.type === 'SET_STORIES') {
    return action.payload;
  } else {
    throw new Error();
  }
}

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

const Item = ({
  objectID, url, title, author, numComments, points, onRemoveItem
}) => (
  <div>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{numComments}</span>
    <span>{points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(objectID)}>
        Dismiss
      </button>
    </span>
  </div>
)

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} onRemoveItem={onRemoveItem} {...item} />
  )
);


// root component
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');
  const [stories, dispatchStories] = useReducer(storiesReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const searchedStories = stories.filter(({ title }) =>
    title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true))
  }, []);

  const handleSearch = e => setSearchTerm(e.currentTarget.value);

  const handleRemoveStory = id => {
    const newStories = stories.filter(
      story => story.objectID !== id
    );
    dispatchStories({
      type: 'SET_STORIES',
      payload: newStories
    });
  }

  return (
    <div>
      <h1>The Road to React</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />

      {isError && (<p>Something went wrong ...</p>)}
      {isLoading ? (<p>Loading ...</p>) : (
        <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
      )}

    </div>
  );
}

export default App;
