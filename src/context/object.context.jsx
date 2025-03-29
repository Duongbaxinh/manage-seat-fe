import { createContext, useContext, useState } from "react";

const ObjectContext = createContext();

export const ObjectProvider = ({ children }) => {
    const [objects, setObjects] = useState([]);
    const [selectedObject, setSelectedObject] = useState(null);

    const addObject = (newObject) => {
        setObjects((prev) => [...prev, newObject]);
    };

    const updateObject = (objectId, updates) => {
        setObjects((prev) =>
            prev.map((item) =>
                item.id === objectId ? { ...item, ...updates } : item
            )
        );
    };

    const deleteObject = (objectId) => {
        setObjects((prev) => prev.filter((item) => item.id !== objectId));
    };

    return (
        <ObjectContext.Provider
            value={{ objects, addObject, updateObject, deleteObject, selectedObject, setSelectedObject }}
        >
            {children}
        </ObjectContext.Provider>
    );
};

export const useObjectContext = () => {
    return useContext(ObjectContext);
};
