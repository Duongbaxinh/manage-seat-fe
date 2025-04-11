import { createContext, useContext, useState } from "react";

const ObjectContext = createContext();

export const useObjectContext = () => useContext(ObjectContext);

export const ObjectProvider = ({ children }) => {
    const [objects, setObjects] = useState([]);
    const [color, setColor] = useState("#ff0000");
    const [objected, setObjected] = useState(null)
    const [objectCopy, setObjectCopy] = useState(null)
    const [isOpen, setIsOpen] = useState(false);

    const handleSetNameObject = (e, idObject) => {
        if (objects.length <= 0) return
        setObjects((prev) => prev.map((object) => object.id === idObject ? { ...object, name: e.target.value } : object))
    }
    const handleDeleteObject = (objectId) => {
        setObjects((prev) => prev.filter((item) => item.id !== objectId));
    };
    const handleUpdateObject = (objectId, updates) => {
        setObjects((prev) =>
            prev.map((item) =>
                item.id === objectId ? { ...item, ...updates } : item
            )
        );
    };
    const handleAddObject = (newObject) => {
        setObjects((prev) => [...prev, newObject]);
    };

    const handleColor = (newColor) => {
        setColor(newColor)
        handleUpdateObject(objected.id, { color: newColor.hex })
    }

    return (
        <ObjectContext.Provider value={{
            objects,
            setObjects,
            objected,
            setObjected,
            handleSetNameObject,
            handleDeleteObject,
            handleUpdateObject,
            objectCopy,
            handleAddObject,
            setObjectCopy,
            isOpen,
            setIsOpen,
            handleColor,
            color,
            setColor
        }}>
            {children}
        </ObjectContext.Provider>
    );
};
