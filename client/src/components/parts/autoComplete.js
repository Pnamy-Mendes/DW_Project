
import React, {useEffect, useState, useRef } from "react";
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { AutoComplete } from "primereact/autocomplete";
import { Toast } from 'primereact/toast';
import { CountryService } from "./service/CountryService";

export default function FormikDoc() {
    const toast = useRef(null);
    const [items, setItems] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState(null);
    const [filteredCountries, setFilteredCountries] = useState(null);

    const show = () => {
        toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: formik.values.item });
    };

    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredCountries;

            if (!event.query.trim().length) {
                _filteredCountries = [...countries];
            }
            else {
                _filteredCountries = countries.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredCountries(_filteredCountries);
        }, 250);
    }

    useEffect(() => {
        CountryService.getCountries().then((data) => setCountries(data));
    }, []);

    const formik = useFormik({
        initialValues: {
            item: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.item) {
                errors.item = 'Value is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            data.item && show(data);
            formik.resetForm();
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <div className="card flex justify-content-center">
            <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                <label htmlFor="ac_item">Value</label>
                <Toast ref={toast} />
                <AutoComplete field="name" multiple value={selectedCountries} suggestions={filteredCountries} completeMethod={search} onChange={(e) => setSelectedCountries(e.value)} />
                {getFormErrorMessage('item')}
                <Button type="submit" label="Submit" />
            </form>
        </div>
    )
}
        