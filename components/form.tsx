import React from "react";
import Container from "./elements/container";
import { H3 } from "./elements/headings";

/**
 * Default style for label elements
 */
const STYLE_LABEL = "block text-lg hover:cursor-pointer ";

export interface FormFieldPropsOption {
  value: string;
  text?: string;
}

/**
 * Form Field properties that are mandatory/optional. Additionally extends more html attributes for future usage
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLElement> {
  label: string;
  name: string;
  id: string;
  type: React.HTMLInputTypeAttribute | "custom" | "select" | "textarea";
  placeholder?: string;
  value?: string;
  options?: FormFieldPropsOption[];
  textarea?: {
    rows?: number;
    columns?: number;
  };
}

/**
 * Renders a generic form field
 * @param props
 * @returns
 */
function render_default(props: FormFieldProps) {
  return (
    <>
      <label className={STYLE_LABEL} htmlFor={props.id}>
        {props.label}
      </label>
      <input
        className="block text-base p-[.25rem] text-black border-black border-[1px] w-full"
        type={props.type}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        defaultValue={props.value}
      />
    </>
  );
}

/**
 * Specifically renders a textarea
 * @param props
 * @returns
 */
function render_textarea(props: FormFieldProps) {
  return (
    <>
      <label className={STYLE_LABEL} htmlFor={props.id}>
        {props.label}
      </label>
      <textarea
        className="mb-8 h-auto w-full text-black bg-white border-[1px] border-black text-base"
        name={props.name}
        id={props.id}
        rows={props.textarea ? props.textarea.rows : undefined}
        cols={props.textarea ? props.textarea.columns : undefined}
        defaultValue={props.value}
      ></textarea>
    </>
  );
}

/**
 * specifically renders a select element field
 * @param props
 * @returns
 */
function render_select(props: FormFieldProps) {
  return (
    <>
      <label className={STYLE_LABEL} htmlFor={props.id}>
        {props.label}
      </label>
      <select
        name={props.name}
        id={props.id}
        className="w-full bg-white border-black text-black border-[1px]"
        defaultValue={props.value}
      >
        <option value="">--- Please Select ---</option>
        {(props.options || []).map((opt, index) => (
          <option key={props.id + "_select_option_" + index} value={opt.value}>
            {opt.text || opt.value}
          </option>
        ))}
      </select>
    </>
  );
}

/**
 * Specifically renders a checkbox
 * @param props
 * @returns
 */
function render_checkbox(props: FormFieldProps) {
  return (
    <>
      <label className={STYLE_LABEL + " toggle"} htmlFor={props.id}>
        <input
          className="mr-4"
          type="checkbox"
          name={props.name}
          id={props.id}
          defaultValue="yes"
        />
        {props.label}
      </label>
    </>
  );
}

/**
 * Handles rendering a form field based on supplied properties
 * @param props
 * @returns
 */
function render_field(props: FormFieldProps) {
  switch (props.type) {
    case "checkbox":
      return render_checkbox(props);
    case "select":
      return render_select(props);
    case "textarea":
      return render_textarea(props);
    default:
      return render_default(props);
  }
}

/**
 * Display a form field with specific required/optional properties
 * @param props
 * @returns
 */
export const FormField = (props: FormFieldProps) => (
  <div className={"field mb-8 " + (props.className || "")}>
    {render_field(props)}
  </div>
);

/**
 * Additional properties for form field groups.
 */
export interface FormFieldGroupProps extends React.PropsWithChildren {
  className?: string;
  label: string;
}

/**
 * Default styling/logic for handlign form field groups.  Should be used with Form Fields
 * @param props
 * @returns
 */
export const FormFieldGroup = (props: FormFieldGroupProps) => (
  <div className={"field-group " + (props.className || "")}>
    <H3 className="flex-auto w-full my-8">{props.label}</H3>
    {props.children}
  </div>
);

/**
 * Default styling/logic for handling forms. Should be used with FormField and FormFieldGroup
 * @param props
 * @returns
 */
export const Form = (props: React.FormHTMLAttributes<HTMLFormElement>) => (
  <Container>
    <form {...props}>{props.children}</form>
  </Container>
);

export default Form;
