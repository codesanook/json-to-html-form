export const INITIAL_STATE = {
  address: {
    value: '',
    error: ''
  },
  shipping: {
    value: '',
    error: ''
  }
};


export const FormReducer = (state, action) => {
  switch (action.type) {
    case 'address':
      return {
        address: {
          value: action.payload.newValue,
          error: ''
        }
      };
    case 'shipping':
      return {
        ...state,
        shipping: {
          value: action.payload.newValue,
          error: ''
        }
      };
    default:
      return state;
  }
};
