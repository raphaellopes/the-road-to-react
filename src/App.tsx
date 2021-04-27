import {
  ChangeEvent, FormEvent,
  useState, useEffect, useReducer, useCallback, useRef
} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { StoriesType, StoryType } from './types';
import SearchForm from './SearchForm';
import List from './List';

library.add(faCheck);

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// types


// @TODO: add correct type
const getSumComments = (stories:any) => {
  return stories.data.reduce(
    (result:number, value:any) => result + value.num_comments,
    0
  );
}

// reducer
type StoriesStateType = {
  data: StoriesType;
  isLoading: boolean;
  isError: boolean;
}
interface StoriesFetchInitActionType {
  type: 'STORIES_FETCH_INIT';
}
interface StoriesFetchSuccessActionType {
  type: 'STORIES_FETCH_SUCCESS';
  payload: StoriesType;
}
interface StoriesFetchFailureActionType {
  type: 'STORIES_FETCH_FAILURE';
}
interface StoriesRemoveActionType {
  type: 'REMOVE_STORY';
  payload: StoryType;
}
type StoriesActionType =
  | StoriesFetchInitActionType
  | StoriesFetchSuccessActionType
  | StoriesFetchFailureActionType
  | StoriesRemoveActionType;

const storiesReducer = (
  state: StoriesStateType,
  action: StoriesActionType
) => {
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
          story => story.objectID !== action.payload.objectID
        ),
      };
    default:
      throw new Error();
  }
}

// hooks
const useSemiPersistentState = (
  key:string,
  initialValue:string
):[string, (newValue:string) => void] => {
  const isMounted = useRef(false);
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
}

// styled-components
const Container = styled.div`
  height: 100vh;
  padding: 20px;
  background: #83a4d4; /* fallback */
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;

const HeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;





// root component
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const totalComments = getSumComments(stories);

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

  const handleSearchInput = (e:ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  }

  const handleSearchSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  }

  const handleRemoveStory = (item:StoryType) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  };

  return (
    <Container>
      <HeadlinePrimary>
        My Hacker Stories with {totalComments} comments
      </HeadlinePrimary>

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

    </Container>
  );
}

export default App;
export { storiesReducer, SearchForm, List }
