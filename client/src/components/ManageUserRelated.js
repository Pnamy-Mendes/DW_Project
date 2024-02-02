import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import UserManagement from './UserManagement'; // Component to manage users
import UserTypeManagement from './UserTypeManagement'; // Component to manage user types
import PermissionManagement from './PermissionManagement'; // Component to manage permissions */

const ManageUserRelated = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabChange = (e) => {
        setActiveIndex(e.index);
    };

    return (
        <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
            <TabPanel header="Users" leftIcon="pi pi-users">
                {/* User management component */}
                <UserManagement />
            </TabPanel>
            <TabPanel header="User Types" leftIcon="pi pi-id-card">
                {/* User types management component */}
                <UserTypeManagement />
            </TabPanel>
            <TabPanel header="Permissions" leftIcon="pi pi-key">
                {/* Permissions management component */}
                <PermissionManagement /> 
            </TabPanel>
        </TabView>
    );
};

export default ManageUserRelated;
