import { useState } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState([
    {
      name: "Alimentação",
      value: "food",
      checked: false
    },
    {
      name: "Transporte",
      value: "transport",
      checked: false
    },
    {
      name: "Entretenimento",
      value: "entertainment",
      checked: false
    },
    {
      name: "Moradia",
      value: "home",
      checked: false
    },
    {
      name: "Saúde",
      value: "health",
      checked: false
    },
    {
      name: "Diversos",
      value: "miscellaneous",
      checked: false
    }])

  const handleFilterChange = (ev) => {
    const { name, checked } = ev.target;

    setCategories((prev) =>
      prev.map((item) =>
        item.value === name ? { ...item, checked } : item
      )
    );
  };

  const cleanCategoriesFiltered = () => {
    setCategories((prev) =>
      prev.map((item) =>
        ({ ...item, checked: false })
      )
    );
  }

  const getChosenCategories = () => {
    const chosenCategories = categories
      .filter((item) => item.checked)
      .map((item) => item.value);

    return chosenCategories
  }

  return { categories, handleFilterChange, cleanCategoriesFiltered, getChosenCategories }
}

export default useCategories
