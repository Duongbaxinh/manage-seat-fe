import React from "react";
import { useOnboardingGuide } from "../../../context/guide.context";


const OnboardingModal = () => {
    const { isGuideActive, step, handleNext, handleClose, currentStep, steps, continuous } = useOnboardingGuide();

    if (!isGuideActive || steps.length === 0 || currentStep >= steps.length) return null;

    return (
        <>
            <div className="fixed inset-0  bg-opacity-30 z-40" />
            <div
                id="onboarding-modal"
                className="bg-blue-100 rounded-lg shadow-xl  p-5 z-[100] border border-gray-200 tooltip-animate"
            >
                <h2 className="text-lg font-semibold mb-2 text-gray-800">{step.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                <div className="flex justify-between items-center">

                    <span className="text-gray-500 text-sm">
                        {currentStep + 1} / {steps.length}
                    </span>
                    <button
                        onClick={handleNext}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${currentStep === steps.length - 1 && !continuous ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
                {!step.disableClose && (
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg"
                        aria-label="Close tooltip"
                    >
                        ✕
                    </button>
                )}
            </div>
        </>
    );
};

export default OnboardingModal;
