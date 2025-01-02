import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

export interface WalkthroughStep {
  target: string;
  title: string;
  content: string;
  requiredInteraction?: {
    type: 'click' | 'input' | 'custom';
    message?: string;
    validator?: (event: CustomEvent<{ originalEvent: Event, type: string, target: EventTarget, value?: string, checked?: boolean }>) => boolean;
    autoInteractDelay?: number; // Delay in ms before auto-interaction
  };
}

interface TooltipPosition {
  top: number;
  left: number;
}

interface WalkthroughContextType {
  start: (steps: WalkthroughStep[]) => void;
  stop: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const WalkthroughContext = createContext<WalkthroughContextType | null>(null);

export const useWalkthrough = () => {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error('useWalkthrough must be used within a WalkthroughProvider');
  }
  return context;
};

// Styled Components
const Overlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(4px)',
  zIndex: 9998,
  pointerEvents: 'none',
  mask: `
    linear-gradient(black, black) no-repeat,
    linear-gradient(black, black)
  `,
  WebkitMask: `
    linear-gradient(black, black) no-repeat,
    linear-gradient(black, black)
  `,
  maskComposite: 'exclude',
  WebkitMaskComposite: 'xor',
  transition: 'all 0.3s ease-in-out',
});

const Spotlight = styled('div')<{ position: DOMRect | null }>(({ position }) => ({
  position: 'fixed',
  top: position ? position.top - 8 : 0,
  left: position ? position.left - 8 : 0,
  width: position ? position.width + 16 : 0,
  height: position ? position.height + 16 : 0,
  border: '2px solid #1976d2',
  borderRadius: '8px',
  boxShadow: '0 0 16px rgba(25, 118, 210, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 9997,
  pointerEvents: 'none',
}));

const TooltipContent = styled('div')({
  position: 'relative',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  width: '400px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  backdropFilter: 'blur(10px)',
  zIndex: 10000,
  pointerEvents: 'auto',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
});

const TooltipTitle = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '12px',
  color: '#1a1a1a',
  lineHeight: 1.3,
});

const TooltipDescription = styled(Typography)({
  fontSize: '0.95rem',
  color: '#4a4a4a',
  marginBottom: '20px',
  lineHeight: 1.6,
});

const TooltipFooter = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
});

const StepIndicator = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

const StepDot = styled('div')<{ active?: boolean }>(({ active }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: active ? '#1976d2' : '#e0e0e0',
  transition: 'all 0.3s ease',
}));

const NavigationButton = styled(IconButton)({
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  transition: 'all 0.2s ease',
});

const RequiredMessage = styled(Typography)({
  fontSize: '0.85rem',
  color: '#666',
  fontStyle: 'italic',
  marginTop: '8px',
});

// Helper function to calculate tooltip position
const calculateTooltipPosition = (
  elementRect: DOMRect,
  tooltipWidth: number = 400,
  tooltipHeight: number = 200,
  padding: number = 20
): TooltipPosition => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let position: TooltipPosition = {
    top: elementRect.bottom + padding,
    left: elementRect.left + (elementRect.width - tooltipWidth) / 2
  };

  if (position.left < padding) {
    position.left = padding;
  } else if (position.left + tooltipWidth > viewportWidth - padding) {
    position.left = viewportWidth - tooltipWidth - padding;
  }

  if (position.top + tooltipHeight > viewportHeight - padding) {
    position.top = elementRect.top - tooltipHeight - padding;
    
    if (position.top < padding) {
      const spaceAbove = elementRect.top;
      const spaceBelow = viewportHeight - elementRect.bottom;
      position.top = spaceAbove > spaceBelow ? padding : viewportHeight - tooltipHeight - padding;
    }
  }

  return {
    top: Math.max(padding, Math.min(position.top, viewportHeight - tooltipHeight - padding)),
    left: Math.max(padding, Math.min(position.left, viewportWidth - tooltipWidth - padding))
  };
};

export const WalkthroughProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [steps, setSteps] = useState<WalkthroughStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [elementPosition, setElementPosition] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const [interactionComplete, setInteractionComplete] = useState(true);
  const autoInteractTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoInteractTimeout = useCallback(() => {
    if (autoInteractTimeoutRef.current) {
      clearTimeout(autoInteractTimeoutRef.current);
      autoInteractTimeoutRef.current = null;
    }
  }, []);

  const setupAutoInteraction = useCallback(() => {
    clearAutoInteractTimeout();
    
    const currentStepData = steps[currentStep];
    if (!currentStepData?.requiredInteraction?.autoInteractDelay) return;

    autoInteractTimeoutRef.current = setTimeout(() => {
      const targetElement = document.querySelector(currentStepData.target);
      if (!targetElement) return;

      const { type } = currentStepData.requiredInteraction;

      if (type === 'click') {
        setInteractionComplete(true);
      } else if (type === 'input' && currentStepData.requiredInteraction.validator) {
        const customEvent = new CustomEvent('walkthrough-interaction', {
          detail: { 
            type: 'input',
            isAutoInteraction: true,
            value: 'auto-completed',
            target: targetElement,
          }
        });
        if (currentStepData.requiredInteraction.validator(customEvent)) {
          setInteractionComplete(true);
          if (targetElement instanceof HTMLInputElement) {
            targetElement.value = 'auto-completed';
          }
        }
      } else if (type === 'custom' && currentStepData.requiredInteraction.validator) {
        const customEvent = new CustomEvent('walkthrough-interaction', {
          detail: { 
            type: 'custom',
            isAutoInteraction: true,
            value: true,
            target: targetElement,
            checked: true,
            rating: 5
          }
        });
        if (currentStepData.requiredInteraction.validator(customEvent)) {
          setInteractionComplete(true);
        }
      }
    }, currentStepData.requiredInteraction.autoInteractDelay);
  }, [currentStep, steps, clearAutoInteractTimeout]);

  useEffect(() => {
    if (isActive && !interactionComplete) {
      setupAutoInteraction();
    }
    return clearAutoInteractTimeout;
  }, [isActive, currentStep, interactionComplete, setupAutoInteraction, clearAutoInteractTimeout]);

  const handleGlobalClick = useCallback((event: MouseEvent) => {
    clearAutoInteractTimeout();

    if (!isActive || !steps[currentStep]) return;

    const targetElement = document.querySelector(steps[currentStep].target);
    const tooltipElement = document.querySelector('[data-walkthrough-tooltip]');
    
    if (targetElement?.contains(event.target as Node) || tooltipElement?.contains(event.target as Node)) {
      if (steps[currentStep].requiredInteraction?.type === 'click') {
        setInteractionComplete(true);
      } else if (steps[currentStep].requiredInteraction?.validator) {
        const customEvent = new CustomEvent('walkthrough-interaction', {
          detail: { 
            originalEvent: event,
            type: steps[currentStep].requiredInteraction.type,
            target: event.target,
            value: (event.target as HTMLInputElement)?.value,
            checked: (event.target as HTMLInputElement)?.checked,
          }
        });
        if (steps[currentStep].requiredInteraction.validator(customEvent)) {
          setInteractionComplete(true);
        }
      }
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }, [isActive, currentStep, steps, clearAutoInteractTimeout]);

  useEffect(() => {
    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, [handleGlobalClick]);

  const updatePositions = useCallback(() => {
    if (!isActive || !steps[currentStep]) return;

    const element = document.querySelector(steps[currentStep].target);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setElementPosition(rect);
    setTooltipPosition(calculateTooltipPosition(rect));
  }, [isActive, currentStep, steps]);

  useEffect(() => {
    if (isActive) {
      updatePositions();
      window.addEventListener('resize', updatePositions);
      window.addEventListener('scroll', updatePositions, true);
      return () => {
        window.removeEventListener('resize', updatePositions);
        window.removeEventListener('scroll', updatePositions, true);
      };
    }
  }, [isActive, updatePositions]);

  useEffect(() => {
    if (isActive && elementPosition) {
      // Update overlay mask to create spotlight hole
      const overlay = document.querySelector('[data-walkthrough-overlay]') as HTMLElement;
      if (overlay) {
        const padding = 8; // Same as spotlight padding
        const x = elementPosition.left - padding;
        const y = elementPosition.top - padding;
        const width = elementPosition.width + (padding * 2);
        const height = elementPosition.height + (padding * 2);
        
        overlay.style.maskImage = `
          linear-gradient(#000, #000),
          linear-gradient(#000, #000)
        `;
        overlay.style.WebkitMaskImage = `
          linear-gradient(#000, #000),
          linear-gradient(#000, #000)
        `;
        overlay.style.maskPosition = `
          0 0,
          ${x}px ${y}px
        `;
        overlay.style.WebkitMaskPosition = `
          0 0,
          ${x}px ${y}px
        `;
        overlay.style.maskSize = `
          100% 100%,
          ${width}px ${height}px
        `;
        overlay.style.WebkitMaskSize = `
          100% 100%,
          ${width}px ${height}px
        `;
      }
    }
  }, [isActive, elementPosition]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setInteractionComplete(false);
    } else {
      setIsActive(false);
    }
  }, [currentStep, steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setInteractionComplete(true);
    }
  }, [currentStep]);

  const start = useCallback((newSteps: WalkthroughStep[]) => {
    setSteps(newSteps);
    setCurrentStep(0);
    setIsActive(true);
    setInteractionComplete(false);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
  }, []);

  return (
    <WalkthroughContext.Provider value={{
      start,
      stop,
      currentStep: isActive ? currentStep : undefined,
      totalSteps: isActive ? steps.length : undefined
    }}>
      <div style={{ position: 'relative' }}>
        {isActive && elementPosition && (
          <>
            <Overlay data-walkthrough-overlay />
            <Spotlight position={elementPosition} />
            <TooltipContent
              data-walkthrough-tooltip
              style={{
                position: 'fixed',
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                opacity: elementPosition ? 1 : 0,
                transform: elementPosition ? 'scale(1)' : 'scale(0.95)',
              }}
            >
              <TooltipTitle variant="h6">
                {steps[currentStep]?.title}
              </TooltipTitle>
              <TooltipDescription>
                {steps[currentStep]?.content}
              </TooltipDescription>
              {steps[currentStep]?.requiredInteraction?.message && (
                <RequiredMessage>
                  {steps[currentStep].requiredInteraction.message}
                </RequiredMessage>
              )}
              <TooltipFooter>
                <StepIndicator>
                  {steps.map((_, index) => (
                    <StepDot key={index} active={index === currentStep} />
                  ))}
                </StepIndicator>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <NavigationButton
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    size="small"
                    color="primary"
                  >
                    <ArrowBack fontSize="small" />
                  </NavigationButton>
                  <NavigationButton
                    onClick={handleNext}
                    disabled={!interactionComplete}
                    size="small"
                    color="primary"
                  >
                    <ArrowForward fontSize="small" />
                  </NavigationButton>
                </div>
              </TooltipFooter>
            </TooltipContent>
          </>
        )}
        {children}
      </div>
    </WalkthroughContext.Provider>
  );
};
