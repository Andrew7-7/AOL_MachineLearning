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
import MapComponent from "../../components/navbar/map/map";
import NumberInputForm from "../../components/navbar/numberInputForm/NumberInputForms";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
	const [formData, setFormData] = useState<{ [key: string]: string }>({
		district: "",
		property_type: "",
		city: "",
		furnishing: "",
		property_condition: "",
		certificate: "",
	});

	const [numberFormData, setNumberFormData] = useState<{
		[key: string]: string;
	}>({
		bedrooms: "",
		bathrooms: "",
		land_size_m2: "",
		building_size_m2: "",
		carports: "",
		electricity: "",
		maid_bedrooms: "",
		maid_bathrooms: "",
		floors: "",
		garages: "",
	});

	const [prediction, setPrediction] = useState<number>(0);
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);

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
		property_type: property_type,
		city: city,
		furnishing: furnishing,
		property_condition: property_condition,
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

	const handleNumberInputChange = (event: any) => {
		const { name, value } = event.target;
		const parsedValue = parseFloat(value);
		if (!isNaN(parsedValue) && parsedValue < 0) {
			setNumberFormData((prevData) => ({
				...prevData,
				[name]: 0,
			}));
		} else {
			setNumberFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

	const onError = (message: string) =>
		toast.error(message, {
			position: "bottom-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
			transition: Bounce,
		});

	const setValue = (name: string, value: string) => {
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handlePredict = async () => {
		const {
			district,
			city,
			furnishing,
			property_condition,
			certificate,
			property_type,
		} = formData;

		const {
			bedrooms,
			bathrooms,
			land_size_m2,
			building_size_m2,
			carports,
			electricity,
			maid_bedrooms,
			maid_bathrooms,
			floors,
			garages,
		} = numberFormData;

		for (const key in formData) {
			if (formData[key] == "") {
				onError("All field must be filled!");
				return;
			}
		}

		for (const key in numberFormData) {
			if (numberFormData[key] == "") {
				onError("All field must be filled!");
				return;
			}
		}

		if (latitude == 0 || longitude == 0) {
			onError("All field must be filled!");
			return;
		}

		try {
			const response = await axios.post("http://localhost:9999/predict", {
				district,
				city,
				lat: latitude,
				long: longitude,
				property_type,
				bedrooms,
				bathrooms,
				land_size_m2,
				building_size_m2,
				carports,
				electricity,
				maid_bedrooms,
				maid_bathrooms,
				floors,
				garages,
				certificate,
				property_condition,
				furnishing,
			});

			setPrediction(response.data.predictions);
		} catch (error) {
			console.log(error);
		}
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
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				transition={Bounce}
			/>
			<ToastContainer />
			<Navbar />
			<div className="home-page">
				<div className="page-center">
					<div className="form-container">
						<div className="title">House Pricing Prediction Form</div>
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
								<NumberInputForm
									label="Number of floors"
									name="floors"
									onChange={handleNumberInputChange}
									placeHolder="Insert number of floors"
									value={numberFormData.floors}
								/>
								<NumberInputForm
									label="Number of garages"
									name="garages"
									onChange={handleNumberInputChange}
									placeHolder="Insert number of garages"
									value={numberFormData.garages}
								/>
								<div className="map-container">
									<div className="map-label">Choose longitude and latitude</div>
									<MapComponent
										setLatitude={setLatitude}
										setLongitude={setLongitude}
									/>
									<div>
										Longitude:{" "}
										{longitude == null ? "Pick from the map!" : longitude}
									</div>
									<div>
										Latitude:{" "}
										{latitude == null ? "Pick from the map!" : latitude}
									</div>
								</div>
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
									label="Certificate"
									name="certificate"
									onChange={handleInputChange}
									placeHolder="Insert certificate"
									type="text"
									value={formData.certificate}
									inputItems={filteredItems.certificate}
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
								<NumberInputForm
									label="Number of bedrooms"
									name="bedrooms"
									onChange={handleNumberInputChange}
									placeHolder="Insert number of bedrooms"
									value={numberFormData.bedrooms}
								/>
								<NumberInputForm
									label="Number of bathrooms"
									name="bathrooms"
									onChange={handleNumberInputChange}
									placeHolder="Insert number of bathrooms"
									value={numberFormData.bathrooms}
								/>
								<NumberInputForm
									label="Land size (m2)"
									name="land_size_m2"
									onChange={handleNumberInputChange}
									placeHolder="Insert land size (m2)"
									value={numberFormData.land_size_m2}
								/>
								<NumberInputForm
									label="Building size (m2)"
									name="building_size_m2"
									onChange={handleNumberInputChange}
									placeHolder="Insert building size (m2)"
									value={numberFormData.building_size_m2}
								/>
								<NumberInputForm
									label="Number of carports"
									name="carports"
									onChange={handleNumberInputChange}
									placeHolder="Insert number of carports"
									value={numberFormData.carports}
								/>
								<NumberInputForm
									label="Electricity (mAh)"
									name="electricity"
									onChange={handleNumberInputChange}
									placeHolder="Insert electricity (mAh)"
									value={numberFormData.electricity}
								/>
								<NumberInputForm
									label="Number of maid bedrooms"
									name="maid_bedrooms"
									onChange={handleNumberInputChange}
									placeHolder="Insert number of bedrooms"
									value={numberFormData.maid_bedrooms}
								/>
								<NumberInputForm
									label="Number of maid bathrooms"
									name="maid_bathrooms"
									onChange={handleNumberInputChange}
									placeHolder="Insert number of bathrooms"
									value={numberFormData.maid_bathrooms}
								/>
							</div>
						</div>
						<div className="predict-button" onClick={handlePredict}>
							Predict
						</div>
						{prediction != 0 && (
							<div className="prediction">
								Predicted Price:{" "}
								<b>
									{prediction.toLocaleString("id-ID", {
										style: "currency",
										currency: "IDR",
									})}
								</b>{" "}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
