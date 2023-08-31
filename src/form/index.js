// https://www.pluralsight.com/guides/generating-dynamic-forms-from-json-in-react

import React, { useReducer } from "react";
import { FormContext } from "./FormContext";
import { sprintf } from 'sprintf-js';
import formSchema from './FormSchema.json'
import { getField } from "./Fields";

const initialState = formSchema.reduce((state, field) => {
  state = {
    ...state,
    [field.name]: {
      value: '',
      renderedTemplate: ''
    }
  };
  return state;
}, {});

function GetNewField(changedProperty, action) {

  if (action.payload.remark) {
    return { ...changedProperty, remark: action.payload.remark };
  }

  if (action.payload.value == null) {
    return { value: null, renderedTemplate: '' };
  }

  const renderedTemplate = sprintf(action.payload.template, `${action.payload.value}`)
  return { ...changedProperty, value: action.payload.value, renderedTemplate };
}

export const FormReducer = (state, action) => {
  const changedProperty = state[action.type];
  if (changedProperty) {
    return { ...state, [action.type]: GetNewField(changedProperty, action) }
  } else {
    return state;
  }
};

const Form = ({ }) => {
  const [state, dispatch] = useReducer(FormReducer, initialState);

  return (
    <>
      <FormContext.Provider value={{ state, dispatch }}>
        <form>
          {formSchema.map((field) => {
            return (
              <div key={field.name}>
                {getField(field)}
              </div>
            );
          })
          }
        </form>
      </FormContext.Provider>

      <div>
        {JSON.stringify(state, null, 2)}
      </div>
    </>
  );
};

export default Form;
