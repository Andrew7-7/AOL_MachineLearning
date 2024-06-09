import { ChangeEvent, useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import SearchInputForm from "../../components/navbar/searchInputForm/SearchInputForm";
import "./homePage.css";
import {
  district,
  property_type,
  city,
  furnishing,
  property_condition,
  certificate,
} from "./inputItems";

const HomePage = () => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    district: "",
    property_type: "",
    city: "",
    furnishing: "",
    property_condition: "",
    certificate: "",
  });

  const inputItems: { [key: string]: string[] } = {
    district: district,
    property_type: property_type,
    city: city,
    furnishing: furnishing,
    property_condition: property_condition,
    certificate: certificate,
  };

  const [filteredItems, setFilteredItems] = useState<{
    [key: string]: string[];
  }>({
    district: district,
    property_type: property_condition,
    city: city,
    furnishing: furnishing,
    property_condition: property_type,
    certificate: certificate,
  });

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const setValue = (name: string, value: string) => {
    console.log("tes");

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Filter items whenever formData changes
    const updatedFilteredItems: { [key: string]: string[] } = {};
    Object.keys(formData).forEach((name) => {
      updatedFilteredItems[name] = inputItems[name].filter((item) =>
        item.toLocaleLowerCase().includes(formData[name].toLocaleLowerCase())
      );
    });
    setFilteredItems(updatedFilteredItems);
  }, [formData]);

  return (
    <>
      <Navbar />
      <div className="home-page">
        <div className="page-center">
          <div className="content">
            <div className="left">
              <SearchInputForm
                label="District"
                name="district"
                onChange={handleInputChange}
                placeHolder="Insert district"
                type="text"
                value={formData.district}
                inputItems={filteredItems.district}
                setValue={setValue}
              />
              <SearchInputForm
                label="City"
                name="city"
                onChange={handleInputChange}
                placeHolder="Insert city"
                type="text"
                value={formData.city}
                inputItems={filteredItems.city}
                setValue={setValue}
              />
              <SearchInputForm
                label="Property Condition"
                name="property_condition"
                onChange={handleInputChange}
                placeHolder="Insert property condition"
                type="text"
                value={formData.property_condition}
                inputItems={filteredItems.property_condition}
                setValue={setValue}
              />
            </div>
            <div className="right">
              <SearchInputForm
                label="Property type"
                name="property_type"
                onChange={handleInputChange}
                placeHolder="Insert property type"
                type="text"
                value={formData.property_type}
                inputItems={filteredItems.property_type}
                setValue={setValue}
              />
              <SearchInputForm
                label="Furnishing"
                name="furnishing"
                onChange={handleInputChange}
                placeHolder="Insert furnishing"
                type="text"
                value={formData.furnishing}
                inputItems={filteredItems.furnishing}
                setValue={setValue}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
