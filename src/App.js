import React, { useState } from "react";
import './App.css';

function App() {

  const userInputValues = { description: "", sendConfirmation: "", vatValue: "", nettoValue: "", bruttoValue: ""};
  const errors = { description: "", sendConfirmation: "", vatValue: "", nettoValue: ""};

  const message = "Text is required"
  const nettoValueMessage = "Please, input number"
  const textAreaErrorMessage = "You can't enter more than 255 characters"

  const [formValues, setFormValues] = useState(userInputValues);
  const [formErrors, setFormErrors] = useState(errors);
  const [textAreaLenght, setTextAreaLenght] = useState(null)
  const [submitForm, setSubmitForm] = useState(null)
  const [responseData, setResponseData] = useState(null)


  const handleInputChange = (event) => {

    const { name, value } = event.target;

    setFormValues({...formValues, [name]: value})
    setFormErrors({...formErrors, [name]: ""})

    if(name === "nettoValue" || name === "vatValue"){
      calculateBruttoValue(name, value)
    }

    if(name === "description") {
      calculateTextAreaLenght(name, value)
    }

  }

  const handleSubmit = (event) => {

    event.preventDefault();
    
    for (let index = 0; index < Object.keys(formValues).length; index++) {
      if (Object.values(formValues)[index] === ""){
        submitMessageValidation();
        return
      }
    }

    for (let index = 0; index < Object.keys(formErrors).length; index++) {
      if (Object.values(formErrors)[index] !== ""){
        return
      }
    }
    
    postRequestForm(formValues)
  }

  const submitMessageValidation = () => {

    for (let index = 0; index < Object.keys(formErrors).length; index++) {
      if (Object.values(formValues)[index] === "" && Object.keys(formErrors)[index] === "nettoValue"){
        errors[Object.keys(errors)[index]] = nettoValueMessage
      }
      else if (Object.values(formValues)[index] === "") {
        errors[Object.keys(errors)[index]] = message
      }

      if (Object.keys(errors)[index] === "nettoValue" && Object.values(formErrors)[index] !== "") {
        errors[Object.keys(errors)[index]] = nettoValueMessage
      }
    }

    setFormErrors(errors)
    setSubmitForm(false)
  }

  const messageValidation = (event) => {

    const { name } = event.target;

    if (name === "nettoValue" && formValues[name] === "" || name === "nettoValue" && isNaN(formValues[name])){
      setFormErrors({...formErrors, [name]: nettoValueMessage})
    }
    else if (name === "description" && formErrors[name] === textAreaErrorMessage){
      setFormErrors({...formErrors, [name]: textAreaErrorMessage})
    }
    else if (formValues[name] === "") {
      setFormErrors({...formErrors, [name]: message})
    }
    else {
      setFormErrors({...formErrors, [name]: ""})
    }

  }

  const calculateBruttoValue = (name, value) => {

    let calculatedValue = 0
    let modifyValue = value.replace(/,/g, '.');

    if(name === "vatValue" && formValues.nettoValue !== ""){
      calculatedValue = parseFloat(value) * parseFloat(formValues.nettoValue)

      setFormValues({...formValues, ["bruttoValue"]: calculatedValue, [name]: value})
      return
    } 
    else if (name === "vatValue") {
      setFormErrors({...formErrors, [name]: ""})
      return
    }

    if (name === "nettoValue") {
      
      calculatedValue = parseFloat(modifyValue) * parseFloat(formValues.vatValue)
      setFormValues({...formValues, ["bruttoValue"]: calculatedValue, [name]: value})
    }

    if (isNaN(modifyValue) || isNaN(calculatedValue)){
      calculatedValue = ""

      setFormValues({...formValues, ["bruttoValue"]: calculatedValue, [name]: value})
      setFormErrors({...formErrors, ["nettoValue"]: nettoValueMessage})
    }
    else {
      setFormErrors({...formErrors, ["nettoValue"]: ""})
    }

  }

  const calculateTextAreaLenght = (name, value) => {

    const maxTextLength = 255

    if (value.length > maxTextLength){
      setTextAreaLenght(null)
      setFormErrors({...formErrors, [name]: textAreaErrorMessage})
    }
    else {
      setTextAreaLenght(maxTextLength - value.length)
      setFormErrors({...formErrors, [name]: ""})
    }

  }

  async function postRequestForm(body) {

    await fetch("https://clicktrans-server.herokuapp.com/" , {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => {
      return response.json()
    }).then( (data) => {
      if (data.success === false) {
        alert("ERROR")
      }
      else{
        setResponseData(data.success)
      }
    })

  }

  return (

    <div className="background">

      {responseData ? <div className="task_congratulation_container">
        <h1 className="congratulation_header">Congratulations</h1>
      </div> : 
        <div className="task_container">

          <form onSubmit={handleSubmit}>

            <div className="description_container">
              <label className="description_header">Description</label>
              <textarea className="description_textArea" onBlur={messageValidation} type="text" name="description" value={formValues.description} onChange={handleInputChange}></textarea>
              <p className="input_message_error">{formErrors.description}</p>
              {textAreaLenght ? <p className="description_textArea_lenght">Available: <span className="description_textArea_count">{textAreaLenght}</span></p> : <p></p>}
            </div>

            <div className="send_confirmation_container">
              <label className="send_confirmation_header">Send confirmation</label>
              <div className="confirmation_answer_container">
                <label >Yes</label>
                <input type="radio" name="sendConfirmation" id="Yes" value="YES" onClick={handleInputChange}></input>
                <label >No</label>
                <input type="radio" name="sendConfirmation" id="No" value="NO" onClick={handleInputChange}></input>
              </div>
              <p className="input_message_error">{formErrors.sendConfirmation}</p>
            </div>

            <div className="choose_vat_container">
              <label className="choose_vat_header">VAT</label>
              <select onBlur={messageValidation} name="vatValue" onChange={handleInputChange}>
                <option hidden>Choose VAT</option>
                <option value="1.19">19%</option>
                <option value="1.21">21%</option>
                <option value="1.23">23%</option>
                <option value="1.25">25%</option>
              </select>
              <p className="input_message_error">{formErrors.vatValue}</p>
            </div>

            <div className="price_netto_container">
              <label className="price_netto_header">Price netto EUR</label>
              <input type="text" name="nettoValue" onBlur={messageValidation} onChange={handleInputChange} value={formValues.nettoValue} disabled={!formValues.vatValue}></input>
              <p className="input_message_error">{formErrors.nettoValue}</p>
            </div>

            <div className="price_brutto_container">
              <label className="price_brutto_header">Price brutto EUR</label>
              <input type="text" value={formValues.bruttoValue} disabled/>
            </div>

            <div className="confirm_button_container">
              <button className="confirm_button">Submit</button>
            </div>

          </form>

        </div>
      }

    </div>
  );
}

export default App;
