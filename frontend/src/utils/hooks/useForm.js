import {useState} from "react";

const useForm = (initialState) => {
  const [form, setForm] = useState(initialState); 
  
  const handleChange = ({target}) => {
      const {value, name} = target;

      setForm({
          ...form,
          [name]: value
      })
  }

  const handleChangeRadio = ({target}) => {
      const [name, checked] = target;
      setForm({
          ...form,
          [name]: checked
      })
  }

  return {
      form, 
      ...form,
      setForm,
      handleChange,
      handleChangeRadio
  }
}

export default useForm