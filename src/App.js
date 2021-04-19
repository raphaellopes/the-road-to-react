import { useState, useEffect, useReducer, useCallback } from 'react';
import axios from 'axios';
import styles from './App.module.css';

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
    <label className={styles.label} htmlFor={id}>{children}</label>&nbsp;
    <input
      className={styles.input}
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
  <div className={styles.item}>
    <span style={{ width: '40%' }}>
      <a href={url}>{title}</a>
    </span>
    <span style={{ width: '30%' }}>{author}</span>
    <span style={{ width: '10%'}}>{numComments}</span>
    <span style={{ width: '10%'}}>{points}</span>
    <span style={{ width: '10%'}}>
      <button
        className={`${styles.button} ${styles.buttonSmall}`}
        type="button"
        onClick={() => onRemoveItem(objectID)}>
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

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form className={styles.searchForm} onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button
      className={`${styles.button} ${styles.buttonLarge}`}
      type="submit"
      disabled={!searchTerm}
    >
      Submit
    </button>
  </form>
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

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    const result = await axios.get(url);
    try {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url])

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = e => setSearchTerm(e.currentTarget.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  }

  const handleRemoveStory = id => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: id
    });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>The Road to React</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />


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
