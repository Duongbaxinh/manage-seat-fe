import { useEffect } from "react";

const useConfirmReload = () => {
    useEffect(() => {
        const handleConfirmReloadPage = (e) => {
            e.preventDefault();
            e.returnValue = "Mọi thay đổi sẽ không được lưu. Bạn có chắc chắn muốn rời đi?";
        };

        window.addEventListener("beforeunload", handleConfirmReloadPage);

        return () => {
            window.removeEventListener("beforeunload", handleConfirmReloadPage);
        };
    }, []);
};

export default useConfirmReload;
