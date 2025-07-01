// import { useEffect, useMemo } from "react";

// const DisableSelectionStyle = ({ disable }) => {
//     // Memoized CSS string
//     const styleContent = useMemo(() => `
//     ::selection {
//       background: transparent;
//       color: inherit;
//     }
//     ::-moz-selection {
//       background: transparent;
//       color: inherit;
//     }
//     * {
//       user-select: none !important;
//       -webkit-user-select: none !important;
//       -moz-user-select: none !important;
//       -ms-user-select: none !important;
//     }
//   `, []);

//     useEffect(() => {
//         const styleId = "disable-selection-style";
//         const existingStyle = document.getElementById(styleId);

//         if (disable && !existingStyle) {
//             const styleTag = document.createElement("style");
//             styleTag.id = styleId;
//             styleTag.textContent = styleContent;
//             document.head.appendChild(styleTag);
//         }

//         if (!disable && existingStyle) {
//             existingStyle.remove();
//         }

//         // 🔒 Disable right-click context menu
//         const handleContextMenu = (e) => {
//             if (disable) {
//                 e.preventDefault();
//             }
//         };

//         document.addEventListener("contextmenu", handleContextMenu);

//         return () => {
//             const cleanupStyle = document.getElementById(styleId);
//             if (cleanupStyle) cleanupStyle.remove();

//             document.removeEventListener("contextmenu", handleContextMenu);
//         };
//     }, [disable, styleContent]);

//     return null;
// };

// export default DisableSelectionStyle;


import { useEffect, useMemo } from "react";

const DisableSelectionStyle = ({ disable }) => {
    const styleContent = ''
    
//     useMemo(() => `
//     ::selection {
//       background: transparent;
//       color: inherit;
//     }
//     ::-moz-selection {
//       background: transparent;
//       color: inherit;
//     }
//     * {
//       user-select: none !important;
//       -webkit-user-select: none !important;
//       -moz-user-select: none !important;
//       -ms-user-select: none !important;
//     }
//   `, []);

    useEffect(() => {
        const styleId = "disable-selection-style";
        let styleTag = document.getElementById(styleId);

        if (disable && !styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = styleId;
            styleTag.textContent = styleContent;
            document.head.appendChild(styleTag);
        }

        if (!disable && styleTag) {
            styleTag.remove();
        }

        const handleContextMenu = (e) => {
            if (disable) e.preventDefault();
        };

        // 👉 Combined keydown handler including your provided logic
        const handleKeyDown = (e) => {
            if (!disable) return;

            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key.toUpperCase())) ||
                (e.ctrlKey && e.key.toUpperCase() === "U")
            ) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        window.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("keydown", handleKeyDown);
            const styleToRemove = document.getElementById(styleId);
            if (styleToRemove) styleToRemove.remove();
        };
    }, [disable, styleContent]);

    return null;
};

export default DisableSelectionStyle;

