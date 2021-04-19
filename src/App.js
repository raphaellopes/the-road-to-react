import { useState, useEffect, useReducer, useCallback } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// reducer
const storiesReducer = (state, action) => {
  switch(action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => story.objectID !== action.payload
        ),
      };
    default:
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
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = useCallback(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    axios
      .get(url)
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits
        });
      })
      .catch(() => {
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
      })
  }, [url])

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = e => setSearchTerm(e.currentTarget.value);

  const handleSearchSubmit = () => setUrl(`${API_ENDPOINT}${searchTerm}`);

  const handleRemoveStory = id => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: id
    });
  }

  return (
    <div>
      <h1>The Road to React</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <button
        type="button"
        disabled={!searchTerm}
        onClick={handleSearchSubmit}
      >
        Submit
      </button>

      <hr />

      {stories.isError && (<p>Something went wrong ...</p>)}
      {stories.isLoading ? (<p>Loading ...</p>) : (
        <List
          list={stories.data}
          onRemoveItem={handleRemoveStory}
        />
      )}

    </div>
  );
}

export default App;
