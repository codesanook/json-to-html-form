import { useState, useSyncExternalStore } from "react";
import { useFormContext } from "./FormContext";
import { sprintf } from 'sprintf-js';

export function getField(field) {
  switch (field.type) {
    case "splittedText":
      return <SplittedTextField {...field} />
    case "currency":
      return <CurrencyField {...field} />
    case "text":
      return <TextField {...field} />
    case "fieldGroup":
      return <FieldGroup {...field} />
    case "checkbox":
      return <Checkbox {...field} />
    case "specifiedValueCheckbox":
      return <SpecifiedValueCheckbox {...field} />
    case "remark":
      return <Remark {...field} />
    default:
      return <></>
  }
};

export function SplittedTextField({ name, label, placeholder, template, ...rest }) {
  const { state, dispatch } = useFormContext();
  const field = state[name];

  const handleChanged = (e) => {
    let payload;
    if (e.target.value) {
      const renderedTemplate = e.target.value.split(/,|\s+/).filter(v => v.trim()).map(v => sprintf(template, v)).join(' ');
      payload = { value: e.target.value, template: renderedTemplate };
    } else {
      payload = { value: null, template: null };
    }
    dispatch({ type: name, payload });
  };

  return (
    <>
      <div>
        {label && <label htmlFor={name}>{label}</label>}
      </div>
      <div>
        <input type='text'
          className="form-control"
          placeholder={placeholder || ""}
          {...rest}
          value={field.value || ''}
          onChange={handleChanged}
        />
      </div>
      <div>Todo error message</div>
    </>
  )
}

export function CurrencyField({ name, label, placeholder, template, ...rest }) {
  const { state, dispatch } = useFormContext();
  const field = state[name];
  const numberFormat = new Intl.NumberFormat('en-US')

  const handleChanged = (e) => {
    let payload;
    const textValue = e.target.value;
    if (textValue) {
      const renderedTemplate = sprintf(template, numberFormat.format(Number.parseFloat(textValue.replace(/,/g, ''))));
      payload = { value: textValue, template: renderedTemplate };
    } else {
      payload = { value: null, template: null };
    }
    dispatch({ type: name, payload });
  };

  return (
    <>
      <div>
        {label && <label htmlFor={name}>{label}</label>}
      </div>
      <div>
        <input type='text'
          className="form-control"
          name={name}
          placeholder={placeholder || ""}
          {...rest}
          value={field.value || ''}
          onChange={handleChanged}
        />
      </div>
      <div>Todo error message</div>
    </>
  )
}

export function TextField({ name, label, placeholder, template, ...rest }) {
  const { state, dispatch } = useFormContext();
  const field = state[name];
  return (
    <>
      <div>
        {label && <label htmlFor={name}>{label}</label>}
      </div>
      <div>
        <input type='text'
          className="form-control"
          name={name}
          placeholder={placeholder || ""}
          {...rest}
          value={field.value}
          onChange={(e) => dispatch({ type: name, payload: { value: e.target.value, template: template } })}
        />
      </div>
      <div>Todo error message</div>
    </>
  )
}

export function Remark({ name, label, placeholder, ...rest }) {
  const { state, dispatch } = useFormContext();
  //const [value, setValue] = useState('');
  const field = state[name];

  const handleChanged = (e) => {
    //const remarkValue = e.target.value;
    //setValue(e.target.value);
    dispatch({ type: name, payload: { remark: e.target.value } });
  };

  return (
    <>
      <div>
        {label && <label >{label}</label>}
      </div>
      <div>

        <input type='text'
          className='form-control'
          placeholder={placeholder || ''}
          {...rest}
          value={field.remark || ''}
          onChange={handleChanged}
        />
      </div>

    </>
  )
}

export function FieldGroup({ name, label, items }) {

  const [selectedOption, setSelectOption] = useState('');
  const [template, setTemplate] = useState('');

  return (
    <div>
      <div>
        group
        {label && <label>{label}</label>}
      </div>
      <ul>
        {items.map((item, index) => {
          item.name = name;
          return (<li key={`${name}_${index}`}> {getField(item)} </li>);
        })
        }
      </ul>
    </div>
  );
}

export function Checkbox({ name, label, placeholder, template, value, ...rest }) {

  const { state, dispatch } = useFormContext();
  const field = state[name];

  const handleChanged = (e) => {
    var newValue = field.value == e.target.value ? null : e.target.value

    console.log({ newValue, value });
    dispatch({ type: name, payload: { value: newValue, template: template } });
  };

  return (
    <>
      <div>
        {label && <label htmlFor={name}>{label}</label>}
      </div>
      <div>
        <input
          value={value}
          checked={value === field.value}
          onChange={handleChanged}
          type="checkbox"
        />
        option
      </div>
    </>
  )
};

export function SpecifiedValueCheckbox({ name, label, placeholder, template, value, ...rest }) {

  const { state, dispatch } = useFormContext();
  const field = state[name];

  const [textValue, setTextValue] = useState(value);

  const handleCheckInputChanged = (e) => {
    var newValue = field.value == e.target.value ? null : e.target.value
    if (newValue == null) {
      dispatch({ type: name, payload: { value: newValue, template: null } });
    } else {
      const renderedTemplate = sprintf(template, textValue)
      dispatch({ type: name, payload: { value: newValue, template: renderedTemplate } });
    }

  };

  const handleTextInputChanged = (e) => {
    if (field.value === value) {
      const renderedTemplate = sprintf(template, e.target.value)
      dispatch({ type: name, payload: { value: field.value, template: renderedTemplate } });

      setTextValue(e.target.value)
    }
  };

  return (
    <>
      <div>
        {label && <label htmlFor={name}>{label}</label>}
      </div>
      <div>
        <input
          value={value}
          checked={value === field.value}
          onChange={handleCheckInputChanged}
          type="checkbox"
        />

        <input type='text'
          className="form-control"
          placeholder={placeholder || ""}
          onChange={handleTextInputChanged}
        />

      </div>
    </>
  )
};
