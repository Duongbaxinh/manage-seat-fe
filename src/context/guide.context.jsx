import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./auth.context";
import { ROLES } from "../utils/permission";
import { INTRODUCES, INTRODUCES_USER } from "../config";

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children, continuous = true, run = true }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isGuideActive, setIsGuideActive] = useState(false);
    const { getUser } = useAuth()
    const user = getUser()
    const steps = user.role === ROLES.USER ? INTRODUCES_USER : INTRODUCES
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else if (continuous) {
            setCurrentStep(0);
        } else {
            setIsGuideActive(false);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleClose = () => {
        setIsGuideActive(false);
    };

    const handleShowGuide = (step) => {
        setCurrentStep(step);
        setTimeout(() => {
            setIsGuideActive(true)
        }, 1000);
    };

    React.useEffect(() => {
        setTimeout(() => { setIsGuideActive(true) }, 2000);
    }, [])
    React.useEffect(() => {
        // setIsGuideActive(true);
        if (!isGuideActive || steps.length === 0) return;

        const step = steps[currentStep];
        if (!step) {
            setIsGuideActive(false);
            return;
        }


        const completedSteps = JSON.parse(localStorage.getItem('onboarding-step') || '[]');
        if (completedSteps.includes(step.id)) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                setIsGuideActive(false);
            }
            return;
        }

        const target = document.querySelector(step.targetSelector);
        if (target) {
            target.style.outline = '3px solid red';
            target.style.position = 'relative';
            target.style.zIndex = '50';

            const rect = target.getBoundingClientRect();
            const modal = document.querySelector('#onboarding-modal');

            if (modal) {
                modal.style.position = 'absolute';
                modal.style.maxWidth = '300px';
                modal.style.width = '100%';
                modal.style.zIndex = '100';

                const modalHeight = modal.offsetHeight || 200;
                const modalWidth = 300;
                const placement = step.placement || 'bottom';
                let top = 0;
                let left = rect.left + window.scrollX;
                let arrowStyles = {};

                if (placement === 'bottom' && window.innerHeight - rect.bottom > modalHeight + 20) {
                    top = rect.bottom + window.scrollY + 12;
                    arrowStyles = {
                        top: `${top - 10}px`,
                        left: `${left + rect.width / 2}px`,
                        borderBottomColor: '#ffffff',
                        transform: 'rotate(0deg)',
                    };
                } else if (placement === 'top' || window.innerHeight - rect.bottom <= modalHeight + 20) {
                    top = rect.top + window.scrollY - modalHeight - 12;
                    arrowStyles = {
                        top: `${top + modalHeight}px`,
                        left: `${left + rect.width / 2}px`,
                        borderTopColor: '#ffffff',
                        transform: 'rotate(180deg)',
                    };
                } else if (placement === 'right') {
                    top = rect.top + window.scrollY + rect.height / 2 - modalHeight / 2;
                    left = rect.right + window.scrollX + 12;
                } else if (placement === 'left') {
                    top = rect.top + window.scrollY + rect.height / 2 - modalHeight / 2;
                    left = rect.left + window.scrollX - modalWidth - 12;
                }

                if (left + modalWidth > window.innerWidth - 20) {
                    left = window.innerWidth - modalWidth - 20;
                }
                if (left < 10) left = 10;
                if (top < 10) top = 10;

                modal.style.top = `${top}px`;
                modal.style.left = `${left}px`;

            }


            completedSteps.push(step.id);
            localStorage.setItem('onboarding-step', JSON.stringify(completedSteps));
        } else {
            // Skip if target doesn't exist
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                setIsGuideActive(false);
            }
        }

        return () => {
            if (target) {
                target.classList.remove('highlight-button');
                target.style.outline = 'none';
                target.style.zIndex = '0';
            }
        };
    }, [currentStep, isGuideActive, steps, run]);

    return (
        <OnboardingContext.Provider value={{
            isGuideActive,
            currentStep,
            continuous,
            step: steps[currentStep],
            steps,
            setCurrentStep,
            setIsGuideActive,
            handleNext,
            handlePrevious,
            handleClose,
            handleShowGuide
        }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboardingGuide = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboardingGuide must be used inside an OnboardingProvider");
    }
    return context;
};
