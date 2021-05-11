import { StoriesStateType, StoriesActionType } from './types';

export const storiesReducer = (
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
