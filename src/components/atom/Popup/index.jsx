
import { MdCancel } from "react-icons/md";
import "./index.css";


export default function Popup({
    className,
    children,
    isOpen,
    title,
    subName,
    position,
    onClose,
    ref
}) {
    return (
        <div
            ref={ref}
            onClick={() => onClose()}
            className={`modal w-[100vw] fixed inset-0 z-30 bg-gray-400/10  transition flex justify-center items-center
               ${isOpen ? "show" : ""} ${position}
            `}>
            <div>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`min-w-[200px] bg-white flex flex-col gap-[15px] max-h-[90vh] p-[10px] rounded-md overflow-auto ${className}`}>

                    <div className="pl-2 w-full flex justify-between">
                        <p className="text-[18px] font-[700] text-text">
                            {title}
                        </p>
                        <div className="flex gap-2 items-center" onClick={() => onClose()}>
                            <MdCancel className="w-5 h-5 text-gray-10" />
                        </div>
                    </div>

                    <div className="w-full ">{children}</div>
                </div>
            </div>
        </div>
    );
}
