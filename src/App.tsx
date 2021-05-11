import {
  ChangeEvent, FormEvent,
  useState, useEffect, useReducer, useCallback, useRef
} from 'react';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import { Container, HeadlinePrimary, ButtonLarge } from './styles';
import { StoriesType, StoryType } from './types';
import SearchForm from './SearchForm';
import List from './List';
import LastSearches from './LastSearches';

library.add(faCheck, faArrowUp, faArrowDown);

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

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
  page: number
}
interface StoriesFetchInitActionType {
  type: 'STORIES_FETCH_INIT';
}
interface StoriesFetchSuccessActionType {
  type: 'STORIES_FETCH_SUCCESS';
  payload: {
    list: StoriesType;
    page: number
  }
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
      const { list, page } = action.payload;
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: page === 0 ? list : state.data.concat(list),
        page
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

// root component
const App = () => {
  const getUrl = (value: string, page:number) =>
    `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${value}&${PARAM_PAGE}${page}`;

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
    page: 0,
  });
  const [urls, setUrls] = useState<string[]>([getUrl(searchTerm, 0)]);
  const totalComments = getSumComments(stories);

  const extractSearchTerm = (url: string):string =>
    url
      .substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
      .replace(PARAM_SEARCH, '');

  const getLastSearches = (data: string[]) => data
    .reduce((result:string[], url, index) => {
      const term = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(term);
      }

      const previousSearchTerm = result[result.length - 1];

      if (term === previousSearchTerm) {
        return result;
      } else {
        return result.concat(term);
      }
    }, [])
    .slice(-6)
    .slice(0, -1)
    // .map(extractSearchTerm)
    // .filter(item => !item.includes(searchTerm))
    // .filter((item, index, current) => current.indexOf(item) === index)
  const lastSearches = getLastSearches(urls);


  const handleSearch = (value: string, page: number) => {
    const url = getUrl(value, page);
    setUrls(urls.concat(url));
  }

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    const lastUrl = urls[urls.length - 1];
    const result = await axios.get(lastUrl);
    try {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          list: result.data.hits,
          page: result.data.page
        }
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls])

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = (e:ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  }

  const handleSearchSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchTerm, 0);
  }

  const handleRemoveStory = (item:StoryType) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  };

  const handleLastSearch = (value:string) => {
    handleSearch(value, 0);
    setSearchTerm(value);
  }

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const term = extractSearchTerm(lastUrl);
    handleSearch(term, stories.page + 1);
  }

  // renders
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

      {lastSearches.length > 0 && <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />}


      {stories.isError && (<p>Something went wrong ...</p>)}

      <List
        list={stories.data}
        onRemoveItem={handleRemoveStory}
      />

      {stories.isLoading ? (<p>Loading ...</p>) : (
        <ButtonLarge
          onClick={handleMore}
        >
          More
        </ButtonLarge>
      )}

    </Container>
  );
}

export default App;
export { storiesReducer, SearchForm, List }
