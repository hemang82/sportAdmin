import React from 'react';
import { RotatingTriangles, Triangle } from 'react-loader-spinner';
import AppIcon from '../assets/Images/AppIcon.svg';

export default function Spinner({ message, isActive }) {
    if (!isActive) return <></>;
   
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Set the background color with transparency
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
        }}>
            <Triangle
                height="80"
                width="80"
                color="#023F7A"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            {message && <h4 className='mt-3' style={{ color: '#023F7A' }}>{message}</h4>}
        </div>
    );
}

// export default function Spinner({ message, isActive }) {
//     // if (!isActive) return null; // Ensures hooks are not conditionally rendered

//     return (
//         <div style={spinnerStyles.container}>
//             <div style={spinnerStyles.spinner}>
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 100 100"
//                     fill="none"
//                     stroke="#74419D"
//                     strokeWidth="4"
//                     style={spinnerStyles.svg}
//                 >
//                     {/* Outer Circle */}
//                     <circle cx="50" cy="50" r="40" stroke="#74419D" strokeWidth="5" fill="none" />
//                     {/* Inner Circle */}
//                     <circle cx="50" cy="50" r="12" fill="#74419D" />
//                     {/* Rotating Triangles */}
//                     {[...Array(8)].map((_, i) => (
//                         <g key={i} transform={`rotate(${i * 45} 50 50)`}>
//                             <polygon points="50,8 55,25 50,18 45,25" fill="#74419D" />
//                         </g>
//                     ))}
//                 </svg>
//             </div>
//             {message && <h4 className="mt-3" style={{ color: '#74419D' }}>{message}</h4>}
//             <style>
//                 {`
//                     @keyframes spin {
//                         0% { transform: rotate(0deg); }
//                         100% { transform: rotate(360deg); }
//                     }
//                 `}
//             </style>
//         </div>
//     );
// }

const spinnerStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
    },
    spinner: {
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        width: '100%',
        height: '100%',
        animation: 'spin 5s linear infinite',
        transformOrigin: 'center',
    },
};

// **SVG Loader Component**
// const YourSVGComponent = () => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 100 100"
//         fill="none"
//         stroke="#74419D"
//         strokeWidth="4"
//         style={{
//             width: '100%',
//             height: '100%',
//             animation: 'spin 5s linear infinite',
//             transformOrigin: 'center',
//         }}
//     >
//         {/* **Outer Circular Border** */}
//         <circle cx="50" cy="50" r="40" stroke="#74419D" strokeWidth="5" fill="none" />

//         {/* **Inner Circle** */}
//         <circle cx="50" cy="50" r="12" fill="#74419D" />

//         {/* **Rotating Triangle Elements** */}
//         {[...Array(8)].map((_, i) => (
//             <g key={i} transform={`rotate(${i * 45} 50 50)`}>
//                 <polygon points="50,8 55,25 50,18 45,25" fill="#74419D" />
//             </g>
//         ))}
//     </svg>
// );

