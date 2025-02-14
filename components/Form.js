import React from "react";

export default function SimpleDropdown() {
  function handleChange(event) {
    console.log("select:", event.target.value);
  }

  return (
    <div>
      <label htmlFor="category">Choose a category:</label>
      <select id="category" name="category" onChange={handleChange}>
        <option value="food">Food</option>
        <option value="fun">Fun</option>
        <option value="travel">Travel</option>
      </select>
    </div>
  );
}
