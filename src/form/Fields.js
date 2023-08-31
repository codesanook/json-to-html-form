import { useFormContext } from "./FormContext";

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
