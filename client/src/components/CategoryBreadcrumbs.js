import React, { useState, useEffect } from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import './css/CustomBreadcrumb.css';


const CategoryBreadcrumbs = ({ currentPath, onNavigate }) => {
    const items = currentPath.map((category, index) => {
        return {
            label: category.name,
            command: () => { onNavigate(index + 1); } // call onNavigate with index
        };
    });

    // Include the home icon to allow navigation to the root level
    const home = {
        icon: 'pi pi-home',
        command: () => { onNavigate(null); } // call onNavigate for the root
    };

    return (
        <BreadCrumb model={items} home={home} />
    );
};

export default CategoryBreadcrumbs;