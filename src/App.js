import { useState, useEffect, useReducer, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { ReactComponent as CheckIcon } from './check.svg';

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
  ${({ width }) => `
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
const InputWithLabel = ({ id, type = 'text', value, onInputChange, children }) => (
  <>
    <Label htmlFor={id}>{children}</Label>&nbsp;
    <Input
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
  <ItemStyled>
    <ItemColumn width="40%">
      <a href={url}>{title}</a>
    </ItemColumn>
    <ItemColumn width="30%">{author}</ItemColumn>
    <ItemColumn width="10%">{numComments}</ItemColumn>
    <ItemColumn width="10%">{points}</ItemColumn>
    <ItemColumn width="10%">
      <ButtonSmall
        type="button"
        onClick={() => onRemoveItem(objectID)}>
        <CheckIcon width="18px" height="18px" />
      </ButtonSmall>
    </ItemColumn>
  </ItemStyled>
)

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} onRemoveItem={onRemoveItem} {...item} />
  )
);

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <Form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
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
    <Container>
      <HeadlinePrimary>The Road to React</HeadlinePrimary>

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
