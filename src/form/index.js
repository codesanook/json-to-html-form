// https://www.pluralsight.com/guides/generating-dynamic-forms-from-json-in-react

import React, { useCallback, useReducer } from "react";
import { FormContext } from "./FormContext";
import { sprintf } from 'sprintf-js';

import formSchema from './FormSchema.json'
import { TextField } from "./Fields";

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


export const FormReducer = (state, action) => {
  const changedProperty = state[action.type];
  if (changedProperty) {
    const renderedTemplate = sprintf(action.payload.template, `${action.payload.value}`)
    return { ...state, [action.type]: { ...changedProperty, value: action.payload.value, renderedTemplate } }
  } else {
    return state;
  }
};

const getFormElement = (field) => {
  switch (field.type) {
    case "text":
      return <TextField {...field} />
    default:
      return <></>
  }
}


const Form = ({ }) => {
  const [state, dispatch] = useReducer(FormReducer, initialState);

  return (
    <div>

      <FormContext.Provider value={{ state, dispatch }}>
        <form>
          {formSchema.map((field) => {

            return (
              <div key={field.name}>
                {getFormElement(field)}
              </div>
            );
          })
          }
        </form>


      </FormContext.Provider>

      <div>
        {JSON.stringify(state, null, 2)}
      </div>
    </div>
  );
};

export default Form;
