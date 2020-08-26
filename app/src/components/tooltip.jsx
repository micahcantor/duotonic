import React, { cloneElement } from "react";
import "../styles/styles.css"
import { useTooltip, TooltipPopup } from "@reach/tooltip";
import Portal from "@reach/portal";
import "../styles/tooltip_styles.css";

const TriangleTooltip = ({ children, label, "aria-label": ariaLabel }) => {
    const [trigger, tooltip] = useTooltip();
    const { isVisible, triggerRect } = tooltip;
    return (
        <>
            {cloneElement(children, trigger)}
            {isVisible && (
                <Portal>
                    <div
                        style={{
                            borderBottom: "10px solid #222",
                            borderLeft: "10px solid transparent",
                            borderRight: "10px solid transparent",
                            height: 0,
                            left: triggerRect
                                ? triggerRect.left - 10 + triggerRect.width / 2
                                : undefined,
                            position: "absolute",
                            top: triggerRect
                                ? triggerRect.bottom + window.scrollY
                                : undefined,
                            width: 0,
                        }}
                    />
                </Portal>
            )}
            <TooltipPopup
                {...tooltip}
                aria-label={ariaLabel}
                label={label}
                position={centered}
                style={{
                    backgroundColor: "#222",
                    border: "none",
                    borderRadius: "3px",
                    color: "#fff",
                    padding: "0.5em 1em",
                    fontSize: "15px",
                    fontWeight: "600",
                    zIndex: "50"
                }}
            />
        </>
    );
}

const centered = (triggerRect, tooltipRect) => { 
    const triggerCenter = triggerRect.left + triggerRect.width / 2; 
    const left = triggerCenter - tooltipRect.width / 2; 
    const maxLeft = window.innerWidth - tooltipRect.width - 2; 
    return { 
        left: Math.min(Math.max(2, left), maxLeft) + window.scrollX, 
        top: triggerRect.bottom + 8 + window.scrollY, 
    }; 
};

export default TriangleTooltip;