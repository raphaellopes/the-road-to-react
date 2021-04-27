import {
  ChangeEvent, FormEvent, ReactNode,
  useState, useEffect, useReducer, useCallback, useRef
} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

library.add(faCheck);

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// types
type StoryType = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
}

type StoriesType = StoryType[];

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

const ItemColumn = styled.span`
  ${({ width }: { width: string }) => `
    width: ${width};
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    > a {
      color: inherit;
    }
  `}
`

const ItemStyled = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const Button = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;

    > svg > g {
      fill: #ffffff;
      stroke: #ffffff;
    }
  }
`;

const ButtonSmall = styled(Button)`
  padding: 5px;
`;

const ButtonLarge = styled(Button)`
  padding: 10px;
`;

const Form = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const Label = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;
  font-size: 24px;
`;

// components
type InputWithLabelProps = {
  id: string;
  type?: string;
  value: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: ReactNode;
}
const InputWithLabel = ({
  id,
  type = 'text',
  value,
  onInputChange,
  isFocused,
  children
}: InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused])

  return (
    <>
      <Label htmlFor={id}>{children}</Label>&nbsp;
      <Input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
}

type ItemProps = {
  item: StoryType,
  onRemoveItem: (item:StoryType) => void;
};
const Item = ({
  item,
  onRemoveItem
}: ItemProps) => {
  const { url, title, author, num_comments, points } = item;
  return (
    <ItemStyled>
      <ItemColumn width="40%">
        <a href={url}>{title}</a>
      </ItemColumn>
      <ItemColumn width="30%">{author}</ItemColumn>
      <ItemColumn width="10%">{num_comments}</ItemColumn>
      <ItemColumn width="10%">{points}</ItemColumn>
      <ItemColumn width="10%">
        <ButtonSmall
          type="button"
          onClick={() => onRemoveItem(item)}>
          <FontAwesomeIcon icon="check" data-testid="dismiss" />
        </ButtonSmall>
      </ItemColumn>
    </ItemStyled>
  );
}

type ListProps = {
  list: StoriesType;
  onRemoveItem: (item:StoryType) => void;
}
const List = ({ list, onRemoveItem }:ListProps) => (
  <>
    {list.map(
      (item) => (
        <Item key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
      )
    )}
  </>
);

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}: SearchFormProps) => (
  <Form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <ButtonLarge
      type="submit"
      disabled={!searchTerm}
    >
      Submit
    </ButtonLarge>
  </Form>
);

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
export { storiesReducer, SearchForm, InputWithLabel, List, Item }
